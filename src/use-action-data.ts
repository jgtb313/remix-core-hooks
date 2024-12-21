import { useActionData as remixuseActionData } from '@remix-run/react'

export const useActionData = <T>() => {
  const data = remixuseActionData()

  return data as T
}
