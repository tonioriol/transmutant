# 🧬 Transmutant 🧬

A powerful, type-safe TypeScript library for transmuting objects through flexible schema definitions.

[![npm version](https://badge.fury.io/js/transmutant.svg)](https://www.npmjs.com/package/transmutant)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub issues](https://img.shields.io/github/issues/tonioriol/transmutant)](https://github.com/tonioriol/transmutant/issues)
[![GitHub stars](https://img.shields.io/github/stars/tonioriol/transmutant)](https://github.com/tonioriol/transmutant/stargazers)

## Features

- 🔒 **Type-safe**: Full TypeScript support with strong type inference
- 🎯 **Flexible mapping**: Direct property mapping or custom transmutation functions
- ⚡ **High performance**: Minimal overhead and zero dependencies
- 🔄 **Extensible**: Support for custom transmutation logic and external data
- 📦 **Lightweight**: Zero dependencies, small bundle size
- 🛠️ **Predictable**: Transparent handling of undefined values

## Installation

```bash
npm install transmutant
```

## Quick Start

```typescript
import { transmute, Schema } from 'transmutant';

// Source type
interface User {
  firstName: string;
  lastName: string;
  email: string;
}

// Target type
interface UserDTO {
  fullName: string;
  contactEmail: string;
}

// Define transmutation schema
const schema: Schema<User, UserDTO>[] = [
  {
    to: 'fullName',
    from: ({ source }) => `${source.firstName} ${source.lastName}`
  },
  {
    from: 'email',
    to: 'contactEmail'
  }
];

// Transmut the object
const user: User = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com'
};

const userDTO = transmute(schema, user);
// Result: { fullName: 'John Doe', contactEmail: 'john@example.com' }
```

## Core Concepts

### Schema Definition

A schema is an array of transmutation rules that define how properties should be mapped from the source to the target type. Each rule specifies the target property key and either a source property key for direct mapping or a transmutation function that produces the correct type for that target property.

```typescript
type Schema<Source, Target, Extra = unknown> = {
  [TargetKey in keyof Target]: {
    /** Target property key */
    to: TargetKey
    /** Source property key for direct mapping or a custom transmutation function */
    from: keyof Source | TransmuteFn<Source, Target, TargetKey, Extra>
  }
}[keyof Target]
```

### Transmutation Types

#### 1. Direct Property Mapping

Map a property directly from source to target:

```typescript
interface Source {
  email: string;
}

interface Target {
  contactEmail: string;
}

const schema: Schema<Source, Target>[] = [
  { from: 'email', to: 'contactEmail' }
];
```

#### 2. Custom Transmutation Functions

Transmute properties using custom logic with type safety:

```typescript
interface Source {
  age: number;
}

interface Target {
  isAdult: boolean;
}

const schema: Schema<Source, Target>[] = [
  {
    to: 'isAdult',
    from: ({ source }) => source.age >= 18
  }
];
```

#### 3. External Data Transmutations

Include additional context in transmutations:

```typescript
interface Source {
  price: number;
}

interface Target {
  formattedPrice: string;
}

interface ExtraData {
  currency: string;
}

const schema: Schema<Source, Target, ExtraData>[] = [
  {
    to: 'formattedPrice',
    from: ({ source, extra }) =>
      `${source.price.toFixed(2)} ${extra.currency}`
  }
];
```

### Handling Undefined Values

When a source property doesn't exist or a transmutation function returns undefined, the target property will remain undefined:

```typescript
interface Source {
  existingField: string;
}

interface Target {
  mappedField: string;
  computedField: string;
}

const schema: Schema<Source, Target>[] = [
  {
    from: 'nonExistentField' as keyof Source,  // Property doesn't exist
    to: 'mappedField'
  },
  {
    to: 'computedField',
    from: ({ source }) => undefined  // Transmutation returns undefined
  }
];

const result = transmute(schema, { existingField: 'value' });
// Result: { mappedField: undefined, computedField: undefined }
```

This allows you to:
- Distinguish between unset values (`undefined`) and explicitly set null values
- Handle optional properties naturally
- Process partial transmutations as needed

## API Reference

### `transmute<Source, Target, Extra = unknown>`

Main transmutation function.

#### Parameters

| Parameter | Type                              | Description                  |
|-----------|-----------------------------------|------------------------------|
| schema    | `Schema<Source, Target, Extra>[]` | Array of transmutation rules |
| source    | `Source`                          | Source object to transmut    |
| extra?    | `Extra`                           | Optional additional data     |

#### Returns

Returns an object of type `Target`.

### Type Definitions

```typescript
/**
 * Schema entry defining how a property should be transmuted
 */
type Schema<Source, Target, Extra = unknown> = {
  [TargetKey in keyof Target]: {
    /** Target property key */
    to: TargetKey
    /** Source property key for direct mapping or a custom transmutation function */
    from: keyof Source | TransmuteFn<Source, Target, TargetKey, Extra>
  }
}[keyof Target]

/**
 * Function that performs property transmutation
 */
type TransmuteFn<Source, Target, TargetKey extends keyof Target, Extra = unknown> =
  (args: TransmuteFnArgs<Source, Extra>) => Target[TargetKey]

/**
 * Arguments passed to transmutation function
 */
type TransmuteFnArgs<Source, Extra> = {
  source: Source
  extra?: Extra
}
```

### Type Safety Examples

```typescript
interface Source {
  firstName: string;
  lastName: string;
  age: number;
}

interface Target {
  fullName: string;    // TargetKey = 'fullName', type = string
  isAdult: boolean;    // TargetKey = 'isAdult', type = boolean
}

// TypeScript enforces correct return types
const schema: Schema<Source, Target>[] = [
  {
    to: 'fullName',
    from: ({ source }) => `${source.firstName} ${source.lastName}`  // Must return string
  },
  {
    to: 'isAdult',
    from: ({ source }) => source.age >= 18  // Must return boolean
  }
];

// Type error example:
const invalidSchema: Schema<Source, Target>[] = [
  {
    to: 'isAdult',
    from: ({ source }) => source.age  // Type error: number is not assignable to boolean
  }
];
```

### Direct Property Mapping

When using direct property mapping, TypeScript ensures type compatibility:

```typescript
interface Source {
  email: string;
  age: number;
}

interface Target {
  contactEmail: string;
  yearOfBirth: number;
}

const schema: Schema<Source, Target>[] = [
  { from: 'email', to: 'contactEmail' },     // OK: string -> string
  { from: 'age', to: 'yearOfBirth' }         // OK: number -> number
];
```

### Using Extra Data

Extra data is fully typed:

```typescript
interface ExtraData {
  currentYear: number;
}

interface Source {
  age: number;
}

interface Target {
  yearOfBirth: number;
}

const schema: Schema<Source, Target, ExtraData>[] = [
  {
    to: 'yearOfBirth',
    from: ({ source, extra }) => extra.currentYear - source.age
  }
];

const result = transmute(schema, { age: 25 }, { currentYear: 2024 });
```

## Contributing

Contributions are welcome! Feel free to submit a Pull Request.

## License

MIT © Antoni Oriol

---

<div align="center">
  <sub>Built with ❤️ by <a href="https://github.com/tonioriol">Antoni Oriol</a></sub>
</div>
