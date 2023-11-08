import { assertError } from '@stayradiated/error-boundary'
import { expect, test } from 'vitest'
import { parallelMap } from './parallel-map.js'

test('should catch thrown error', async () => {
  const list = [1, 2, 3]

  const result = await parallelMap(list.values(), (item) => {
    throw new Error(`Fail ${item}`)
  })
  assertError(result)

  expect(result.message).toBe(
    `E_MULTI: Caught 3 errors: [Fail 1, Fail 2, Fail 3]`,
  )
})
