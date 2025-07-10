"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function UserHomePage() {
  const router = useRouter();
  const [roomCode, setRoomCode] = useState("");

  const handleJoinMeeting = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (roomCode.trim()) {
      router.push(`/room/${roomCode.trim()}?role=user`);
    }
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
          <CardDescription className="pt-2">Your celestial space for astrology consultations.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleJoinMeeting} className="flex flex-col gap-4">
            <Input
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value)}
              placeholder="Enter room code to join"
              className="flex-grow text-center"
              aria-label="Room Code"
            />
            <Button type="submit" variant="secondary" size="lg" disabled={!roomCode.trim()}>
              <LogIn className="mr-2 h-5 w-5" />
              Join Meeting
            </Button>
          </form>
        </CardContent>
        <CardFooter>
           <p className="text-xs text-muted-foreground text-center w-full">
            Enter the code provided by your astrologer to begin.
          </p>
        </CardFooter>
      </Card>
    </main>
  );
}
