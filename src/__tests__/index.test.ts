import { describe, it, expect } from '@jest/globals';
import { mutate, Schema } from '..';

describe('transform', () => {
  interface Source {
    firstName: string;
    lastName: string;
    age: number;
  }

  interface Target {
    fullName: string;
    isAdult: boolean;
  }

  const source: Source = {
    firstName: 'John',
    lastName: 'Doe',
    age: 25,
  };

  it('transforms data according to schema', () => {
    const schema: Schema<Source, Target>[] = [
      {
        to: 'fullName',
        fn: ({ entity }) => `${entity.firstName} ${entity.lastName}`,
      },
      {
        to: 'isAdult',
        fn: ({ entity }) => entity.age >= 18,
      },
    ];

    const result = mutate(schema, source);
    expect(result).toEqual({
      fullName: 'John Doe',
      isAdult: true,
    });
  });
});
