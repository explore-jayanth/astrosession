"use client";

import { useRouter } from "next/navigation";
import { Sparkles, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function HostHomePage() {
  const router = useRouter();

  const handleCreateMeeting = () => {
    const newRoomId = Math.random().toString(36).substring(2, 8);
    router.push(`/room/${newRoomId}?role=host`);
  };

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center p-4 bg-background bg-grid-primary/5">
      <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[radial-gradient(#4B008233_1px,transparent_1px)] [background-size:16px_16px]"></div>
      <Card className="w-full max-w-md shadow-2xl animate-fade-in-up">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="h-8 w-8 text-primary" />
            <CardTitle className="text-4xl font-headline font-bold">AstroMeet</CardTitle>
          </div>
          <CardDescription className="pt-2">Host Dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleCreateMeeting} className="w-full" size="lg">
            <Star className="mr-2 h-5 w-5" />
            Start New Meeting
          </Button>
        </CardContent>
        <CardFooter>
          <p className="text-xs text-muted-foreground text-center w-full">
            Create a room and share the room code with your client.
          </p>
        </CardFooter>
      </Card>
    </main>
  );
}
