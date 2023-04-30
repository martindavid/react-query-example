import type { SexType } from '@faker-js/faker';
import { faker } from '@faker-js/faker';

type SubscriptionTier = 'free' | 'basic' | 'business';

type User = {
  id: string
  avatar: string
  birthday: Date
  email: string
  firstName: string
  lastName: string
  sex: SexType
  subscriptionTier: SubscriptionTier
}

function createRandomUser(): User {
  const sex = faker.name.sexType();
  const firstName = faker.name.firstName(sex);
  const lastName = faker.name.lastName();
  const email = faker.internet.email(firstName, lastName);

  return {
    id: faker.datatype.uuid(),
    avatar: faker.image.avatar(),
    birthday: faker.date.birthdate(),
    email,
    firstName,
    lastName,
    sex,
    subscriptionTier: faker.helpers.arrayElement(['free', 'basic', 'business']),
  };
}


export default function handler(req, res) {
  const users = [...Array(10).keys()].map(() => createRandomUser())
  res.status(200).json({
    data: users
  })
}
