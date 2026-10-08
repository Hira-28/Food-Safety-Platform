import { z } from "zod";

const UNIVERSITY_DOMAIN = process.env.UNIVERSITY_EMAIL_DOMAIN ?? "diu.edu.bd";

export const signUpSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z
      .string()
      .email("Enter a valid email address")
      .refine((val) => val.toLowerCase().endsWith(`@${UNIVERSITY_DOMAIN}`), {
        message: `Email must be a university address ending in @${UNIVERSITY_DOMAIN}`,
      }),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const signInSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});