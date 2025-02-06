import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { supabase } from "~/lib/supabase/client";
import { supabaseAdminClient } from "~/lib/supabase/server";
import { SUPABASE_BUCKET } from "~/lib/supabase/bucket";

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

  updateProfilePicture: privateProcedure
    .input(z.string().base64().optional())
    .mutation(async ({ ctx, input }) => {
      const { db, user } = ctx;

      const timestamp = new Date().getTime().toString();

      const fileName = `avatar-${user?.id}.jpeg`;

      if (input) {
        const buffer = Buffer.from(input, "base64");

        const { data, error } = await supabaseAdminClient.storage
          .from(SUPABASE_BUCKET.ProfilePictures)
          .upload(fileName, buffer, {
            contentType: "image/jpeg",
            upsert: true,
          });

        if (error) throw error;

        const profilePictureUrl = supabaseAdminClient.storage
          .from(SUPABASE_BUCKET.ProfilePictures)
          .getPublicUrl(data.path);

        await db.profile.update({
          where: {
            userId: user?.id,
          },
          data: {
            profilePictureUrl:
              profilePictureUrl.data.publicUrl + "?t=" + timestamp,
          },
        });
      }
    }),
});
