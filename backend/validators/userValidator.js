import { z } from 'zod';

export const signupSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters").max(50, "Name too long"),
  emailAddress: z.string().email("Please provide a valid email format"),
  secretHash: z.string().min(6, "Password must be at least 6 characters"),
  accessLevel: z.enum(['Admin', 'Member']).optional(),
});

export const loginSchema = z.object({
  emailAddress: z.string().email("Invalid email provided"),
  secretHash: z.string().min(1, "Password is required"),
});
