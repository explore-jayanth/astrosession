
"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { JitsiMeeting } from "@jitsi/react-sdk";
import type { JitsiMeetExternalApi } from "@jitsi/react-sdk/lib/types";
import Controls from "./controls";
import { Button } from "@/components/ui/button";
import { Loader2, Mic, MicOff, Video, VideoOff, Clock, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";


export default function MeetingRoom({ roomId }: { roomId: string }) {
  const searchParams = useSearchParams();
  const role = searchParams.get('role') === 'host' ? 'host' : 'user';

  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [loading, setLoading] = useState(false);
  const [hasPermissions, setHasPermissions] = useState<boolean | null>(null);
  const [view, setView] = useState<'pre-join' | 'waiting' | 'in-call'>(role === 'user' ? 'waiting' : 'pre-join');
  const [hostPresent, setHostPresent] = useState(role === 'host'); // Assume host is present if role is host

  const jitsiApiRef = useRef<JitsiMeetExternalApi | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();
  const router = useRouter();
  
  const JITSI_APP_ID = "vpaas-magic-cookie-b15a7a2a3f0543d5ad900291e1acbb05";

  useEffect(() => {
    const getPermissions = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setHasPermissions(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        // Stop tracks immediately to free up camera for Jitsi
        stream.getTracks().forEach(track => track.stop());
      } catch (error) {
        console.error('Error accessing media devices:', error);
        setHasPermissions(false);
        toast({
          variant: 'destructive',
          title: 'Permissions Denied',
          description: 'Please enable camera and microphone permissions in your browser to join the meeting.',
        });
      }
    };

    getPermissions();
  }, [toast]);
  
  // A real app would use a backend/websockets to check for host presence.
  // We'll simulate it here for the user.
  useEffect(() => {
    if (view === 'waiting') {
        const interval = setInterval(() => {
            // Simulate checking if the host has joined.
            // In this demo, we'll just assume after 5 seconds the host is there.
             console.log("Checking for host...");
             // A more robust check is needed in a real app.
             // For now, we assume the user clicking "Try to Join" means the host might be there.
        }, 5000);
        return () => clearInterval(interval);
    }
  }, [view]);


  const handleJoin = () => {
    setLoading(true);
    setView('in-call');
  };

  const handleApiReady = (api: any) => {
    jitsiApiRef.current = api;
    setLoading(false);
    
    api.addEventListener('videoConferenceLeft', () => {
        handleEndCall();
    });

    // When the host joins, they are considered present.
    if(role === 'host') {
        setHostPresent(true);
    }

    api.addEventListener('participantJoined', (participant: { displayName: string }) => {
        if(participant.displayName === 'Astrologer') {
            setHostPresent(true);
            if(view === 'waiting') {
                setView('pre-join');
            }
        }
    });
  };

  const handleEndCall = () => {
      if (jitsiApiRef.current) {
          // No dispose method on JitsiMeetExternalApi, just clear the reference
          jitsiApiRef.current = null;
      }
      setView('pre-join');
      window.location.href = '/';
  };

  const handleTryToJoin = () => {
    // Here, we'll just move them to the pre-join screen.
    // The Jitsi instance itself will then determine if the host is there.
    setView('pre-join');
  };

  const handleBackToHome = () => {
    router.push('/');
  }

  if (view === 'waiting') {
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
              <p className="text-muted-foreground">Room: <span className="font-mono text-primary">{roomId}</span></p>
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
  
  if (view === 'pre-join') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4">
        <div className="w-full max-w-4xl flex flex-col md:flex-row gap-8 items-center">
            <div className="flex-1 w-full">
                <h1 className="text-2xl font-bold mb-4 text-center">Ready to join?</h1>
                <div className="bg-card rounded-lg overflow-hidden shadow-lg w-full aspect-video relative flex items-center justify-center">
                    <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
                    {hasPermissions === false && (
                       <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground bg-card">
                         <VideoOff className="w-16 h-16" />
                         <p className="text-lg font-semibold">Camera is off or unavailable</p>
                       </div>
                    )}
                </div>
            </div>
            <div className="flex-1 flex flex-col gap-4 items-center w-full max-w-xs">
                 <p className="text-lg font-semibold">Room: <span className="font-mono text-primary">{roomId}</span></p>
                <Button onClick={handleJoin} size="lg" className="w-full" disabled={hasPermissions === false || loading}>
                  {loading ? <Loader2 className="animate-spin" /> : 'Join Now'}
                </Button>
                <div className="flex gap-4">
                    <Button variant={isMicOn ? "outline" : "destructive"} onClick={() => setIsMicOn(!isMicOn)}>
                        {isMicOn ? <Mic /> : <MicOff />}
                    </Button>
                    <Button variant={isCameraOn ? "outline" : "destructive"} onClick={() => setIsCameraOn(!isCameraOn)}>
                        {isCameraOn ? <Video /> : <VideoOff />}
                    </Button>
                </div>
                {hasPermissions === false && (
                  <Alert variant="destructive">
                    <AlertTitle>Permissions Required</AlertTitle>
                    <AlertDescription>
                      Camera and microphone access is required. Please check your browser settings.
                    </AlertDescription>
                  </Alert>
                )}
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-black">
        <JitsiMeeting
            domain="8x8.vc"
            roomName={`${JITSI_APP_ID}/AstroMeet-${roomId}`}
            userInfo={{ 
              displayName: role === 'host' ? 'Astrologer' : 'Client',
              email: role === 'host' ? 'astrologer@example.com' : 'client@example.com'
            }}
            configOverwrite={{
                startWithAudioMuted: !isMicOn,
                startWithVideoMuted: !isCameraOn,
                prejoinPageEnabled: false,
                enableWelcomePage: false,
                enableClosePage: false,
            }}
            interfaceConfigOverwrite={{
               SHOW_JITSI_WATERMARK: false,
               SHOW_WATERMARK_FOR_GUESTS: false,
               APP_NAME: 'AstroMeet',
               DISABLE_VIDEO_BACKGROUND: true,
               TOOLBAR_BUTTONS: [
                'camera',
                'chat',
...
                'desktop',
                'fullscreen',
                'hangup',
                'microphone',
                'participants-pane',
                'profile',
                'raisehand',
                'recording',
                'settings',
                'tileview',
                'toggle-camera',
               ],
            }}
            onApiReady={(api) => handleApiReady(api)}
            getIFrameRef={(iframeRef) => {
                iframeRef.style.height = '100%';
                iframeRef.style.width = '100%';
            }}
        />
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20">
            <Controls
              onEndCall={handleEndCall}
              role={role}
              roomId={roomId}
            />
        </div>
    </div>
  );
}
