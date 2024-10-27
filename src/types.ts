/**
 * Represents additional data that can be passed to mutation functions
 */
export type Extra = Record<string, unknown>

/**
 * Arguments passed to a mutation function
 * @template From - The source type being mutated from
 */
export interface MutateFnArgs<Source> {
  /** The source object being transformed */
  source: Source
  /** Optional source property key */
  from?: keyof Source
  /** Optional extra data to assist with transformation */
  extra?: Extra
}

/**
 * Function that performs a custom transformation on a source source
 * @template From - The source type being mutated from
 */
export type MutateFn<Source> = (args: MutateFnArgs<Source>) => unknown

/**
 * Defines how a property should be transformed from source to target type
 * @template From - The source type being mutated from
 * @template To - The target type being mutated to
 */
export type Schema<Source, Target> = | {
  /** Target property key */
  to: keyof Target
  /** Source property key for direct mapping */
  from: keyof Source
  /** Custom transformation function */
  fn?: MutateFn<Source>
} | {
  /** Target property key */
  to: keyof Target
  /** Source property key for direct mapping */
  from?: keyof Source
  /** Custom transformation function */
  fn: MutateFn<Source>
}
