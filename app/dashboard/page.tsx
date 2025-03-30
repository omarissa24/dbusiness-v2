"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ModeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, Pencil, Trash2, Eye, LogOut, MoreVertical } from "lucide-react";

interface BusinessCard {
  id: string;
  name: string;
  title?: string;
  company?: string;
  email?: string;
  phone?: string;
  website?: string;
  imageUrl?: string;
  isPublic: boolean;
  views: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const [businessCards, setBusinessCards] = useState<BusinessCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBusinessCards();
  }, []);

  const fetchBusinessCards = async () => {
    try {
      const response = await fetch("/api/business-cards");
      if (!response.ok) throw new Error("Failed to fetch business cards");
      const data = await response.json();
      setBusinessCards(data);
    } catch (error) {
      console.error("Error fetching business cards:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCard = () => {
    router.push("/dashboard/create");
  };

  const handleEditCard = (id: string) => {
    router.push(`/dashboard/edit/${id}`);
  };

  const handleDeleteCard = async (id: string) => {
    if (!confirm("Are you sure you want to delete this business card?")) return;

    try {
      const response = await fetch(`/api/business-cards/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete business card");
      setBusinessCards(businessCards.filter((card) => card.id !== id));
    } catch (error) {
      console.error("Error deleting business card:", error);
    }
  };

  const handleViewCard = (id: string) => {
    router.push(`/card/${id}`);
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        Loading...
      </div>
    );
  }

  return (
    <div className='container mx-auto py-8 px-4'>
      <div className='flex justify-between items-center mb-8'>
        <h1 className='text-3xl font-bold'>My Cards</h1>
        <div className='flex items-center gap-4'>
          <ModeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='outline' size='icon'>
                <MoreVertical className='h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuItem onClick={handleCreateCard}>
                <Plus className='h-4 w-4 mr-2' />
                Create New Card
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })}>
                <LogOut className='h-4 w-4 mr-2' />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {businessCards.map((card) => (
          <Card key={card.id}>
            <CardHeader>
              <div className='flex justify-between items-start'>
                <div>
                  <CardTitle>{card.name}</CardTitle>
                  <CardDescription>{card.title || "No title"}</CardDescription>
                </div>
                <div className='flex gap-2'>
                  <Button
                    variant='ghost'
                    size='icon'
                    onClick={() => handleViewCard(card.id)}
                  >
                    <Eye className='h-4 w-4' />
                  </Button>
                  <Button
                    variant='ghost'
                    size='icon'
                    onClick={() => handleEditCard(card.id)}
                  >
                    <Pencil className='h-4 w-4' />
                  </Button>
                  <Button
                    variant='ghost'
                    size='icon'
                    onClick={() => handleDeleteCard(card.id)}
                  >
                    <Trash2 className='h-4 w-4' />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className='space-y-2'>
                {card.company && (
                  <p className='text-sm'>Company: {card.company}</p>
                )}
                {card.email && <p className='text-sm'>Email: {card.email}</p>}
                {card.phone && <p className='text-sm'>Phone: {card.phone}</p>}
                <p className='text-sm'>Views: {card.views}</p>
                <p className='text-sm'>
                  Status: {card.isPublic ? "Public" : "Private"}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {businessCards.length === 0 && (
        <div className='text-center py-12'>
          <p className='text-muted-foreground'>
            You haven&apos;t created any business cards yet.
          </p>
          <Button onClick={handleCreateCard} className='mt-4'>
            Create Your First Card
          </Button>
        </div>
      )}
    </div>
  );
}
