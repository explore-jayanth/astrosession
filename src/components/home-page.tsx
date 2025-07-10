"use client";

import { useRouter } from "next/navigation";
import { Sparkles, Star, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function HomePage() {
  const router = useRouter();

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
        <CardContent className="flex flex-col gap-4">
          <Button onClick={() => router.push('/host')} size="lg">
            <Star className="mr-2 h-5 w-5" />
            I'm a Host
          </Button>
          <Button onClick={() => router.push('/user')} variant="secondary" size="lg">
            <Users className="mr-2 h-5 w-5" />
            I'm a User
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
