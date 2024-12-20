import { useLoaderData as remixuseLoaderData } from '@remix-run/react'

export const useLoaderData = <T>() => {
  const data = remixuseLoaderData()

  return data as T
}
