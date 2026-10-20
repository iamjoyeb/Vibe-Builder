/**
 * Browser-only IndexedDB storage for Vibe Builder projects and chat history.
 *
 * Rules (see AGENTS.md):
 * - Nothing in this module touches `window`, `indexedDB` or other browser
 *   globals at import time or during server rendering — they are only
 *   referenced inside the functions below, which run in the browser.
 * - One database connection is opened lazily and reused for every operation.
 * - No secrets of any kind are ever written here.
 *
 * Schema (version 1 — see AGENTS.md "Local storage schema"):
 * - "projects": keyPath "id", index "updatedAt".
 * - "messages": keyPath "id", compound index ["projectId", "createdAt"].
 */
import type { Project, ProjectMessage } from "@/types";

const DB_NAME = "vibe-builder";
const DB_VERSION = 1;
const STORE_PROJECTS = "projects";
const STORE_MESSAGES = "messages";
const INDEX_PROJECT_ORDER = "project_order";

/** Thrown when IndexedDB cannot be used at all (e.g. blocked by the browser). */
export class ProjectStoreUnavailableError extends Error {
  constructor(message = "IndexedDB is not available in this browser context.") {
    super(message);
    this.name = "ProjectStoreUnavailableError";
  }
}

/** Cached connection so we do not reopen the database for every operation. */
let dbPromise: Promise<IDBDatabase> | null = null;

function errorFromDom(error: DOMException | null, fallback: string): Error {
  if (error) {
    return new Error(`${fallback} (${error.name}: ${error.message})`);
  }
  return new Error(fallback);
}

function newId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `id-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function nowIso(): string {
  return new Date().toISOString();
}

/** Resolves when a read/write transaction has committed; rejects on abort. */
function waitTransaction(transaction: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onabort = () =>
      reject(
        errorFromDom(
          transaction.error,
          "Local storage transaction failed — the write was rolled back.",
        ),
      );
  });
}

/** Resolves with the result of an IDBRequest (getAll, get, ...). */
function requestToValue<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () =>
      reject(errorFromDom(request.error, "Local storage request failed."));
  });
}

function openDatabase(): Promise<IDBDatabase> {
  if (typeof window === "undefined" || typeof indexedDB === "undefined") {
    return Promise.reject(
      new ProjectStoreUnavailableError(
        "IndexedDB is not available (server rendering or restricted browser).",
      ),
    );
  }

  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_PROJECTS)) {
        const projects = db.createObjectStore(STORE_PROJECTS, {
          keyPath: "id",
        });
        projects.createIndex("updatedAt", "updatedAt");
      }
      if (!db.objectStoreNames.contains(STORE_MESSAGES)) {
        const messages = db.createObjectStore(STORE_MESSAGES, { keyPath: "id" });
        messages.createIndex(INDEX_PROJECT_ORDER, ["projectId", "createdAt"]);
      }
    };

    request.onblocked = () => {
      reject(
        new ProjectStoreUnavailableError(
          "The database upgrade is waiting on another tab. Close other Vibe Builder tabs and try again.",
        ),
      );
    };

    request.onerror = () =>
      reject(errorFromDom(request.error, "Could not open the local database."));

    request.onsuccess = () => {
      const db = request.result;
      // Yield cleanly if a newer tab upgrades the schema, so an old
      // connection never keeps a delete/upgrade of the database blocked.
      db.onversionchange = () => {
        db.close();
        dbPromise = null;
      };
      db.onclose = () => {
        dbPromise = null;
      };
      resolve(db);
    };
  });

  // Allow a later retry instead of caching a failed connection forever.
  dbPromise.catch(() => {
    dbPromise = null;
  });

  return dbPromise;
}

function projectsRange(projectId: string): IDBKeyRange {
  // Compound key [projectId, createdAt]; ISO strings sort lexically,
  // so an empty lower bound and a maximal upper bound cover the project.
  return IDBKeyRange.bound([projectId, ""], [projectId, "\uffff"]);
}

/** All projects, most recently updated first. */
export async function listProjects(): Promise<Project[]> {
  const db = await openDatabase();
  const store = db
    .transaction(STORE_PROJECTS, "readonly")
    .objectStore(STORE_PROJECTS);
  const records = await requestToValue(
    store.getAll() as unknown as IDBRequest<Project[]>,
  );
  return records.sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
}

/** A single project by ID, or undefined when it does not exist. */
export async function getProject(
  projectId: string,
): Promise<Project | undefined> {
  const db = await openDatabase();
  const store = db
    .transaction(STORE_PROJECTS, "readonly")
    .objectStore(STORE_PROJECTS);
  return await requestToValue(
    store.get(projectId) as unknown as IDBRequest<Project | undefined>,
  );
}

export async function createProject(
  name = "Untitled project",
): Promise<Project> {
  const db = await openDatabase();
  const project: Project = {
    id: newId(),
    name,
    createdAt: nowIso(),
    updatedAt: nowIso(),
  };
  const transaction = db.transaction(STORE_PROJECTS, "readwrite");
  transaction.objectStore(STORE_PROJECTS).add(project);
  await waitTransaction(transaction);
  return project;
}

async function updateProjectRecord(
  projectId: string,
  update: (project: Project) => Project,
): Promise<Project> {
  const db = await openDatabase();
  const transaction = db.transaction(STORE_PROJECTS, "readwrite");
  const store = transaction.objectStore(STORE_PROJECTS);
  const stored = await requestToValue(
    store.get(projectId) as unknown as IDBRequest<Project | undefined>,
  );
  if (!stored) {
    await waitTransaction(transaction).catch(() => {});
    transaction.abort();
    throw new Error("The selected project could not be found in local storage.");
  }
  const updated = update(stored);
  store.put(updated);
  await waitTransaction(transaction);
  return updated;
}

export async function renameProject(
  projectId: string,
  name: string,
): Promise<Project> {
  const trimmed = name.trim();
  if (!trimmed) throw new Error("A project name cannot be empty.");
  return await updateProjectRecord(projectId, (project) => ({
    ...project,
    name: trimmed,
    // Renaming counts as an update so the project rises to the top.
    updatedAt: nowIso(),
  }));
}

/** Projects are read-only here at the moment; kept for API completeness. */
export async function touchProject(projectId: string): Promise<Project> {
  return await updateProjectRecord(projectId, (project) => ({
    ...project,
    updatedAt: nowIso(),
  }));
}

/**
 * Appends a user message and touches the project inside one transaction.
 * Returns both the stored message and the updated project so the UI can
 * refresh its ordering without a second read.
 */
export async function appendMessage(
  projectId: string,
  content: string,
): Promise<{ message: ProjectMessage; project: Project }> {
  const db = await openDatabase();
  const message: ProjectMessage = {
    id: newId(),
    projectId,
    // "assistant" is reserved for real agent replies in a later task;
    // placeholders and system notices are never persisted.
    role: "user",
    content,
    createdAt: nowIso(),
  };

  const transaction = db.transaction(
    [STORE_MESSAGES, STORE_PROJECTS],
    "readwrite",
  );
  const messageStore = transaction.objectStore(STORE_MESSAGES);
  const projectStore = transaction.objectStore(STORE_PROJECTS);

  const stored = await requestToValue(
    projectStore.get(projectId) as unknown as IDBRequest<Project | undefined>,
  );
  if (!stored) {
    await waitTransaction(transaction).catch(() => {});
    transaction.abort();
    throw new Error("The selected project no longer exists in local storage.");
  }

  const project: Project = { ...stored, updatedAt: message.createdAt };
  messageStore.add(message);
  projectStore.put(project);
  await waitTransaction(transaction);
  return { message, project };
}

/** Messages for one project, oldest first (chronological). */
export async function listMessages(
  projectId: string,
): Promise<ProjectMessage[]> {
  const db = await openDatabase();
  const index = db
    .transaction(STORE_MESSAGES, "readonly")
    .objectStore(STORE_MESSAGES)
    .index(INDEX_PROJECT_ORDER);
  const records = await requestToValue(
    index.getAll(projectsRange(projectId)) as unknown as IDBRequest<
      ProjectMessage[]
    >,
  );
  // getAll on an index yields index-key order; sort again defensively.
  return records.sort((a, b) => (a.createdAt < b.createdAt ? -1 : 1));
}

/**
 * Deletes a project and every message belonging to it in one transaction.
 * Safe to call for an ID that no longer exists (no-op).
 */
export async function deleteProject(projectId: string): Promise<void> {
  const db = await openDatabase();
  const transaction = db.transaction(
    [STORE_MESSAGES, STORE_PROJECTS],
    "readwrite",
  );

  const cursorRequest = transaction
    .objectStore(STORE_MESSAGES)
    .index(INDEX_PROJECT_ORDER)
    .openCursor(projectsRange(projectId));
  cursorRequest.onsuccess = () => {
    const cursor = cursorRequest.result;
    if (cursor) {
      cursor.delete();
      cursor.continue();
    }
  };

  transaction.objectStore(STORE_PROJECTS).delete(projectId);
  await waitTransaction(transaction);
}
