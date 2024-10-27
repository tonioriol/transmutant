import { Extra, Schema } from './types'

export * from './types'

/**
 * Transmutes an object from the Source type into the Target type based on the provided schema
 * @template Source - The source type being transmuted from
 * @template Target - The target type being transmuted to
 * @template TExtra - Type of additional data passed to mutation functions
 * @param schema - Array of mutation rules
 * @param source - Source object to transmute
 * @param extra - Optional extra data to pass to mutation functions
 * @returns Transmuted object matching Target type
 */
export const transmute = <Source, Target, TExtra extends Extra = Extra>(
  schema: Schema<Source, Target>[],
  source: Source,
  extra?: TExtra
): Target =>
  schema.reduce<Target>(
    (acc, { from, to, fn }) => ({
      ...acc,
      [to]: fn ? fn({ source, from, extra }) : from && source[from] ? source[from] : null
    }),
    {} as Target
  )

