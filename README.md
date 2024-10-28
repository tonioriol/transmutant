# Transmutant

A lightweight TypeScript library for flexible object transmutation with type safety.

## Installation

```bash
npm install transmutant
```

## Features

- 🔒 Type-safe transmutations
- 🎯 Direct property mapping
- ⚡ Custom transmutation functions
- 🔄 Flexible schema definition
- 📦 Zero dependencies

## Usage

### Direct Property Mapping

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

const source: Source = { email: 'john@example.com' };
const target = transmute(schema, source);

// Result: { contactEmail: 'john@example.com' }
```

### Using Custom Transmutation Functions

```typescript
interface Source {
  firstName: string;
  lastName: string;
}

interface Target {
  fullName: string;
}

const schema: Schema<Source, Target>[] = [
  {
    to: 'fullName',
    fn: ({ source }) => `${source.firstName} ${source.lastName}`
  }
];

const source: Source = { firstName: 'John', lastName: 'Doe' };
const target = transmute(schema, source);

// Result: { fullName: 'John Doe' }
```

### Using Extra Data

```typescript
interface Source {
  city: string;
  country: string;
}

interface Target {
  location: string;
}

interface Extra {
  separator: string;
}

const schema: Schema<Source, Target, Extra>[] = [
  {
    to: 'location',
    fn: ({ source, extra }) =>
      `${source.city}, ${source.country}${extra?.separator}`
  }
];

const source: Source = {
  city: 'New York',
  country: 'USA'
};

const target = transmute(schema, source, { separator: ' | ' });

// Result: { location: 'New York, USA | ' }
```

## API Reference

### `transmute(schema, source, extra?)`

Transmutes a source object into a target type based on the provided schema.

#### Parameters

- `schema`: Array of transmutation rules defining how properties should be transmuted
- `source`: Source object to transmute
- `extra`: (Optional) Additional data to pass to transmutation functions

#### Schema Types

Each schema entry must specify the target property and use either direct mapping OR a custom function:

```typescript
type Schema<Source, Target, TExtra> = {
  /** Target property key */
  to: keyof Target;
} & (
  | {
      /** Source property key for direct mapping */
      from: keyof Source;
      fn?: never;
    }
  | {
      /** Custom transmutation function */
      fn: TransmuteFn<Source, TExtra>;
      from?: never;
    }
);
```

The `TransmuteFn` type is defined as:
```typescript
type TransmuteFn<Source, TExtra> = (args: {
  source: Source;
  extra?: TExtra;
}) => unknown;
```

#### Behavior Notes

- Direct mapping uses the `from` property to copy values directly from source to target
- Custom functions receive the entire source object and optional extra data
- If a direct mapping property is undefined or null, it will be set to `null` in the target object
- Empty schemas result in an empty object
- Each schema entry must use either `from` OR `fn`, but not both
- The schema is processed sequentially, with each rule contributing to the final object

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
