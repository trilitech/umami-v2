export function filterNulls<T>(arr: Array<T | null | undefined>): T[] {
  return arr.filter((v) => v != null) as T[];
}

export function objectMap<T, R>(obj: Record<string, T>, fn: (v: T) => R) {
  return Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, fn(v)]));
}

export function zip<A, B>(a: A[], b: B[]) {
  return a.map((k, i) => [k, b[i]] as [A, B]);
}

export function recordToMap<A extends string | number | symbol, B>(
  record: Record<A, B>
) {
  return new Map(Object.entries(record) as [A, B][]);
}
