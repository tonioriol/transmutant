# mutant

A lightweight and flexible TypeScript library for transforming data structures using declarative schemas.

## Installation

```bash
npm install mutant
```

## Features

- 🚀 Transform objects from one shape to another using a simple schema
- 💪 Full TypeScript support with strong type inference
- 🛠️ Support for direct property mapping and custom transformation functions
- 📦 Zero dependencies
- 🔍 Additional context data support for complex transformations

## Usage

### Basic Example

```typescript
import { mutate } from 'mutant';

const schema = [
  {
    from: 'firstName',
    to: 'givenName'
  },
  {
    from: 'lastName',
    to: 'familyName'
  }
];

const source = {
  firstName: 'John',
  lastName: 'Doe'
};

const result = mutate(schema, source);
// Result: { givenName: 'John', familyName: 'Doe' }
```

### Custom Transformation Functions

```typescript
const schema = [
  {
    to: 'fullName',
    fn: ({ entity }) => `${entity.firstName} ${entity.lastName}`
  },
  {
    from: 'age',
    to: 'isAdult',
    fn: ({ entity }) => entity.age >= 18
  }
];

const source = {
  firstName: 'John',
  lastName: 'Doe',
  age: 25
};

const result = mutate(schema, source);
// Result: { fullName: 'John Doe', isAdult: true }
```

### Using Extra Context

```typescript
const schema = [
  {
    to: 'greeting',
    fn: ({ entity, extra }) =>
      `${extra.greeting}, ${entity.firstName}!`
  }
];

const source = {
  firstName: 'John'
};

const result = mutate(schema, source, { greeting: 'Hello' });
// Result: { greeting: 'Hello, John!' }
```

## API Reference

### `mutate<From, To, TExtra>(schema, entity, extra?)`

The main function for transforming data structures.

#### Parameters

- `schema`: `Schema<From, To>[]` - Array of transformation rules
- `entity`: `From` - Source object to transform
- `extra?`: `Extra` - Optional additional context data

#### Returns

- `To` - Transformed object matching the target shape

### Schema Types

#### Direct Property Mapping
```typescript
{
  from: keyof From;
  to: keyof To;
}
```

#### Custom Transform Function
```typescript
{
  to: keyof To;
  fn: (args: MutateFnArgs<From>) => unknown;
}
```

#### Combined Property Mapping and Transform
```typescript
{
  from: keyof From;
  to: keyof To;
  fn: (args: MutateFnArgs<From>) => unknown;
}
```

### Types

#### `MutateFnArgs<From>`

Arguments passed to mutation functions:

```typescript
interface MutateFnArgs<From> {
  /** Source object being mutated */
  entity: From;
  /** Source property key if using direct property mapping */
  from?: keyof From;
  /** Additional context data */
  extra?: Extra;
}
```

#### `Extra`

Type for additional context data:

```typescript
type Extra = Record<string, unknown>
```

## Best Practices

1. **Type Safety**: Always define your input and output types for better type inference:
```typescript
interface Source {
  firstName: string;
  lastName: string;
}

interface Target {
  fullName: string;
}

const schema: Schema<Source, Target>[] = [/*...*/];
```

2. **Immutability**: The library maintains immutability by default. Each transformation creates a new object.

3. **Modular Transformations**: Break down complex transformations into smaller, reusable functions:
```typescript
const formatName = ({ entity }: MutateFnArgs<Source>) =>
  `${entity.firstName} ${entity.lastName}`;

const schema = [
  {
    to: 'fullName',
    fn: formatName
  }
];
```

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
