import { z } from 'zod';

// type User = {
//   username: string;
// }

const hobbies = ['Programming', 'Weight Lifting', 'Guitar'] as const;

enum Hobbies {
  Programming = 'Programming',
  WeightLifting = 'Weight Lifting',
  Guitar = 'Guitar',
}

// hobby: z.enum(['Programming', 'Weight Lifting', 'Guitar']),
// hobby: z.nativeEnum(Hobbies),

const userSchema = z.object({
  id: z.union([z.string(), z.number()]), //z.string().or(z.number())
  username: z.string().min(3, 'Min length must be 3'),
  // age: z.number().gt(0),
  // birthday: z.date(),
  // isProgrammer: z.boolean(),
  // hobby: z.enum(hobbies),
  friends: z.array(z.string()),
  coords: z.tuple([z.number(), z.number(), z.number()]),
});

type User = z.infer<typeof userSchema>;

const user = {
  id: 1,
  username: 'constneth',
  friends: ['LeBron', 'Luka'],
  coords: [1, 2, 3],
};

console.log(userSchema.parse(user));

// console.log(userSchema.parse(user));

const emailSchema = z
  .string()
  .email()
  .refine(value => value.endsWith('@codingninja.com'), {
    message: 'Email must end with @codingninja.com',
  });

const email = 'test@codingninja.com';

console.log(emailSchema.parse(email));
