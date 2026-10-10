export const yearsSince = (isoDate: string): number => {
  const start = new Date(isoDate);
  if (isNaN(start.getTime())) return 0;
  const now = new Date();
  let years = now.getFullYear() - start.getFullYear();
  if (
    now.getMonth() < start.getMonth() ||
    (now.getMonth() === start.getMonth() && now.getDate() < start.getDate())
  ) {
    years--;
  }
  return Math.max(years, 0);
};

export const fillYears = (text: string, years: number) =>
  text.replace(/\{years\}/g, String(years));

export const sortApps = <T extends { order?: number; year?: number }>(apps: T[]) =>
  [...apps].sort(
    (a, b) => (a.order ?? 999) - (b.order ?? 999) || (b.year ?? 0) - (a.year ?? 0)
  );
