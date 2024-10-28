/**
 * Arguments passed to a mutation function
 * @template From - The source type being transmuted from
 */
export type TransmuteFnArgs<Source, TExtra> = {
  /** The source object being transmuted */
  source: Source
  /** Optional extra data to assist with transmutation */
  extra?: TExtra
}

/**
 * Function that performs a custom transmutation on a source object
 * @template From - The source type being transmuted from
 */
export type TransmuteFn<Source, TExtra = unknown> = (args: TransmuteFnArgs<Source, TExtra>) => unknown

/**
 * Defines how a property should be transmuted from source to target type
 * @template From - The source type being transmuted from
 * @template To - The target type being transmuted to
 */
export type Schema<Source, Target, TExtra = unknown> = {
  /** Target property key */
  to: keyof Target
} & (
  | {
  /** Source property key for direct mapping */
  from: keyof Source
  fn?: never
}
  | {
  /** Custom transmutation function */
  fn: TransmuteFn<Source, TExtra>
  from?: never
}
  )
