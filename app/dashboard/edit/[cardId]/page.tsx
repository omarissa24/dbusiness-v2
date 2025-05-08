"use client";

import { useEffect, useState } from "react";
import { BusinessCardForm } from "@/components/business-card-form";
import { useParams } from "next/navigation";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface BusinessCard {
  id: string;
  name: string;
  title?: string;
  company?: string;
  email?: string;
  phone?: string;
  website?: string;
  address?: string;
  bio?: string;
  socialLinks?: Record<string, string>;
  imageUrl?: string;
  theme: string;
  isPublic: boolean;
}

export default function EditBusinessCardPage() {
  const params = useParams();
  const [card, setCard] = useState<BusinessCard | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCard = async () => {
      try {
        const response = await fetch(`/api/business-cards/${params.cardId}`);
        if (!response.ok) throw new Error("Failed to fetch business card");
        const data = await response.json();
        setCard(data);
      } catch (error) {
        console.error("Error fetching business card:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCard();
  }, [params.cardId]);

  if (loading) {
    return (
      <div className='container mx-auto py-8'>
        <div className='max-w-2xl mx-auto'>
          <div className='flex items-center justify-center min-h-[400px]'>
            <LoadingSpinner size={50} />
          </div>
        </div>
      </div>
    );
  }

  if (!card) {
    return (
      <div className='container mx-auto py-8'>
        <div className='max-w-2xl mx-auto'>
          <div className='flex items-center justify-center min-h-[400px]'>
            Business card not found
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='container mx-auto py-8'>
      <div className='max-w-2xl mx-auto'>
        <h1 className='text-3xl font-bold mb-8'>Edit Business Card</h1>
        <BusinessCardForm initialData={card} cardId={card.id} />
      </div>
    </div>
  );
}
