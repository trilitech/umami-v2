export function filterNulls<T>(arr: Array<T | null>): T[] {
  return arr.filter((v) => v !== null) as T[];
}

export function objectMap<T, R>(obj: Record<string, T>, fn: (v: T) => R) {
  return Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, fn(v)]));
}

export function nullableMul(x: number | null, y: number | null): number | null {
  return x && y && x * y;
}
