/**
 * Represents additional data that can be passed to mutation functions
 */
export type Extra = Record<string, unknown>

/**
 * Arguments passed to a mutation function
 * @template From - The source type being mutated from
 */
export interface MutateFnArgs<From> {
  /** The source entity being transformed */
  entity: From
  /** Optional source property key */
  from?: keyof From
  /** Optional extra data to assist with transformation */
  extra?: Extra
}

/**
 * Function that performs a custom transformation on a source entity
 * @template From - The source type being mutated from
 */
export type MutateFn<From> = (args: MutateFnArgs<From>) => unknown

/**
 * Defines how a property should be transformed from source to target type
 * @template From - The source type being mutated from
 * @template To - The target type being mutated to
 */
export type Schema<From, To> =
  | {
  /** Target property key */
  to: keyof To
  /** Source property key for direct mapping */
  from: keyof From
}
  | {
  /** Target property key */
  to: keyof To
  /** Custom transformation function */
  fn: MutateFn<From>
}
  | {
  /** Target property key */
  to: keyof To
  /** Source property key */
  from: keyof From
  /** Custom transformation function that receives the source property value */
  fn: MutateFn<From>
}
