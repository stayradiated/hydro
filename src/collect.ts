const collect = async <T>(
  gen: AsyncIterable<T> | Iterable<T>,
): Promise<T[]> => {
  const out: T[] = []
  for await (const x of gen) {
    out.push(x)
  }

  return out
}

export { collect }
