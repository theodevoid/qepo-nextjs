import { z } from "zod";
import { supabaseAdminClient } from "~/lib/supabase/server";
import { passwordSchema } from "~/schemas/auth";
import { generateFromEmail } from "unique-username-generator";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const authRouter = createTRPCRouter({
  register: publicProcedure
    .input(
      z.object({
        email: z.string().email().toLowerCase(),
        password: passwordSchema,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;
      const { email, password } = input;

      await db.$transaction(async (tx) => {
        let userId = "";

        try {
          const { data, error } =
            await supabaseAdminClient.auth.admin.createUser({
              email,
              password,
            });

          if (data.user) {
            userId = data.user.id;
          }

          if (error) throw error;

          const generatedUsername = generateFromEmail(email);

          await tx.profile.create({
            data: {
              email,
              userId: data.user.id,
              username: generatedUsername,
            },
          });
        } catch (error) {
          console.log(error);
          await supabaseAdminClient.auth.admin.deleteUser(userId);
        }
      });
    }),
});
