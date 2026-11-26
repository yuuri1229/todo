import { FormEvent, useEffect, useState } from "react";
import { onAuthStateChanged, signInWithPopup, signOut, User } from "firebase/auth";
import { auth, googleProvider } from "./firebase";
import { addTask, patchTask, pickFocus, removeTask, subscribeTasks, Task } from "./tasks";
import { elapsedRatio, leftText, Urgency, urgencyOf, URGENCY_LABEL } from "./urgency";

function useNow(ms = 30_000) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), ms); return () => clearInterval(t); }, [ms]);
  return now;
}

export function App() {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  useEffect(() => onAuthStateChanged(auth, setUser), []);

  if (user === undefined) return <main className="center">読み込み中…</main>;
  if (!user) {
    return (
      <main className="center">
        <h1>ADHD ToDo</h1>
        <p>期限を色と残り時間で見るToDo。ログインすると、どの端末でも同じ内容が使えます。</p>
        <button className="primary" onClick={() => signInWithPopup(auth, googleProvider)}>Googleでログイン</button>
      </main>
    );
  }
  return <Board user={user} />;
}

function Board({ user }: { user: User }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const now = useNow();
  useEffect(() => subscribeTasks(user.uid, setTasks), [user.uid]);
  const { focus, rest } = pickFocus(tasks);
  const done = tasks.filter((t) => t.done);

  return (
    <main>
      <header>
        <h1>今日の3つ</h1>
        <button className="ghost" onClick={() => signOut(auth)}>ログアウト</button>
      </header>
      <AddForm uid={user.uid} />
      <ul className="list">
        {focus.map((t) => <Item key={t.id} t={t} uid={user.uid} now={now} big />)}
        {focus.length === 0 && <li className="empty">タスクはありません。上の入力欄から追加できます。</li>}
      </ul>
      {rest.length > 0 && (
        <details>
          <summary>その他 {rest.length}件</summary>
          <ul className="list">{rest.map((t) => <Item key={t.id} t={t} uid={user.uid} now={now} />)}</ul>
        </details>
      )}
      {done.length > 0 && (
        <details>
          <summary>完了 {done.length}件</summary>
          <ul className="list">{done.map((t) => <Item key={t.id} t={t} uid={user.uid} now={now} />)}</ul>
        </details>
      )}
    </main>
  );
}

function AddForm({ uid }: { uid: string }) {
  const [title, setTitle] = useState("");
  const [due, setDue] = useState("");
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    addTask(uid, title.trim(), due ? new Date(due).getTime() : null);
    setTitle(""); setDue("");
  };
  return (
    <form className="add" onSubmit={submit}>
      <input id="title" placeholder="思いついたことを入力" value={title} onChange={(e) => setTitle(e.target.value)} />
      <input id="due" type="datetime-local" aria-label="期限" value={due} onChange={(e) => setDue(e.target.value)} />
      <button className="primary" type="submit">追加</button>
    </form>
  );
}

function Item({ t, uid, now, big }: { t: Task; uid: string; now: number; big?: boolean }) {
  const u: Urgency = t.done ? "done" : urgencyOf(t.dueAt, now);
  return (
    <li className={`item u-${u}${big ? " big" : ""}`}>
      <input type="checkbox" aria-label="完了" checked={t.done} onChange={() => patchTask(uid, t.id, { done: !t.done })} />
      <div className="body">
        <span className="title">{t.title}</span>
        {t.dueAt != null && !t.done && (
          <>
            <span className="meta"><b className="badge">{URGENCY_LABEL[u]}</b> {leftText(t.dueAt, now)}</span>
            <div className="bar"><i style={{ width: `${elapsedRatio(t.createdAt, t.dueAt, now) * 100}%` }} /></div>
          </>
        )}
      </div>
      <button className="ghost" aria-label="★" onClick={() => patchTask(uid, t.id, { starred: !t.starred })}>{t.starred ? "★" : "☆"}</button>
      <button className="ghost" aria-label="削除" onClick={() => removeTask(uid, t.id)}>✕</button>
    </li>
  );
}
