"use client";

import Image from "next/image";
import { Trash2 } from "lucide-react";

type ImageType = {
  id: string;
  url: string;
  filename: string;
  uploadedAt: Date;
};

interface ImageCardProps {
  image: ImageType;
  onDelete: (id: string) => Promise<void>;
  priority?: boolean;
}

const ImageCard = ({ image, onDelete, priority = false }: ImageCardProps) => {
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-sm transition-all duration-500 hover:shadow-xl hover:-translate-y-1">
      {/* Delete Button Overlay */}
      <div className="absolute right-3 top-3 z-20 translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(image.id);
          }}
          aria-label={`Delete ${image.filename}`}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-red-500 shadow-lg backdrop-blur-md transition-colors hover:bg-red-50 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {/* Image Container */}
      <div className="aspect-4/3 relative overflow-hidden bg-gray-50">
        <Image
          src={image.url}
          alt={image.filename}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          loading={priority ? "eager" : "lazy"}
          priority={priority}
          placeholder="blur"
          blurDataURL={image.url}
        />
        {/* Subtle Gradient Overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      </div>

      {/* Details Container */}
      <div className="p-4">
        <h3
          className="truncate text-sm font-semibold text-gray-800"
          title={image.filename}
        >
          {image.filename}
        </h3>
        <div className="mt-1 flex items-center justify-between">
          <span className="text-[11px] font-medium uppercase tracking-wider text-gray-400">
            {new Date(image.uploadedAt).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ImageCard;
