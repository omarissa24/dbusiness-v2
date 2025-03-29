"use client";

import { BusinessCardForm } from "@/components/business-card-form";

export default function CreateBusinessCardPage() {
  return (
    <div className='container mx-auto py-8'>
      <div className='max-w-2xl mx-auto'>
        <h1 className='text-3xl font-bold mb-8'>Create Business Card</h1>
        <BusinessCardForm />
      </div>
    </div>
  );
}
