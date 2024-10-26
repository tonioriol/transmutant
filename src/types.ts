// types.ts

/**
 * Type representing additional context data that can be passed to mutations.
 * This allows passing arbitrary data to transformation functions for complex scenarios.
 *
 * @example
 * ```typescript
 * import { Extra } from 'mutant';
 *
 * const extra: Extra = {
 *   timezone: 'UTC',
 *   locale: 'en-US'
 * };
 * ```
 */
export type Extra = Record<string, unknown>

/**
 * Arguments passed to mutation functions. This interface defines the structure
 * of parameters available to transformation functions.
 *
 * @typeParam From - The type of the source object being transformed
 */
export interface MutateFnArgs<From> {
  /** The complete source object being mutated */
  entity: From
  /**
   * Source property key if using direct property mapping.
   * Only available when the schema rule includes a 'from' property.
   */
  from?: keyof From
  /**
   * Additional context data passed to the mutation.
   * Useful for providing external configuration or dependencies.
   */
  extra?: Extra
}

/**
 * Type definition for a mutation function that transforms data.
 * These functions receive the source entity and optional context data,
 * and return the transformed value.
 *
 * @typeParam From - The type of the source object being transformed
 *
 * @example
 * ```typescript
 * import { MutateFn } from 'mutant';
 *
 * const fullNameFn: MutateFn<Person> = ({ entity }) =>
 *   `${entity.firstName} ${entity.lastName}`;
 * ```
 */
export type MutateFn<From> = (args: MutateFnArgs<From>) => unknown

/**
 * Schema definition for a single property mutation.
 * Supports three forms of property transformation:
 * 1. Direct mapping from source to target property
 * 2. Custom function transformation
 * 3. Combined mapping and transformation
 *
 * @typeParam From - The type of the source object
 * @typeParam To - The type of the target object
 *
 * @example
 * ```typescript
 * import { Schema } from 'mutant';
 *
 * // Direct mapping
 * const directMapping: Schema<Source, Target> = {
 *   from: 'sourceField',
 *   to: 'targetField'
 * };
 *
 * // Custom function
 * const functionMapping: Schema<Source, Target> = {
 *   to: 'targetField',
 *   fn: ({ entity }) => transform(entity)
 * };
 *
 * // Combined mapping and function
 * const combinedMapping: Schema<Source, Target> = {
 *   from: 'sourceField',
 *   to: 'targetField',
 *   fn: ({ entity, from }) => transform(entity[from])
 * };
 * ```
 */
export type Schema<From, To> = | {
  /** Target property key in the output object */
  to: keyof To
  /** Source property key in the input object */
  from: keyof From
} | {
  /** Target property key in the output object */
  to: keyof To
  /** Transformation function to generate the target value */
  fn: MutateFn<From>
} | {
  /** Target property key in the output object */
  to: keyof To
  /** Source property key in the input object */
  from: keyof From
  /** Optional transformation function to modify the mapped value */
  fn: MutateFn<From>
}
