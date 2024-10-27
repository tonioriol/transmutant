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

### Basic Property Mapping

```typescript
import { transmute } from 'transmutant';

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

const userDTO = transmute<User, UserDTO>(schema, user);
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
const target = transmute<Source, Target>(schema, source);
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
    fn: ({ source, extra }) => source.price * (1 + extra?.taxRate)
  }
];

const product: Product = { price: 100 };
const pricedProduct = transmute<Product, PricedProduct>(
  schema,
  product,
  { taxRate: 0.2 }
);
// Result: { finalPrice: 120 }
```

## API Reference

### `transmute<Source, Target>(schema, source, extra?)`

Transmutes a source object into a target type based on the provided schema.

#### Parameters

- `schema`: Array of transmutation rules defining how properties should be transmuted
- `source`: Source object to transmute
- `extra`: (Optional) Additional data to pass to transmutation functions

#### Schema Options

1. Direct mapping:
```typescript
{
  to: keyof Target;
  from: keyof Source;
}
```

2. Custom transmutation:
```typescript
{
  to: keyof Target;
  fn: (args: { source: Source; extra?: Extra }) => unknown;
}
```

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

