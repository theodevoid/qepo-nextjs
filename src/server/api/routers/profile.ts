import { createTRPCRouter, privateProcedure } from "../trpc";

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
});
