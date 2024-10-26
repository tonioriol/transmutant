"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mutate = void 0;
__exportStar(require("./types"), exports);
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
const mutate = (schema, entity, extra) => schema.reduce((acc, rule) => {
    const value = 'fn' in rule
        ? rule.fn({ entity, from: 'from' in rule ? rule.from : undefined, extra })
        : entity[rule.from];
    return {
        ...acc,
        [rule.to]: value
    };
}, {});
exports.mutate = mutate;
