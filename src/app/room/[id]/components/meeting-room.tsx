
"use client";

import { useState, useRef, useEffect } from "react";
import { JitsiMeeting } from "@jitsi/react-sdk";
import Controls from "./controls";
import { Button } from "@/components/ui/button";
import { Loader2, Mic, MicOff, Video, VideoOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";


export default function MeetingRoom({ roomId, role }: { roomId: string, role: 'host' | 'user' }) {
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [loading, setLoading] = useState(false);
  const [hasPermissions, setHasPermissions] = useState<boolean | null>(null);
  const [hasJoined, setHasJoined] = useState(false);

  const jitsiApiRef = useRef<any>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();
  
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

  const handleJoin = () => {
    setLoading(true);
    setHasJoined(true);
  };

  const handleApiReady = (api: any) => {
    jitsiApiRef.current = api;
    setLoading(false);
    
    api.addEventListener('videoConferenceLeft', () => {
        handleEndCall();
    });
  };

  const handleEndCall = () => {
      if (jitsiApiRef.current) {
          jitsiApiRef.current.dispose();
      }
      setHasJoined(false);
      jitsiApiRef.current = null;
      window.location.href = '/';
  };
  
  if (!hasJoined) {
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
            userInfo={{ displayName: role === 'host' ? 'Astrologer' : 'Client' , email:"jayanth@gmail.com"}}
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
                'closedcaptions',
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
