import { z } from "zod";

export const editProfileFormSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Username minimal 3 karakter" })
    .max(16, { message: "Username maksimal 16 karakter" }),
  bio: z.string().optional(),
});

export type EditProfileFormSchema = z.infer<typeof editProfileFormSchema>;
