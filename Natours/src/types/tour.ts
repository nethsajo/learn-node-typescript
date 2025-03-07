import { z } from 'zod';

export const tourSchemaObject = z.object({
  id: z.union([z.number(), z.string()]),
  name: z.string(),
  duration: z.number(),
  maxGroupSize: z.number(),
  difficulty: z.string(),
  ratingsAverage: z.number(),
  ratingsQuantity: z.number(),
  price: z.number(),
  summary: z.string(),
  description: z.string(),
  imageCover: z.string(),
  images: z.string(),
  startDates: z.array(z.string()),
});

export type Tour = z.infer<typeof tourSchemaObject>;

// export type Tour = {
//   id: number;
//   name: string;
//   duration: number;
//   maxGroupSize: number;
//   difficulty: string;
//   ratingsAverage: number;
//   ratingsQuantity: number;
//   price: number;
//   summary: string;
//   description: string;
//   imageCover: string;
//   images: string;
//   startDates: string[];
// };
