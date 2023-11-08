import { expect, test } from 'vitest'
import { collect } from './collect.js'
import { groupWith } from './group-with.js'

test('handle empty list', async () => {
  const list: unknown[] = []
  const result = await collect(groupWith(list.values(), () => true))
  expect(result).toStrictEqual([])
})

test('handle single value', async () => {
  const list = [1]
  const result = await collect(groupWith(list.values(), () => true))
  expect(result).toStrictEqual([[1]])
})

test('group numbers by odd/even-ness', async () => {
  const list = [0, 1, 1, 2, 3, 5, 8, 13, 21]
  const isEqual = (a: number, b: number) => a % 2 === b % 2

  const result = await collect(groupWith(list.values(), isEqual))

  expect(result).toStrictEqual([[0], [1, 1], [2], [3, 5], [8], [13, 21]])
})

test('group objects by field', async () => {
  const list = [
    { group: 'a' },
    { group: 'a' },
    { group: 'b' },
    { group: 'c' },
    { group: 'c' },
  ]
  const result = await collect(
    groupWith(list.values(), (a, b) => a.group === b.group),
  )
  expect(result).toStrictEqual([
    [{ group: 'a' }, { group: 'a' }],
    [{ group: 'b' }],
    [{ group: 'c' }, { group: 'c' }],
  ])
})
