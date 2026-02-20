import UploadImage from "@/components/UploadImage";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

const DashboardPage = async () => {
  const { userId } = await auth();
  if (!userId) {
    return <div>Please login to continue</div>;
  }
  let user = await prisma.user.findUnique({
    where:{
      clerkId:userId
    }
  })
  if (!user) {
    user = await prisma.user.create({
      data:{
        clerkId:userId
      }
    })
  }
  return (
    <div className="flex justify-center pt-10">
      <UploadImage/>
    </div>
  )
};

export default DashboardPage;
