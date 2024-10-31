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
export const transmute = <Source, Target, Extra = unknown>(
  schema: Schema<Source, Target, Extra>[],
  source: Source,
  extra?: Extra
): Target =>
  schema.reduce<Target>(
    (acc, { from, to }) => ({
      ...acc,
      [to]: typeof from === 'function' ? from({ source, extra }) : source[from]
    }),
    {} as Target
  )
