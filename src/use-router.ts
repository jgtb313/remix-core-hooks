import { useState } from 'react'
import { useNavigate, useLocation, useParams } from '@remix-run/react'
import isString from 'lodash.isstring'
import isUndefined from 'lodash.isundefined'
import set from 'lodash.set'

const setupQueryParamsValue = (value: string) => {
  if (value === 'false') {
    return false
  }

  if (value === 'true') {
    return true
  }

  return value
}

const isEmptyString = (value: unknown) => isString(value) && !value

const queryParamsToObject = <T>(search: string) => {
  const params = new URLSearchParams(search)
  const obj = {}

  for (const [key, value] of params.entries()) {
    set(obj, key, setupQueryParamsValue(value))
  }

  return obj as T
}

export const useRouter = <T = unknown, K = unknown>() => {
  const navigate = useNavigate()
  const location = useLocation()
  const params = useParams()
  const [locationSearch, setLocationSearch] = useState(location.search)

  const push = (path: string) => {
    navigate(path)
  }

  const replace = (path: string) => {
    navigate(path, {
      replace: true
    })
  }

  const update = (query: Record<string, unknown>) => {
    const url = new URL(window.location.href)

    if (!Object.keys(query).length) {
      setLocationSearch('')
      window.history.replaceState({}, '', location.pathname)

      return
    }

    Object.entries(query).forEach(([key, value]) => {
      if (isUndefined(value) || isEmptyString(value)) {
        url.searchParams.delete(key)
        return
      }

      url.searchParams.set(key, `${value}`)
    })

    url.searchParams.forEach((_, key) => {
      if (!query[key]) {
        url.searchParams.delete(key)
      }
    })

    setLocationSearch(url.search)
    window.history.replaceState({}, '', url)
  }

  const back = () => {
    navigate(-1)
  }

  return {
    pathname: location.pathname,
    search: locationSearch,
    path: `${location.pathname}${locationSearch}`,
    query: queryParamsToObject<T>(locationSearch),
    params: params as K,
    push,
    replace,
    update,
    back
  }
}
