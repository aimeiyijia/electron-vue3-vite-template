export function getCamelCase(str) {
  return str.replace(/-([a-z])/g, function (all, i) {
    return i.toUpperCase()
  })
}

export const toArray = <T>(item: T | T[]): T[] => (Array.isArray(item) ? item : [item])
