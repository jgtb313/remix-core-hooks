import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'

import { useRouter } from './use-router'

describe('useRouter', () => {
  it('should return initial pathname, search and path', () => {
    const { result } = renderHook(() => useRouter(), {
      wrapper: ({ children }) => <MemoryRouter initialEntries={['/test-path?key=value']}>{children}</MemoryRouter>
    })

    expect(result.current.pathname).toBe('/test-path')
    expect(result.current.search).toBe('?key=value')
    expect(result.current.path).toBe('/test-path?key=value')
    expect(result.current.query).toEqual({ key: 'value' })
  })

  it('should push a new path', () => {
    const { result } = renderHook(() => useRouter(), {
      wrapper: ({ children }) => <MemoryRouter>{children}</MemoryRouter>
    })

    act(() => {
      result.current.push('/new-path')
    })

    expect(result.current.pathname).toBe('/new-path')
  })

  it('should replace the current path', () => {
    const { result } = renderHook(() => useRouter(), {
      wrapper: ({ children }) => <MemoryRouter initialEntries={['/test-path']}>{children}</MemoryRouter>
    })

    act(() => {
      result.current.replace('/replaced-path')
    })

    expect(result.current.pathname).toBe('/replaced-path')
  })

  it('should update query params', () => {
    const { result } = renderHook(() => useRouter(), {
      wrapper: ({ children }) => <MemoryRouter initialEntries={['/test-path?key=value']}>{children}</MemoryRouter>
    })

    act(() => {
      result.current.update({ key: 'newValue' })
    })

    expect(result.current.query).toEqual({ key: 'newValue' })
    expect(result.current.search).toBe('?key=newValue')
  })

  it('should delete query params when they are set to undefined or empty', () => {
    const { result } = renderHook(() => useRouter(), {
      wrapper: ({ children }) => <MemoryRouter initialEntries={['/test-path?key=value&otherKey=']}>{children}</MemoryRouter>
    })

    act(() => {
      result.current.update({ key: undefined, otherKey: '' })
    })

    expect(result.current.query).toEqual({})
    expect(result.current.search).toBe('')
  })

  it('should handle back navigation', () => {
    const { result } = renderHook(() => useRouter(), {
      wrapper: ({ children }) => <MemoryRouter initialEntries={['/test-path']}>{children}</MemoryRouter>
    })

    const spy = vi.spyOn(result.current, 'back')

    act(() => {
      result.current.back()
    })

    expect(spy).toHaveBeenCalled()
  })

  it('should remove query params if empty or undefined', () => {
    const { result } = renderHook(() => useRouter(), {
      wrapper: ({ children }) => <MemoryRouter initialEntries={['/test-path?key=value&empty=']}>{children}</MemoryRouter>
    })

    act(() => {
      result.current.update({ key: undefined, empty: '' })
    })

    expect(result.current.query).toEqual({})
    expect(result.current.search).toBe('')
  })

  it.each([
    {
      path: '/test-path?key=value&valid=true',
      expected: { key: 'value', valid: true }
    },
    {
      path: '/test-path?key=value&valid=false',
      expected: { key: 'value', valid: false }
    }
  ])('should keep query params if they have valid values %s', ({ path, expected }) => {
    const { result } = renderHook(() => useRouter(), {
      wrapper: ({ children }) => <MemoryRouter initialEntries={[path]}>{children}</MemoryRouter>
    })

    expect(result.current.query).toStrictEqual(expected)
  })

  it('should correctly push to a new path', () => {
    const { result } = renderHook(() => useRouter(), {
      wrapper: ({ children }) => <MemoryRouter initialEntries={['/home']}>{children}</MemoryRouter>
    })

    act(() => {
      result.current.push('/new-path')
    })

    expect(result.current.pathname).toBe('/new-path')
    expect(result.current.search).toBe('')
  })

  it('should correctly update query params with multiple entries', () => {
    const { result } = renderHook(() => useRouter(), {
      wrapper: ({ children }) => <MemoryRouter initialEntries={['/test-path?key=value']}>{children}</MemoryRouter>
    })

    act(() => {
      result.current.update({ key: 'updatedValue', newKey: 'newValue' })
    })

    expect(result.current.query).toEqual({ key: 'updatedValue', newKey: 'newValue' })
    expect(result.current.search).toBe('?key=updatedValue&newKey=newValue')
  })

  it('should correctly update query params with empty entries', () => {
    const { result } = renderHook(() => useRouter(), {
      wrapper: ({ children }) => <MemoryRouter initialEntries={['/test-path?key=value']}>{children}</MemoryRouter>
    })

    act(() => {
      result.current.update({})
    })

    expect(result.current.query).toEqual({})
    expect(result.current.search).toBe('')
  })

  it('should return empty object if no query params are set', () => {
    const { result } = renderHook(() => useRouter(), {
      wrapper: ({ children }) => <MemoryRouter initialEntries={['/test-path']}>{children}</MemoryRouter>
    })

    expect(result.current.query).toEqual({})
  })

  it('should correctly update query params with the update function', () => {
    const { result } = renderHook(() => useRouter(), {
      wrapper: ({ children }) => <MemoryRouter initialEntries={['/test-path?key=value']}>{children}</MemoryRouter>
    })

    expect(result.current.query).toEqual({ key: 'value' })

    act(() => {
      result.current.update({ key: 'updatedValue', newKey: 'newValue' })
    })

    expect(result.current.query).toEqual({ key: 'updatedValue', newKey: 'newValue' })
    expect(result.current.search).toBe('?key=updatedValue&newKey=newValue')

    act(() => {
      result.current.update({ key: 'updatedValue' })
    })

    expect(result.current.query).toEqual({ key: 'updatedValue' })
    expect(result.current.search).toBe('?key=updatedValue')
  })
})
