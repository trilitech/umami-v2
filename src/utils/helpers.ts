export function filterNulls<T>(arr: Array<T | null>): T[] {
  return arr.filter((v) => v !== null) as T[];
}

export function objectMap<T, R>(obj: Record<string, T>, fn: (v: T) => R) {
  return Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, fn(v)]));
}

export function roundTo(num: number, place: number): number {
  const numString = Number(num).toFixed(6);
  return (
    Math.round((Number(numString) + Number.EPSILON) * Math.pow(10, place)) /
    Math.pow(10, place)
  );
}
