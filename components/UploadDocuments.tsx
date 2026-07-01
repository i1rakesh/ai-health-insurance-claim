"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileText, ImageIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "react-hot-toast";

interface UploadDocumentsProps {
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
  loading: boolean;
  onExtract: () => void;
}

const SUPPORTED_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "application/pdf",
];

export default function UploadDocuments({
  files,
  setFiles,
  loading,
  onExtract,
}: UploadDocumentsProps) {
  const onDrop = useCallback(
  (acceptedFiles: File[]) => {
    const validFiles: File[] = [];

    acceptedFiles.forEach((file) => {
      if (!SUPPORTED_TYPES.includes(file.type)) {
        toast.error(
          `${file.name} is not supported.\nOnly JPG, JPEG, PNG and PDF files are allowed.`
        );
        return;
      }

      validFiles.push(file);
    });

    if (validFiles.length) {
      setFiles((prev) => [...prev, ...validFiles]);
    }
  },
  [setFiles]
);

  const { getRootProps, getInputProps, isDragActive } =
  useDropzone({
    multiple: true,
    onDrop,

    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "application/pdf": [".pdf"],
    },
  });

  function removeFile(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-5">
      <Card
        {...getRootProps()}
        className={`cursor-pointer border-2 border-dashed p-8 transition-all

        ${
          isDragActive
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300"
        }`}
      >
        <input {...getInputProps()} />

        <div className="flex flex-col items-center gap-4 text-center">
          <Upload className="h-10 w-10 text-gray-500" />

          <div>
            <h3 className="text-lg font-semibold">
              Upload Medical Documents
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Prescription, Hospital Bill,
              Pharmacy Bill, Lab Report,
              Images or PDFs
            </p>
          </div>

          <Button type="button">
            Browse Files
          </Button>
        </div>
      </Card>

      {files.length > 0 && (
        <Card className="space-y-3 p-4">
          <h3 className="font-semibold">
            Uploaded Documents
          </h3>

          <div className="space-y-3">
            {files.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div className="flex items-center gap-3">
                  {file.type.startsWith("image") ? (
                    <ImageIcon className="h-5 w-5 text-blue-600" />
                  ) : (
                    <FileText className="h-5 w-5 text-red-600" />
                  )}

                  <div>
                    <p className="font-medium">
                      {file.name}
                    </p>

                    <p className="text-xs text-gray-500">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="rounded-full p-2 transition hover:bg-red-100"
                >
                  <X className="h-4 w-4 text-red-500" />
                </button>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Button
        type="button"
        className="w-full"
        disabled={loading || files.length === 0}
        onClick={onExtract}
      >
        {loading
          ? "Extracting Medical Information..."
          : "✨ Extract Using AI"}
      </Button>
    </div>
  );
}