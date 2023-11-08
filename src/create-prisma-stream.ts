import assert from 'node:assert'

type PrismaStreamCallbackFnOptions<Cursor> = {
  take: number
  skip: number
  cursor: Cursor | undefined
}

type FindManyFn<T, Cursor> = (
  options: PrismaStreamCallbackFnOptions<Cursor>,
) => Promise<T>

type GetCursorFn<T, Cursor> = (row: T) => Cursor

type CreatePrismaStreamOptions<T, Cursor> = {
  batchSize: number
  findMany: FindManyFn<T[], Cursor>
  getCursor: GetCursorFn<T, Cursor>
}

async function* createPrismaStream<T, Cursor>(
  options: CreatePrismaStreamOptions<T, Cursor>,
) {
  const { batchSize, findMany, getCursor } = options

  assert(batchSize > 0, 'batchSize must be > 0')

  let cursor: Cursor | undefined

  while (true) {
    // eslint-disable-next-line no-await-in-loop
    const items = await findMany({
      take: batchSize,
      skip: cursor ? 1 : 0,
      cursor,
    })
    for (const item of items) {
      yield item
    }

    if (items.length < batchSize) {
      // End of the stream
      break
    }

    const lastItem = items.at(-1)
    assert(lastItem, 'Unexpected error accessing last item.')
    cursor = getCursor(lastItem)
  }
}

export { createPrismaStream }
