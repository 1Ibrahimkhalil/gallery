"use server"

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { del } from "@vercel/blob";

export const deleteImage = async (id: string) => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized: userId is null");

  
  const image = await prisma.image.findUnique({
    where: { id },
  });
  if (!image) throw new Error("Image not found");
  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
  });
  if (!user || image.userId !== user.id)
    throw new Error("Unauthorized: image does not belong to user");

  await del(image.url, {
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });
  await prisma.image.delete({
    where: { id },
  });
  return { success: true, id };
};
