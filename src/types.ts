/**
 * Represents additional data that can be passed to mutation functions
 */
export type Extra = Record<string, unknown>

/**
 * Arguments passed to a mutation function
 * @template From - The source type being transmuted from
 */
export interface TransmuteFnArgs<Source> {
  /** The source object being transmuted */
  source: Source
  /** Optional source property key */
  from?: keyof Source
  /** Optional extra data to assist with transmutation */
  extra?: Extra
}

/**
 * Function that performs a custom transmutation on a source object
 * @template From - The source type being transmuted from
 */
export type TransmuteFn<Source> = (args: TransmuteFnArgs<Source>) => unknown

/**
 * Defines how a property should be transmuted from source to target type
 * @template From - The source type being transmuted from
 * @template To - The target type being transmuted to
 */
export type Schema<Source, Target> = | {
  /** Target property key */
  to: keyof Target
  /** Source property key for direct mapping */
  from: keyof Source
  /** Custom transmutation function */
  fn?: TransmuteFn<Source>
} | {
  /** Target property key */
  to: keyof Target
  /** Source property key for direct mapping */
  from?: keyof Source
  /** Custom transmutation function */
  fn: TransmuteFn<Source>
}
