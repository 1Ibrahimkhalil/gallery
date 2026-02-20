import { auth } from "@clerk/nextjs/server";

export default async function Hero() {
  const { userId } = await auth();

  return (
    <section className="flex justify-center items-center h-[80vh] py-4">
      {!userId ? (
        <div className="flex flex-col items-center gap-2">
          <h1 className=" text-blue-600 text-6xl font-bold">
            Welcome to your Gallery
          </h1>
          <p className="text-gray-400">please sign in to upload your photos</p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-6 text-center">
          <h1 className="text-6xl font-bold text-blue-600">Welcome Back 👋</h1>
          <p className="text-gray-400 text-lg">
            Ready to upload new memories or manage your gallery?
          </p>
        </div>
      )}
    </section>
  );
}
