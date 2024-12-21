export const defineCookies = <T>(value: string) => {
  return value.split(';').reduce<T>((result, cookieItem) => {
    const [key, ...rest] = cookieItem.trim().split('=')

    if (key && rest.length) {
      const cookieValue = rest.join('=').trim()
      return { ...result, [key.trim()]: cookieValue }
    }

    return result
  }, {} as T)
}
