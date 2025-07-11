"use client";

import { Suspense } from 'react';
import MeetingRoom from "./components/meeting-room";
import { Loader2 } from 'lucide-react';

// Update your props type to match Next.js expectations
type RoomPageProps = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function RoomPage({ params }: RoomPageProps) {
  // Await the params promise
  const resolvedParams = await params;
  
  return (
    <Suspense fallback={
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    }>
      <MeetingRoom roomId={resolvedParams.id} />
    </Suspense>
  );
}