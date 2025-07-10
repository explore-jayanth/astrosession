"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, RefreshCw } from "lucide-react";

export default function WaitingRoomPage({ params }: { params: { id: string } }) {
  const router = useRouter();

  const handleTryToJoin = () => {
    // Attempt to join the user to the room. If the host is still not there,
    // they might be redirected back here. In a real app with a proper
    // backend, this would be handled more smoothly.
    router.push(`/room/${params.id}?role=user-joining`);
  };
  
  const handleBackToHome = () => {
    router.push('/');
  }

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center p-4 bg-background bg-grid-primary/5">
      <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[radial-gradient(#4B008233_1px,transparent_1px)] [background-size:16px_16px]"></div>
      <Card className="w-full max-w-md shadow-2xl text-center">
        <CardHeader>
          <div className="flex items-center justify-center gap-2 mx-auto">
             <Clock className="h-8 w-8 text-primary" />
             <CardTitle className="text-3xl font-bold">Waiting Room</CardTitle>
          </div>
          <CardDescription>
            The host has not started the meeting yet. Please wait.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
            <p className="text-muted-foreground">Room: <span className="font-mono text-primary">{params.id}</span></p>
          <Button onClick={handleTryToJoin} size="lg">
            <RefreshCw className="mr-2 h-5 w-5" />
            Try to Join Now
          </Button>
           <Button onClick={handleBackToHome} variant="outline">
            Back to Home
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
