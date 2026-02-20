"use client";

import { deleteImage } from "@/app/dashboard/actions/deleteImage";
import { useState } from "react";
import toast from "react-hot-toast";
import ImageCard from "./ImageCard";

type ImageType = {
  id: string;
  url: string;
  filename: string;
  uploadedAt: Date;
};
interface IProps {
  images: ImageType[];
}

const Gallery = ({ images }: IProps) => {
  const [gallery, setGallery] = useState(images);

  const handleDelete = async (id: string) => {
    const toastId = toast.loading("Deleting...");
    try {
      await deleteImage(id);
      setGallery((prev) => prev.filter((image) => image.id !== id));
      toast.success("Image deleted successfully! 🗑️", { id: toastId });
    } catch (err: unknown) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : "";

      if (errorMessage.includes("Unauthorized")) {
        toast.error("You must be logged in to perform this action. 🔒", {
          id: toastId,
        });
      } else {
        toast.error("Failed to delete image. ❌", { id: toastId });
      }
    }
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
        {gallery.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <p className="text-lg font-medium">No images found</p>
            <p className="text-sm">Upload some images to see them here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {gallery.map((image, index) => (
              <ImageCard
                key={image.id}
                image={image}
                onDelete={handleDelete}
                priority={index < 3} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;
