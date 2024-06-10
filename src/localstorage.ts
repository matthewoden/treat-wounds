
export const getLocalState = <T>(key: string, defaultValue: T): T => {
  const state = localStorage.getItem(key)
  if (!state) {
    return defaultValue
  }

  if (Array.isArray(defaultValue)) {
    return JSON.parse(state)
  }

  return { ...defaultValue, ...JSON.parse(state) }
}

export const saveLocalState = <T>(key: string, value: T) => {
  localStorage.setItem(key, JSON.stringify(value))
  return value
}
