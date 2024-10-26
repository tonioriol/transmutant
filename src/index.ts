import { Extra, Schema } from './types'

export * from './types'

/**
 * Transforms data from one shape to another using a declarative schema.
 * The schema defines how properties should be mapped or transformed from
 * the source object to create the target object.
 *
 * @typeParam From - The type of the source object
 * @typeParam To - The type of the target object
 * @typeParam TExtra - The type of any extra context data (defaults to Extra)
 *
 * @param schema - Array of transformation rules defining the mapping between source and target
 * @param entity - Source object to transform
 * @param extra - Optional additional context data available to transformation functions
 *
 * @returns A new object matching the target type specification
 *
 * @example
 * Basic property mapping:
 * ```typescript
 * import { mutate } from 'mutant';
 *
 * const schema = [
 *   { from: 'firstName', to: 'givenName' },
 *   { from: 'lastName', to: 'familyName' }
 * ];
 *
 * const result = mutate(schema, {
 *   firstName: 'John',
 *   lastName: 'Doe'
 * });
 * // Result: { givenName: 'John', familyName: 'Doe' }
 * ```
 *
 * @example
 * Using transformation functions:
 * ```typescript
 * import { mutate } from 'mutant';
 *
 * const schema = [
 *   {
 *     to: 'fullName',
 *     fn: ({ entity }) => `${entity.firstName} ${entity.lastName}`
 *   },
 *   {
 *     from: 'age',
 *     to: 'isAdult',
 *     fn: ({ entity }) => entity.age >= 18
 *   }
 * ];
 *
 * const result = mutate(schema, {
 *   firstName: 'John',
 *   lastName: 'Doe',
 *   age: 25
 * });
 * // Result: { fullName: 'John Doe', isAdult: true }
 * ```
 *
 * @example
 * Using extra context:
 * ```typescript
 * import { mutate } from 'mutant';
 *
 * const schema = [
 *   {
 *     to: 'greeting',
 *     fn: ({ entity, extra }) =>
 *       `${extra.greeting}, ${entity.firstName}!`
 *   }
 * ];
 *
 * const result = mutate(schema,
 *   { firstName: 'John' },
 *   { greeting: 'Hello' }
 * );
 * // Result: { greeting: 'Hello, John!' }
 * ```
 *
 * @throws {TypeError} If schema or entity are null/undefined
 * @throws {Error} If schema contains invalid transformation rules
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
