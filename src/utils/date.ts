/** Timestamp actual en ms (UNIX) */
export const generateTimestamp = (): number => Date.now();

/** Formato local: AAAA/MM/DD HH:MM:SS */
export const formatDateTime = (date: Date = new Date()): string => {
  const pad = (n: number) => n.toString().padStart(2, '0');

  const yyyy = date.getFullYear();
  const mm = pad(date.getMonth() + 1);
  const dd = pad(date.getDate());
  const hh = pad(date.getHours());
  const mi = pad(date.getMinutes());
  const ss = pad(date.getSeconds());

  return `${yyyy}/${mm}/${dd} ${hh}:${mi}:${ss}`;
};
