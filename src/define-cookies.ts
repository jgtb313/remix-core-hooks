export const defineCookies = <T>(value: string) => {
  return value.split(';').reduce<T>((result, cookieItem) => {
    const [key, value] = cookieItem.split('=')

    return { ...result, [key.trim()]: value }
  }, {} as T)
}
