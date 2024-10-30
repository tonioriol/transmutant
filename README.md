# 🧬 Transmutant 🧬

A powerful, type-safe TypeScript library for transforming objects through flexible schema definitions.

[![npm version](https://badge.fury.io/js/transmutant.svg)](https://www.npmjs.com/package/transmutant)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub issues](https://img.shields.io/github/issues/tonioriol/transmutant)](https://github.com/tonioriol/transmutant/issues)
[![GitHub stars](https://img.shields.io/github/stars/tonioriol/transmutant)](https://github.com/tonioriol/transmutant/stargazers)

## Features

- 🔒 **Type-safe**: Full TypeScript support with strong type inference
- 🎯 **Flexible mapping**: Direct property mapping or custom transformation functions
- ⚡ **High performance**: Minimal overhead and zero dependencies
- 🔄 **Extensible**: Support for custom transformation logic and external data
- 📦 **Lightweight**: Zero dependencies, small bundle size
- 🛡️ **Null-safe**: Graceful handling of null and undefined values

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

// Define transformation schema
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

// Transform the object
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

A schema is an array of transformation rules that define how properties should be mapped from the source to the target type. Each rule specifies the target property key and either a source property key for direct mapping or a transformation function that produces the correct type for that target property.

```typescript
type Schema<Source, Target, TExtra = unknown> = {
  [TargetKey in keyof Target]: {
    /** Target property key */
    to: TargetKey
    /** Source property key for direct mapping or a custom transformation function */
    from: keyof Source | TransmuteFn<Source, Target, TargetKey, TExtra>
  }
}[keyof Target]
```

### Transformation Types

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

#### 2. Custom Transformation Functions

Transform properties using custom logic with type safety:

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

#### 3. External Data Transformations

Include additional context in transformations:

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

## API Reference

### `transmute<Source, Target, TExtra = unknown>`

Main transformation function.

#### Parameters

| Parameter | Type                               | Description                   |
|-----------|------------------------------------|-------------------------------|
| schema    | `Schema<Source, Target, TExtra>[]` | Array of transformation rules |
| source    | `Source`                           | Source object to transform    |
| extra?    | `TExtra`                           | Optional additional data      |

#### Returns

Returns an object of type `Target`.

### Type Definitions

```typescript
/**
 * Schema entry defining how a property should be transformed
 */
type Schema<Source, Target, TExtra = unknown> = {
  [TargetKey in keyof Target]: {
    /** Target property key */
    to: TargetKey
    /** Source property key for direct mapping or a custom transformation function */
    from: keyof Source | TransmuteFn<Source, Target, TargetKey, TExtra>
  }
}[keyof Target]

/**
 * Function that performs property transformation
 */
type TransmuteFn<Source, Target, TargetKey extends keyof Target, TExtra = unknown> =
  (args: TransmuteFnArgs<Source, TExtra>) => Target[TargetKey]

/**
 * Arguments passed to transformation function
 */
type TransmuteFnArgs<Source, TExtra> = {
  source: Source
  extra?: TExtra
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
