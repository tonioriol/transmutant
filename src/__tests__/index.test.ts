import { transmute, Schema } from '../'

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
    const schema: Schema<SourceUser, TargetUser>[] = [
      { from: 'email', to: 'contactEmail' }
    ]

    const result = transmute(schema, sourceUser)
    expect(result).toEqual({ contactEmail: 'john.doe@example.com' })
  })

  it('should handle custom transmutation functions', () => {
    const schema: Schema<SourceUser, TargetUser>[] = [
      {
        to: 'fullName',
        from: ({ source }) => `${source.firstName} ${source.lastName}`
      }
    ]

    const result = transmute(schema, sourceUser)
    expect(result).toEqual({ fullName: 'John Doe' })
  })

  it('should handle transmutation with both "from" and "fn"', () => {
    const schema: Schema<SourceUser, TargetUser>[] = [
      {
        to: 'userAge',
        from: ({ source }) => source['age'] + 1
      }
    ]

    const result = transmute(schema, sourceUser)
    expect(result).toEqual({ userAge: 26 })
  })

  it('should handle extra data in transmutations', () => {
    interface Extra {
      'separator': string
    }
    const schema: Schema<SourceUser, TargetUser, Extra>[] = [
      {
        to: 'location',
        from: ({ source, extra }) =>
          `${source.address.city}, ${source.address.country}${extra?.separator}`
      }
    ]

    const result = transmute(schema, sourceUser, { separator: ' | ' })
    expect(result).toEqual({ location: 'New York, USA | ' })
  })

  it('should handle multiple transmutations', () => {
    const schema: Schema<SourceUser, TargetUser>[] = [
      {
        to: 'fullName',
        from: ({ source }) => `${source.firstName} ${source.lastName}`
      },
      {
        from: 'age',
        to: 'userAge'
      },
      {
        from: 'email',
        to: 'contactEmail'
      },
      {
        to: 'location',
        from: ({ source }) =>
          `${source.address.city}, ${source.address.country}`
      },
      {
        to: 'isAdult',
        from: ({ source }) => source.age >= 18
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

  it('should set null for undefined transmutations', () => {
    const schema: Schema<SourceUser, { optionalField: string }>[] = [
      {
        to: 'optionalField',
        from: 'nonexistentField' as keyof SourceUser
      }
    ]

    const result = transmute(schema, sourceUser)
    expect(result).toEqual({ optionalField: null })
  })

  it('should handle empty schema', () => {
    const schema: Schema<SourceUser, {}>[] = []
    const result = transmute(schema, sourceUser)
    expect(result).toEqual({})
  })

  it('should handle null source values', () => {
    const sourceWithNull = {
      ...sourceUser,
      email: null as unknown as string
    }

    const schema: Schema<typeof sourceWithNull, Pick<TargetUser, 'contactEmail'>>[] = [
      { from: 'email', to: 'contactEmail' }
    ]

    const result = transmute(schema, sourceWithNull)
    expect(result).toEqual({ contactEmail: null })
  })
})
