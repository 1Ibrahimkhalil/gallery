"use server";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { put } from "@vercel/blob";

export async function uploadImage(formData: FormData) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized: userId is null");
  const file = formData.get("file") as File;
  if (!file) throw new Error("No file uploaded");
  const blob = await put(file.name, file, {
    access: "public",
    token: process.env.BLOB_READ_WRITE_TOKEN,
     addRandomSuffix: true,
  });

  const user = await prisma.user.findUnique({
    where: {
      clerkId: userId,
    },
  });
  if (!user) throw new Error("User not found");
  const image = await prisma.image.create({
    data: {
      url: blob.url,
      filename: file.name,
      userId: user.id,
    },
  });
  return image;
}
