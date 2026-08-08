// Universal key-value storage that works on native (Expo) and web.
// Expo polyfills `localStorage` on native, but we guard just in case.

const memory = {}
const hasLocal = typeof globalThis !== 'undefined' && typeof globalThis.localStorage !== 'undefined'

export function loadJSON(key, fallback) {
  try {
    if (hasLocal) {
      const raw = globalThis.localStorage.getItem(key)
      return raw ? JSON.parse(raw) : fallback
    }
    return memory[key] ? JSON.parse(memory[key]) : fallback
  } catch {
    return fallback
  }
}

export function saveJSON(key, value) {
  try {
    const raw = JSON.stringify(value)
    if (hasLocal) globalThis.localStorage.setItem(key, raw)
    else memory[key] = raw
  } catch {
    /* ignore */
  }
}

export function removeKey(key) {
  try {
    if (hasLocal) globalThis.localStorage.removeItem(key)
    else delete memory[key]
  } catch {
    /* ignore */
  }
}
