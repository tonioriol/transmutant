import { Schema, transmute } from '../'

interface SourceUser {
  firstName: string
  lastName: string
  age: number
  email: string
  address: {
    street: string
    city: string
    country: string
  }
}

interface TargetUser {
  fullName: string
  userAge: number
  contactEmail: string
  location: string
  isAdult: boolean
}

describe('transmute', () => {
  const sourceUser: SourceUser = {
    firstName: 'John',
    lastName: 'Doe',
    age: 25,
    email: 'john.doe@example.com',
    address: {
      street: '123 Main St',
      city: 'New York',
      country: 'USA'
    }
  }

  it('should perform direct property mapping', () => {
    const schema: Schema<SourceUser, TargetUser> = [
      { to: 'contactEmail', from: 'email' }
    ]

    const result = transmute(schema, sourceUser)
    expect(result).toEqual({ contactEmail: 'john.doe@example.com' })
  })

  it('should handle custom transmuter functions', () => {
    const schema: Schema<SourceUser, TargetUser> = [
      {
        to: 'fullName',
        from: ({ source }) =>
          `${source.firstName} ${source.lastName}`
      },
      {
        to: 'isAdult',
        from: ({ source }) =>
          source.age >= 18
      }
    ]

    const result = transmute(schema, sourceUser)
    expect(result).toEqual({
      fullName: 'John Doe',
      isAdult: true
    })
  })

  it('should handle transmutation with context data when specified', () => {
    interface Context {
      separator: string
    }

    const schema: Schema<SourceUser, TargetUser, Context> = [
      {
        to: 'location',
        from: ({ source, context }) =>
          `${source.address.city}${context.separator}${source.address.country}`
      }
    ]

    const result = transmute(schema, sourceUser, { separator: ' | ' })
    expect(result).toEqual({ location: 'New York | USA' })
  })

  it('should handle complete object transmutation', () => {
    const schema: Schema<SourceUser, TargetUser> = [
      {
        to: 'fullName',
        from: ({ source }) =>
          `${source.firstName} ${source.lastName}`
      },
      {
        to: 'userAge',
        from: 'age'
      },
      {
        to: 'contactEmail',
        from: 'email'
      },
      {
        to: 'location',
        from: ({ source }) =>
          `${source.address.city}, ${source.address.country}`
      },
      {
        to: 'isAdult',
        from: ({ source }) =>
          source.age >= 18
      }
    ]

    const result = transmute(schema, sourceUser)
    expect(result).toEqual({
      fullName: 'John Doe',
      userAge: 25,
      contactEmail: 'john.doe@example.com',
      location: 'New York, USA',
      isAdult: true
    })
  })

  it('should ensure type safety with context data', () => {
    interface Context {
      prefix: string
    }

    const schema: Schema<SourceUser, TargetUser, Context> = [
      {
        to: 'fullName',
        from: ({ source, context }) =>
          `${context.prefix} ${source.firstName} ${source.lastName}`
      }
    ]

    const result = transmute(schema, sourceUser, { prefix: 'Mr.' })
    expect(result).toEqual({ fullName: 'Mr. John Doe' })
  })

  it('should handle type inference correctly', () => {
    const schema1 = [
      {
        to: 'fullName' as const,
        from: ({ source }: { source: SourceUser }) =>
          `${source.firstName} ${source.lastName}`
      }
    ]

    interface Context {
      title: string
    }

    const schema2 = [
      {
        to: 'fullName' as const,
        from: ({ source, context }: { source: SourceUser; context: Context }) =>
          `${context.title} ${source.firstName} ${source.lastName}`
      }
    ]

    const result1 = transmute(schema1, sourceUser)
    const result2 = transmute(schema2, sourceUser, { title: 'Dr.' })

    expect(result1).toEqual({ fullName: 'John Doe' })
    expect(result2).toEqual({ fullName: 'Dr. John Doe' })
  })
})
