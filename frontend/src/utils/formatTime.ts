/** Formats a duration in seconds as minutes and seconds. */
export function formatTime(totalSeconds: number | null): string {
  const safeSeconds = Math.max(0, totalSeconds ?? 0);
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}
