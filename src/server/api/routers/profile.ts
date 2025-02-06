import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const profileRouter = createTRPCRouter({
  getProfile: privateProcedure.query(async ({ ctx }) => {
    const { db, user } = ctx;

    const profile = await db.profile.findUnique({
      where: {
        userId: user?.id,
      },
      select: {
        bio: true,
        profilePictureUrl: true,
        username: true,
      },
    });

    return profile;
  }),

  updateProfile: privateProcedure
    .input(
      z.object({
        // TODO: sanitize username input
        username: z.string().min(3).max(16).toLowerCase().optional(),
        bio: z.string().max(300).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { db, user } = ctx;
      const { username, bio } = input;

      if (username) {
        const usernameExists = await db.profile.findUnique({
          where: {
            username,
          },
          select: {
            userId: true,
          },
        });

        if (usernameExists) {
          throw new TRPCError({
            code: "UNPROCESSABLE_CONTENT",
            message: "USERNAME_USED",
          });
        }
      }

      const updatedUser = await db.profile.update({
        where: {
          userId: user?.id,
        },
        data: {
          username,
          bio,
        },
      });

      return updatedUser;
    }),
});
