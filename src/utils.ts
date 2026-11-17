export function readLocalStorage<T>(key: string, fallback: T): T {
  try {
    const value = localStorage.getItem(key)
    return value == null ? fallback : (JSON.parse(value) as T)
  } catch {
    return fallback
  }
}

export function writeLocalStorage<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value))
}

export const sleep = (ms: number) => new Promise<void>(r => setTimeout(r, ms));

export function nextClick(target: EventTarget = document): Promise<MouseEvent | KeyboardEvent> {
  return new Promise((resolve) => {
    const ac = new AbortController();
    const done = (e: Event) => {
      ac.abort()
      resolve(e as MouseEvent | KeyboardEvent)
    }
    target.addEventListener("click", done, { signal: ac.signal })
    target.addEventListener("keydown", done, { signal: ac.signal })
  });
}