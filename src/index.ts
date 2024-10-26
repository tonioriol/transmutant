import { Extra, Schema } from './types'

export * from './types'

/**
 * Transforms a source entity into a target type based on the provided schema
 * @template From - The source type being mutated from
 * @template To - The target type being mutated to
 * @template TExtra - Type of additional data passed to mutation functions
 * @param schema - Array of transformation rules
 * @param entity - Source entity to transform
 * @param extra - Optional extra data to pass to mutation functions
 * @returns Transformed entity matching target type
 */
export const mutate = <From, To, TExtra extends Extra = Extra>(
  schema: Schema<From, To>[],
  entity: From,
  extra?: TExtra
): To =>
  schema.reduce<To>((acc, rule) => {
    const value = 'fn' in rule
      ? rule.fn({ entity, from: 'from' in rule ? rule.from : undefined, extra })
      : entity[rule.from]

    return {
      ...acc,
      [rule.to]: value
    }
  }, {} as To)
