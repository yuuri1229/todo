export type Urgency = "none" | "ok" | "soon" | "today" | "over" | "done";

const H = 3600_000;

export function urgencyOf(dueAt: number | null, now: number): Urgency {
  if (dueAt == null) return "none";
  const left = dueAt - now;
  if (left < 0) return "over";
  if (left <= 24 * H) return "today";
  if (left <= 72 * H) return "soon";
  return "ok";
}

export const URGENCY_LABEL: Record<Urgency, string> = {
  none: "期限なし", ok: "余裕あり", soon: "そろそろ", today: "今日まで", over: "期限切れ", done: "完了",
};

export function leftText(dueAt: number | null, now: number): string {
  if (dueAt == null) return "";
  const diff = dueAt - now;
  const abs = Math.abs(diff);
  const text = abs < H ? `${Math.max(1, Math.round(abs / 60_000))}分`
    : abs < 24 * H ? `${Math.round(abs / H)}時間`
    : `${Math.round(abs / (24 * H))}日`;
  return diff < 0 ? `${text}前に期限` : `あと ${text}`;
}

/** 作成時から期限までのうち、どれだけ時間が過ぎたか (0〜1) */
export function elapsedRatio(createdAt: number, dueAt: number | null, now: number): number {
  if (dueAt == null) return 0;
  const total = dueAt - createdAt;
  if (total <= 0) return 1;
  return Math.min(1, Math.max(0, (now - createdAt) / total));
}
