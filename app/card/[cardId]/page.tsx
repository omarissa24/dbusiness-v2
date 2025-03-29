"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Mail,
  Phone,
  Globe,
  MapPin,
  Building2,
  Briefcase,
  UserPlus,
} from "lucide-react";

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

export default function BusinessCardPage() {
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

  const getVCardUrl = () => {
    if (!card) return "";

    // Create vCard content
    const vCard = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      `FN:${card.name}`,
      card.title ? `TITLE:${card.title}` : "",
      card.company ? `ORG:${card.company}` : "",
      card.email ? `EMAIL:${card.email}` : "",
      card.phone ? `TEL:${card.phone}` : "",
      card.website ? `URL:${card.website}` : "",
      card.address ? `ADR:;;${card.address};;;` : "",
      "END:VCARD",
    ]
      .filter(Boolean)
      .join("\n");

    // Create data URL
    return `data:text/vcard;base64,${btoa(vCard)}`;
  };

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary'></div>
      </div>
    );
  }

  if (!card) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold mb-2'>Business Card Not Found</h1>
          <p className='text-muted-foreground'>
            This business card may have been removed or is private.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-b from-background to-muted p-4 md:p-8'>
      <div className='max-w-2xl mx-auto'>
        <Card className='overflow-hidden'>
          {/* Header Section */}
          <div className='relative h-48 md:h-64 bg-gradient-to-r from-primary/10 to-primary/5'>
            {card.imageUrl && (
              <div className='absolute -bottom-16 left-8 md:left-12'>
                <div className='relative w-32 h-32 rounded-full border-4 border-background overflow-hidden'>
                  <Image
                    src={card.imageUrl}
                    alt={card.name}
                    fill
                    className='object-cover'
                  />
                </div>
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className='pt-20 md:pt-24 px-8 md:px-12 pb-8'>
            <div className='flex justify-between items-start mb-6'>
              <div>
                <h1 className='text-2xl md:text-3xl font-bold'>{card.name}</h1>
                {card.title && (
                  <p className='text-lg text-muted-foreground'>{card.title}</p>
                )}
                {card.company && (
                  <div className='flex items-center gap-2 text-muted-foreground mt-1'>
                    <Building2 className='h-4 w-4' />
                    <span>{card.company}</span>
                  </div>
                )}
              </div>
              <Button
                variant='outline'
                className='gap-2'
                onClick={() => {
                  const link = document.createElement("a");
                  link.href = getVCardUrl();
                  link.download = `${card.name
                    .toLowerCase()
                    .replace(/\s+/g, "-")}.vcf`;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
              >
                <UserPlus className='h-4 w-4' />
                Add to Contacts
              </Button>
            </div>

            {card.bio && (
              <div className='prose prose-sm max-w-none mb-6'>
                <p className='text-muted-foreground'>{card.bio}</p>
              </div>
            )}

            {/* Contact Information */}
            <div className='space-y-4'>
              {card.email && (
                <Button
                  variant='outline'
                  className='w-full justify-start gap-2'
                >
                  <Mail className='h-4 w-4' />
                  {card.email}
                </Button>
              )}
              {card.phone && (
                <Button
                  variant='outline'
                  className='w-full justify-start gap-2'
                >
                  <Phone className='h-4 w-4' />
                  {card.phone}
                </Button>
              )}
              {card.website && (
                <Button
                  variant='outline'
                  className='w-full justify-start gap-2'
                >
                  <Globe className='h-4 w-4' />
                  {card.website}
                </Button>
              )}
              {card.address && (
                <Button
                  variant='outline'
                  className='w-full justify-start gap-2'
                >
                  <MapPin className='h-4 w-4' />
                  {card.address}
                </Button>
              )}
            </div>

            {/* Social Links */}
            {card.socialLinks && Object.keys(card.socialLinks).length > 0 && (
              <div className='mt-6'>
                <h2 className='text-lg font-semibold mb-3'>Social Links</h2>
                <div className='flex flex-wrap gap-2'>
                  {Object.entries(card.socialLinks).map(([platform, url]) => (
                    <Button
                      key={platform}
                      variant='outline'
                      size='sm'
                      className='gap-2'
                      onClick={() => window.open(url, "_blank")}
                    >
                      <Briefcase className='h-4 w-4' />
                      {platform}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
