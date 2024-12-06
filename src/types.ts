/**
 * Arguments passed to a mutation function
 * @template Source - The source type being transmuted from
 * @template Context - Type of additional data for transmutation
 */
export type TransmuterArgs<Source, Context> = Context extends undefined
  ? { source: Source }
  : { source: Source; context: Context }

/**
 * Function that performs a custom transmutation on a source object
 * @template Source - The source type being transmuted from
 * @template Target - The target type being transmuted to
 * @template TargetKey - The specific key of the target property being set
 * @template Context - Type of additional data for transmutation
 */
export type Transmuter<Source, Target, TargetKey extends keyof Target, Context = undefined> =
  (args: TransmuterArgs<Source, Context>) => Target[TargetKey]

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
 * @template Context - Type of additional data for transmutation
 */
type SchemaItem<Source, Target, Context = undefined> = {
  [TargetKey in keyof Target]: {
    to: TargetKey
    from: AssignableKeys<Source, Target, TargetKey> | Transmuter<Source, Target, TargetKey, Context>
  }
}[keyof Target]

/**
 * Schema for transmuting an object from the Source type into the Target type
 * @template Source - The source type being transmuted from
 * @template Target - The target type being transmuted to
 * @template Context - Type of additional data for transmutation
 */
export type Schema<Source, Target, Context = undefined> = SchemaItem<Source, Target, Context>[]
