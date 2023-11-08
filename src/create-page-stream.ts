type PaginatedList<T> = {
  results?: T[]
  hasNextPage: boolean
}

type PaginatedListFn<T> = (options: {
  page: number
  pageSize: number
}) => Promise<PaginatedList<T> | Error>

type CreatePageStreamOptions = {
  page?: number
  pageSize: number
}

async function* createPageStream<T>(
  options: CreatePageStreamOptions,
  fn: PaginatedListFn<T>,
) {
  const { pageSize } = options
  let page = options.page ?? 1

  while (true) {
    // eslint-disable-next-line no-await-in-loop
    const result = await fn({ page, pageSize })
    if (result instanceof Error) {
      return
    }

    if (result.results) {
      for (const item of result.results) {
        yield item
      }
    }

    page += 1
    if (!result.hasNextPage) {
      break
    }
  }
}

export { createPageStream }
