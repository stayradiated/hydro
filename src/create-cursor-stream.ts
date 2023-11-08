type PaginatedList<T> = {
  next?: string | undefined
  results?: T[]
}

type PaginatedListFn<T> = (options: {
  cursor: string | undefined
  pageSize: number
}) => Promise<PaginatedList<T> | Error>

async function* createCursorStream<T>(fn: PaginatedListFn<T>) {
  let cursor: string | undefined
  const pageSize = 100

  while (true) {
    // eslint-disable-next-line no-await-in-loop
    const result = await fn({ cursor, pageSize })
    if (result instanceof Error) {
      return
    }

    if (result.results) {
      for (const item of result.results) {
        yield item
      }
    }

    cursor = result.next ?? undefined
    if (!cursor) {
      // End of the stream
      break
    }
  }
}

export { createCursorStream }
