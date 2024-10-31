/**
 * Arguments passed to a mutation function
 * @template Source - The source type being transmuted from
 * @template Extra - Type of additional data for transmutation
 */
export type TransmuteFnArgs<Source, Extra> = Extra extends undefined | never
  ? { source: Source }
  : { source: Source; extra: Extra }

/**
 * Function that performs a custom transmutation on a source object
 * @template Source - The source type being transmuted from
 * @template Target - The target type being transmuted to
 * @template TargetKey - The specific key of the target property being set
 * @template Extra - Type of additional data for transmutation
 */
export type TransmuteFn<Source, Target, TargetKey extends keyof Target, Extra> =
  (args: TransmuteFnArgs<Source, Extra>) => Target[TargetKey]

/**
 * Get keys of Source that have values assignable to Target[TargetKey]
 */
type AssignableKeys<Source, Target, TargetKey extends keyof Target> = {
  [SourceKey in keyof Source]: Source[SourceKey] extends Target[TargetKey] ? SourceKey : never
}[keyof Source]

/**
 * Defines how a property should be transmuted from source to target type
 * @template Source - The source type being transmuted from
 * @template Target - The target type being transmuted to
 * @template Extra - Type of additional data for transmutation
 */
export type Schema<Source, Target, Extra = undefined> = {
  [TargetKey in keyof Target]: {
    to: TargetKey
    from: AssignableKeys<Source, Target, TargetKey> | TransmuteFn<Source, Target, TargetKey, Extra>
  }
}[keyof Target]
