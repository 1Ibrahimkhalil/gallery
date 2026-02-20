"use server"

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export const getImages = async () => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized: userId is null");
  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: { images: true },
  });
  if (!user) throw new Error("User not found");
  return user?.images;
};
