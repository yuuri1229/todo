import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, updateDoc } from "firebase/firestore";
import { db } from "./firebase";

export interface Task {
  id: string;
  title: string;
  dueAt: number | null;
  starred: boolean;
  done: boolean;
  createdAt: number;
}

const col = (uid: string) => collection(db, "users", uid, "tasks");

export function subscribeTasks(uid: string, cb: (tasks: Task[]) => void) {
  return onSnapshot(query(col(uid), orderBy("createdAt", "desc")), (snap) =>
    cb(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Task, "id">) }))),
  );
}

export const addTask = (uid: string, title: string, dueAt: number | null) =>
  addDoc(col(uid), { title, dueAt, starred: false, done: false, createdAt: Date.now() });

export const patchTask = (uid: string, id: string, patch: Partial<Omit<Task, "id">>) =>
  updateDoc(doc(db, "users", uid, "tasks", id), patch);

export const removeTask = (uid: string, id: string) => deleteDoc(doc(db, "users", uid, "tasks", id));

/** 今日やる3つ: ★付き → 期限が近い順 */
export function pickFocus(tasks: Task[]): { focus: Task[]; rest: Task[] } {
  const open = tasks.filter((t) => !t.done).sort((a, b) => {
    if (a.starred !== b.starred) return a.starred ? -1 : 1;
    return (a.dueAt ?? Infinity) - (b.dueAt ?? Infinity);
  });
  return { focus: open.slice(0, 3), rest: open.slice(3) };
}
