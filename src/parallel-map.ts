import { errorBoundary, errorListBoundary } from '@stayradiated/error-boundary'
import unsafeParallelMap from 'p-map'
import type { Options as ParallelMapOptions } from 'p-map'

const defaultParallelmapOptions = {
  concurrency: 30,
}

const parallelMap = async <T, R>(
  stream: AsyncIterable<T> | Iterable<T>,
  fn: (item: T) => Promise<R | Error>,
  options: ParallelMapOptions = defaultParallelmapOptions,
): Promise<R[] | Error> => {
  return errorListBoundary(async () =>
    unsafeParallelMap(
      stream,
      async (element) => errorBoundary(async () => fn(element)),
      options,
    ),
  )
}

export { parallelMap }
