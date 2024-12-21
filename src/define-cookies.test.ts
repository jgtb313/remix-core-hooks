import { describe, it, expect } from 'vitest'

import { defineCookies } from './define-cookies'

describe('defineCookies', () => {
  it('should correctly parse cookies into an object', () => {
    const cookies = 'key1=value1; key2=value2; key3=value3'
    const result = defineCookies<{ [key: string]: string }>(cookies)

    expect(result).toEqual({
      key1: 'value1',
      key2: 'value2',
      key3: 'value3'
    })
  })

  it('should trim spaces from cookie keys and values', () => {
    const cookies = ' key1 = value1 ; key2 = value2 '
    const result = defineCookies<{ [key: string]: string }>(cookies)

    expect(result).toEqual({
      key1: 'value1',
      key2: 'value2'
    })
  })

  it('should handle an empty cookie string', () => {
    const cookies = ''
    const result = defineCookies<{ [key: string]: string }>(cookies)

    expect(result).toEqual({})
  })

  it('should handle malformed cookies (no "=" sign)', () => {
    const cookies = 'key1value1; key2=value2'
    const result = defineCookies<{ [key: string]: string }>(cookies)

    expect(result).toEqual({
      key2: 'value2'
    })
  })

  it('should handle cookies with multiple "=" signs', () => {
    const cookies = 'key1=value1=value2; key2=value2'
    const result = defineCookies<{ [key: string]: string }>(cookies)

    expect(result).toEqual({
      key1: 'value1=value2',
      key2: 'value2'
    })
  })

  it('should handle cookies with spaces around the "=" sign', () => {
    const cookies = ' key1 = value1 ; key2 = value2 '
    const result = defineCookies<{ [key: string]: string }>(cookies)

    expect(result).toEqual({
      key1: 'value1',
      key2: 'value2'
    })
  })
})
