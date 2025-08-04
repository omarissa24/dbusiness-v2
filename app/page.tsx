import { CircleUser, Sparkles, Share2, QrCode } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ModeToggle } from "@/components/ModeToggle";
export default function Home() {
  return (
    <div className='min-h-screen bg-gradient-to-b from-background to-secondary'>
      <header className='container mx-auto px-4 py-6'>
        <nav className='flex justify-between items-center'>
          <div className='flex items-center space-x-2'>
            <CircleUser className='h-8 w-8 text-primary' />
            <span className='text-xl font-bold'>Digital Cards</span>
          </div>
          <div className='space-x-4 flex items-center'>
            <Button variant='ghost' asChild>
              <Link href='/login'>Login</Link>
            </Button>
            <Button asChild>
              <Link href='/register'>Get Started</Link>
            </Button>
            <ModeToggle />
          </div>
        </nav>
      </header>

      <main className='container mx-auto px-4 py-16'>
        <div className='text-center max-w-3xl mx-auto'>
          <h1 className='text-4xl md:text-6xl font-bold tracking-tight mb-6'>
            Your Professional Identity,{" "}
            <span className='text-primary'>Digitally Enhanced</span>
          </h1>
          <p className='text-xl text-muted-foreground mb-12'>
            Create stunning digital business cards that make lasting
            impressions. Share instantly with QR codes and NFC technology.
          </p>
          <div className='flex justify-center gap-4'>
            <Button size='lg' asChild>
              <Link href='/register'>Create Your Card</Link>
            </Button>
            {/* <Button size='lg' variant='outline' asChild>
              <Link href='/examples'>View Examples</Link>
            </Button> */}
          </div>
        </div>

        <div className='grid md:grid-cols-3 gap-8 mt-24'>
          <Card className='p-6 text-center'>
            <Sparkles className='h-12 w-12 mx-auto mb-4 text-primary' />
            <h2 className='text-xl font-semibold mb-2'>Beautiful Design</h2>
            <p className='text-muted-foreground'>
              Customize your card with your brand colors, logo, and personal
              style.
            </p>
          </Card>

          <Card className='p-6 text-center'>
            <Share2 className='h-12 w-12 mx-auto mb-4 text-primary' />
            <h2 className='text-xl font-semibold mb-2'>Instant Sharing</h2>
            <p className='text-muted-foreground'>
              Share your card instantly via email, message, or social media.
            </p>
          </Card>

          <Card className='p-6 text-center'>
            <QrCode className='h-12 w-12 mx-auto mb-4 text-primary' />
            <h2 className='text-xl font-semibold mb-2'>QR & NFC Ready</h2>
            <p className='text-muted-foreground'>
              Generate QR codes and enable NFC sharing for seamless connections.
            </p>
          </Card>
        </div>
      </main>
    </div>
  );
}
