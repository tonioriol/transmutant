# 🧬 Transmutant 🧬

A powerful, type-safe TypeScript library for transmuting objects through flexible schema definitions.

[![npm version](https://badge.fury.io/js/transmutant.svg)](https://www.npmjs.com/package/transmutant)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub issues](https://img.shields.io/github/issues/tonioriol/transmutant)](https://github.com/tonioriol/transmutant/issues)
[![GitHub stars](https://img.shields.io/github/stars/tonioriol/transmutant)](https://github.com/tonioriol/transmutant/stargazers)

## Features

- 🔒 **Type-safe**: Full TypeScript support with strong type inference
- 🎯 **Flexible mapping**: Direct property mapping or custom transmuter functions
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
import { Schema, transmute } from 'transmutant'

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
    to: 'contactEmail',
    from: 'email'
  }
]

// Transmute the object
const user: User = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com'
}

const userDTO = transmute(schema, user)
// Result: { fullName: 'John Doe', contactEmail: 'john@example.com' }
```

## Core Concepts

### Schema Definition

A schema is a collection of transmutation rules that define how properties should be mapped from the source to the
target
type. Each rule specifies:

- The target property key (`to`)
- Either a source property key for direct mapping or a transmuter function (`from`)

```typescript
type Schema<Source, Target, Context> = {
  to: keyof Target,
  from: keyof Source | Transmuter<Source, Target, Context>
}[]
```

Note: this is overly simplified for clarity. The actual type definition includes additional type constraints. Check
the [API Reference] the full type definition [here](/src/types.ts). 

### Transmutation Types

#### 1. Direct Property Mapping

Map a property directly from source to target when types are compatible:

```typescript
interface Source {
  email: string;
}

interface Target {
  contactEmail: string;
}

const schema: Schema<Source, Target>[] = [
  { to: 'contactEmail', from: 'email' }
]
```

#### 2. Custom Transmuter Functions

Transmute properties using custom logic with full type safety:

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

Include additional context in transmutations through the `context` parameter:

```typescript
interface Source {
  city: string;
  country: string;
}

interface Target {
  location: string;
}

interface ContextData {
  separator: string;
}

const schema: Schema<Source, Target, ContextData>[] = [
  {
    to: 'location',
    from: ({ source, context }) =>
      `${source.city}${context.separator}${source.country}`
  }
];

const result = transmute(schema,
  { city: 'New York', country: 'USA' },
  { separator: ', ' }
);
// Result: { location: 'New York, USA' }
```

## API Reference

### Types

```typescript
// Arguments passed to a mutation function
type TransmuterArgs<Source, Context> = { source: Source, context?: Context }

// Function that performs a custom transmutation
type Transmuter<Source, Target, Context> = (args: TransmuterArgs<Source, Context>) => Target[keyof Target]

// Defines how a property should be transmuted
type Schema<Source, Target, Context> = {
  to: keyof Target,
  from: keyof Source | Transmuter<Source, Target, Context>
}[]
```

### transmute()

Main function for performing object transmutations.

```typescript
function transmute<Source, Target, Context>(
  schema: Schema<Source, Target, Context>[],
  source: Source,
  context?: Context
): Target;
```

#### Parameters

| Parameter | Type                                | Description                        |
|-----------|-------------------------------------|------------------------------------|
| schema    | `Schema<Source, Target, Context>[]` | Array of transmutation rules       |
| source    | `Source`                            | Source object to transmute         |
| context   | `Context` (optional)                | Additional data for transmutations |

#### Returns

Returns an object of type `Target` with all specified transmutations applied.

### Type Safety Examples

The library provides strong type checking for both direct mappings and custom transmutations:

```typescript
interface Source {
  firstName: string;
  lastName: string;
  age: number;
}

interface Target {
  fullName: string;
  isAdult: boolean;
}

// Correct usage - types match
const validSchema: Schema<Source, Target>[] = [
  {
    to: 'fullName',
    from: ({ source }) => `${source.firstName} ${source.lastName}`  // Returns string
  },
  {
    to: 'isAdult',
    from: ({ source }) => source.age >= 18  // Returns boolean
  }
];

// Type error - incorrect return type
const invalidSchema: Schema<Source, Target>[] = [
  {
    to: 'isAdult',
    from: ({ source }) => source.age  // Error: number not assignable to boolean
  }
];
```

## Contributing

Contributions are welcome! Feel free to submit a Pull Request.

## License

MIT © Antoni Oriol

---

<div align="center">
  <sub>Built with ❤️ by <a href="https://github.com/tonioriol">Antoni Oriol</a></sub>
</div>
