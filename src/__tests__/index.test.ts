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
    const schema: Schema<SourceUser, TargetUser>[] = [
      { from: 'email', to: 'contactEmail' }
    ]

    const result = transmute(schema, sourceUser)
    expect(result).toEqual({ contactEmail: 'john.doe@example.com' })
  })

  it('should handle custom transmuter functions', () => {
    const schema: Schema<SourceUser, TargetUser>[] = [
      {
        to: 'fullName',
        from: ({ source }) => `${source.firstName} ${source.lastName}`
      },
      {
        to: 'isAdult',
        from: ({ source }) => source.age >= 18
      }
    ]

    const result = transmute(schema, sourceUser)
    expect(result).toEqual({
      fullName: 'John Doe',
      isAdult: true
    })
  })

  it('should handle transmutation with extra data', () => {
    interface Extra {
      separator: string
    }

    const schema: Schema<SourceUser, Pick<TargetUser, 'location'>, Extra>[] = [
      {
        to: 'location',
        from: ({ source, extra }) =>
          `${source.address.city}, ${source.address.country}${extra.separator}`
      }
    ]

    const result = transmute(schema, sourceUser, { separator: ' | ' })
    expect(result).toEqual({ location: 'New York, USA | ' })
  })

  it('should handle complete object transmutation', () => {
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
})
