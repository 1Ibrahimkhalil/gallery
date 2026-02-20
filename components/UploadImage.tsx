"use client";

import { uploadImage } from "@/app/dashboard/actions/uploadImage";
import Image from "next/image";
import { useState } from "react";
import toast from "react-hot-toast";

type UploadedImage = {
  id: string;
  url: string;
  filename: string;
  uploadedAt: Date;
  userId: string;
};

const UploadImage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [uploadedImage, setUploadedImage] = useState<UploadedImage | null>(
    null,
  );
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
    setError("");
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file first");
      return;
    }

    setLoading(true);
    setError("");
    const toastId = toast.loading("Uploading...");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const image = await uploadImage(formData);

      console.log(image);

      setUploadedImage(image);
      setFile(null);
      toast.success("Image uploaded successfully! ✅", { id: toastId });
    } catch (err: unknown) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : "";

      if (errorMessage.includes("Unauthorized")) {
        toast.error("You must be logged in to perform this action. 🔒", {
          id: toastId,
        });
      } else {
        toast.error("Failed to upload image. ❌", { id: toastId });
      }

      if (err instanceof Error) {
        setError(err.message || "Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex flex-col gap-6 p-6 border rounded-xl shadow-lg max-w-md mx-auto bg-white">
      <h2 className="text-2xl font-bold text-gray-800 text-center">
        Upload Your Image
      </h2>

      <input
        type="file"
        onChange={handleFileChange}
        className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <button
        onClick={handleUpload}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 disabled:opacity-50 transition"
      >
        {loading ? "Uploading..." : "Upload"}
      </button>

      {error && <p className="text-red-500 font-medium text-center">{error}</p>}

      {uploadedImage && (
        <div className="mt-6 flex flex-col items-center border rounded p-4 bg-gray-50 shadow-sm">
          <Image
            src={uploadedImage.url}
            alt={uploadedImage.filename}
            width={400}
            height={300}
            className="rounded-md shadow object-contain"
            loading="lazy"
          />
          <p className="mt-2 font-medium text-gray-700">
            {uploadedImage.filename}
          </p>
          <p className="text-sm text-gray-500">
            Uploaded on{" "}
            {new Date(uploadedImage.uploadedAt).toLocaleDateString()}
          </p>
        </div>
      )}
    </div>
  );
};

export default UploadImage;
