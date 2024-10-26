import { mutate, Schema } from '../';

describe('mutate', () => {
  // Test basic direct property mapping
  describe('direct property mapping', () => {
    interface Source {
      id: number;
      name: string;
      email: string;
    }

    interface Target {
      userId: number;
      userName: string;
      userEmail: string;
    }

    const schema: Schema<Source, Target>[] = [
      { from: 'id', to: 'userId' },
      { from: 'name', to: 'userName' },
      { from: 'email', to: 'userEmail' },
    ];

    it('should map properties directly', () => {
      const source: Source = {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
      };

      const result = mutate<Source, Target>(schema, source);

      expect(result).toEqual({
        userId: 1,
        userName: 'John Doe',
        userEmail: 'john@example.com',
      });
    });

    it('should handle undefined values', () => {
      const source = {
        id: undefined,
        name: 'John Doe',
        email: null,
      } as unknown as Source;

      const result = mutate<Source, Target>(schema, source);

      expect(result).toEqual({
        userId: undefined,
        userName: 'John Doe',
        userEmail: null,
      });
    });
  });

  // Test custom transformation functions
  describe('custom transformation functions', () => {
    interface Source {
      firstName: string;
      lastName: string;
      age: number;
      scores: number[];
    }

    interface Target {
      fullName: string;
      isAdult: boolean;
      averageScore: number;
    }

    const schema: Schema<Source, Target>[] = [
      {
        to: 'fullName',
        fn: ({ entity }) => `${entity.firstName} ${entity.lastName}`,
      },
      {
        to: 'isAdult',
        fn: ({ entity }) => entity.age >= 18,
      },
      {
        to: 'averageScore',
        fn: ({ entity }) =>
          entity.scores.reduce((sum, score) => sum + score, 0) / entity.scores.length,
      },
    ];

    it('should apply custom transformations', () => {
      const source: Source = {
        firstName: 'John',
        lastName: 'Doe',
        age: 25,
        scores: [85, 92, 78],
      };

      const result = mutate<Source, Target>(schema, source);

      expect(result).toEqual({
        fullName: 'John Doe',
        isAdult: true,
        averageScore: 85,
      });
    });

    it('should handle edge cases in custom transformations', () => {
      const source: Source = {
        firstName: '',
        lastName: '',
        age: 17,
        scores: [],
      };

      const result = mutate<Source, Target>(schema, source);

      expect(result).toEqual({
        fullName: ' ',
        isAdult: false,
        averageScore: NaN,  // Division by zero
      });
    });
  });

  // Test combined mapping and transformation
  describe('combined mapping and transformation', () => {
    interface Source {
      price: number;
      quantity: number;
      category: string;
    }

    interface Target {
      total: number;
      displayCategory: string;
    }

    const schema: Schema<Source, Target>[] = [
      {
        to: 'total',
        fn: ({ entity }) => entity.price * entity.quantity,
      },
      {
        to: 'displayCategory',
        fn: ({ entity, from }) => entity.category.toUpperCase(),
      },
    ];

    it('should combine mapping and transformation', () => {
      const source: Source = {
        price: 10,
        quantity: 3,
        category: 'electronics',
      };

      const result = mutate<Source, Target>(schema, source);

      expect(result).toEqual({
        total: 30,
        displayCategory: 'ELECTRONICS',
      });
    });
  });

  // Test extra data usage
  describe('extra data usage', () => {
    interface Source {
      price: number;
    }

    interface Target {
      finalPrice: number;
      priceInUSD: number;
    }

    interface ExtraData {
      taxRate: number;
      exchangeRate: number;
    }

    const schema: Schema<Source, Target>[] = [
      {
        to: 'finalPrice',
        fn: ({ entity, extra }) =>
          entity.price * (1 + (extra as ExtraData).taxRate),
      },
      {
        to: 'priceInUSD',
        fn: ({ entity, extra }) =>
          entity.price * (extra as ExtraData).exchangeRate,
      },
    ];

    it('should use extra data in transformations', () => {
      const source: Source = { price: 100 };
      const extra: ExtraData = {
        taxRate: 0.2,
        exchangeRate: 1.5,
      };

      const result = mutate<Source, Target, ExtraData>(schema, source, extra);

      expect(result).toEqual({
        finalPrice: 120,
        priceInUSD: 150,
      });
    });

    it('should handle missing extra data', () => {
      const source: Source = { price: 100 };

      const result = mutate<Source, Target>(schema, source);

      expect(result).toEqual({
        finalPrice: NaN,  // undefined taxRate
        priceInUSD: NaN,  // undefined exchangeRate
      });
    });
  });

  // Test error cases
  describe('error handling', () => {
    interface Source {
      id: number;
    }

    interface Target {
      userId: number;
    }

    it('should handle empty schema', () => {
      const source: Source = { id: 1 };
      const result = mutate<Source, Target>([], source);
      expect(result).toEqual({});
    });

    it('should handle null/undefined entity', () => {
      const schema: Schema<Source, Target>[] = [
        { from: 'id', to: 'userId' },
      ];

      expect(() => {
        mutate<Source, Target>(schema, null as unknown as Source);
      }).toThrow();

      expect(() => {
        mutate<Source, Target>(schema, undefined as unknown as Source);
      }).toThrow();
    });
  });
});
