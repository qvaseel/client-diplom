function getMonday(date: Date): Date {
  const day = date.getDay(); // 0 (воскресенье) — 6 (суббота)
  const diff = day === 0 ? -6 : 1 - day; // если воскресенье, то -6, иначе сдвиг до понедельника
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + diff);
}