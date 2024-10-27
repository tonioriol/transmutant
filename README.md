# Mutant

A lightweight TypeScript library for flexible object transformation with type safety.

## Installation

```bash
npm install mutant
```

## Features

- 🔒 Type-safe transformations
- 🎯 Direct property mapping
- ⚡ Custom transformation functions
- 🔄 Flexible schema definition
- 📦 Zero dependencies

## Usage

### Basic Property Mapping

```typescript
import { mutate } from 'mutant';

interface User {
  firstName: string;
  lastName: string;
  age: number;
}

interface UserDTO {
  fullName: string;
  yearOfBirth: number;
}

const schema = [
  {
    to: 'fullName',
    fn: ({ source }) => `${source.firstName} ${source.lastName}`
  },
  {
    to: 'yearOfBirth',
    fn: ({ source }) => new Date().getFullYear() - source.age
  }
];

const user: User = {
  firstName: 'John',
  lastName: 'Doe',
  age: 30
};

const userDTO = mutate<User, UserDTO>(schema, user);
// Result: { fullName: 'John Doe', yearOfBirth: 1994 }
```

### Direct Property Mapping

```typescript
interface Source {
  id: number;
  name: string;
}

interface Target {
  userId: number;
  userName: string;
}

const schema = [
  { from: 'id', to: 'userId' },
  { from: 'name', to: 'userName' }
];

const source: Source = { id: 1, name: 'John' };
const target = mutate<Source, Target>(schema, source);
// Result: { userId: 1, userName: 'John' }
```

### Using Extra Data

```typescript
interface Product {
  price: number;
}

interface PricedProduct {
  finalPrice: number;
}

const schema = [
  {
    to: 'finalPrice',
    fn: ({ source, extra }) => source.price * (1 + extra.taxRate)
  }
];

const product: Product = { price: 100 };
const pricedProduct = mutate<Product, PricedProduct>(
  schema,
  product,
  { taxRate: 0.2 }
);
// Result: { finalPrice: 120 }
```

## API Reference

### `mutate<Source, Target>(schema, source, extra?)`

Transforms a source source into a target type based on the provided schema.

#### Parameters

- `schema`: Array of transformation rules defining how properties should be mapped or transformed
- `source`: Source source to transform
- `extra`: (Optional) Additional data to pass to transformation functions

#### Schema Options

1. Direct mapping:
```typescript
{
  to: keyof Target;
  from: keyof Source;
}
```

2. Custom transformation:
```typescript
{
  to: keyof Target;
  fn: (args: { source: Source; extra?: Extra }) => unknown;
}
```

3. Combined mapping and transformation:
```typescript
{
  to: keyof Target;
  from: keyof Source;
  fn: (args: { source: Source; from?: keyof Source; extra?: Extra }) => unknown;
}
```

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
