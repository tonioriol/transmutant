/**
 * Arguments passed to a mutation function
 * @template Source - The source type being transmuted from
 * @template TExtra - Type of additional data for transmutation
 */
export type TransmuteFnArgs<Source, TExtra> = {
  /** The source object being transmuted */
  source: Source
  /** Optional extra data to assist with transmutation */
  extra?: TExtra
}

/**
 * Function that performs a custom transmutation on a source object
 * @template Source - The source type being transmuted from
 * @template Target - The target type being transmuted to
 * @template TargetKey - The specific key of the target property being set
 * @template TExtra - Type of additional data for transmutation
 */
export type TransmuteFn<Source, Target, TargetKey extends keyof Target, TExtra = unknown> =
  (args: TransmuteFnArgs<Source, TExtra>) => Target[TargetKey]

/**
 * Defines how a property should be transmuted from source to target type
 * @template Source - The source type being transmuted from
 * @template Target - The target type being transmuted to
 * @template TExtra - Type of additional data for transmutation
 */
export type Schema<Source, Target, TExtra = unknown> = {
  [TargetKey in keyof Target]: {
    /** Target property key */
    to: TargetKey
    /** Source property key for direct mapping or a custom transmutation function */
    from: keyof Source | TransmuteFn<Source, Target, TargetKey, TExtra>
  }
}[keyof Target]
