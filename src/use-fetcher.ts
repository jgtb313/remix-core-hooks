import { useFetcher as remixUseFetcher } from '@remix-run/react'

export const useFetcher = <T>() => {
  const fetcher = remixUseFetcher()

  return {
    submit: fetcher.submit,
    load: fetcher.load,
    data: fetcher.data as T | undefined,
    loading: fetcher.state === 'submitting'
  }
}
