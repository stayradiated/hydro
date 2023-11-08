async function* groupWith<T>(
  stream: AsyncIterable<T> | Iterable<T>,
  isSameGroup: (a: T, b: T) => boolean,
): AsyncIterable<T[]> {
  let currentGroup: T[] = []

  for await (const item of stream) {
    if (currentGroup.length === 0) {
      currentGroup.push(item)
      continue
    }

    const previousItem = currentGroup.at(-1)!
    if (isSameGroup(previousItem, item)) {
      currentGroup.push(item)
    } else {
      yield currentGroup
      currentGroup = [item]
    }
  }

  if (currentGroup.length > 0) {
    yield currentGroup
  }
}

export { groupWith }
