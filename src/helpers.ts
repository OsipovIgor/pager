/**
 * Возвращает значение по свойству объекта
 */
export function prop<T, K extends keyof T>(obj: T, key: K) {
  return obj[key];
}

export function extend<T, U>(left: T, right: U): T & U {
  return { ...left, ...right };
}

export function pick<T, K extends keyof T>(current: T, ...keys: K[]): Pick<T, K> {
  return keys.reduce((acc, key) => {
    acc[key] = current[key];
    return acc;
  }, {} as Pick<T, K>);
}

export function omit<T, K extends keyof T>(current: T, ...keys: K[]): Omit<T, K> {
  return keys.reduce(
    (acc, key) => {
      delete acc[key];
      return acc;
    },
    { ...current }
  );
}

export function identity<T>(value: T): T {
  return value;
}