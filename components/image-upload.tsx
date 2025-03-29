"use client";

import { UploadButton } from "@/components/upload";
import { X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface ImageUploadProps {
  value?: string;
  onChange: (value: string) => void;
}

export function ImageUpload({ value, onChange }: ImageUploadProps) {
  const [, setIsUploading] = useState(false);

  return (
    <div className='space-y-4'>
      {value ? (
        <div className='relative w-[200px] h-[200px]'>
          <Image
            src={value}
            alt='Profile image'
            fill
            className='object-cover rounded-lg'
          />
          <button
            onClick={() => onChange("")}
            className='absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90'
          >
            <X className='h-4 w-4' />
          </button>
        </div>
      ) : (
        <div className='w-[200px] h-[200px] border-2 border-dashed rounded-lg flex items-center justify-center'>
          <UploadButton
            endpoint='imageUploader'
            onClientUploadComplete={(res) => {
              if (res?.[0]) {
                onChange(res[0].ufsUrl);
              }
              setIsUploading(false);
            }}
            onUploadError={(error: Error) => {
              console.error("Upload error:", error);
              setIsUploading(false);
            }}
            onUploadBegin={() => {
              setIsUploading(true);
            }}
            className='ut-button:bg-primary ut-button:text-primary-foreground ut-button:hover:bg-primary/90'
          />
        </div>
      )}
    </div>
  );
}
