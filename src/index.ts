import { Schema } from './types'

export * from './types'

/**
 * Transmutes an object from the Source type into the Target type based on the provided schema
 * @template Source - The source type being transmuted from
 * @template Target - The target type being transmuted to
 * @template Extra - Type of additional data passed to mutation functions
 * @param schema - Array of mutation rules
 * @param source - Source object to transmute
 * @param extra - Optional extra data to pass to mutation functions
 * @returns Transmuted object matching Target type
 */
export const transmute = <Source, Target, Extra = undefined>(
  schema: Schema<Source, Target, Extra>[],
  source: Source,
  extra?: Extra
): Target => {
  return schema.reduce<Target>(
    (acc, { from, to }) => {
      const isFunction = typeof from === 'function'
      // Only include extra in args if it's defined
      const args: Extra extends undefined ? { source: Source } : { source: Source; extra: Extra } =
        extra === undefined
          ? { source }
          : { source, extra } as any // Type assertion needed due to conditional type

      const value = isFunction
        ? (from as Function)(args)
        : source[from]

      return {
        ...acc,
        [to]: value
      }
    },
    {} as Target
  )
}
