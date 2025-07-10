import MeetingRoom from "./components/meeting-room";
import { redirect } from 'next/navigation';

export default async function RoomPage({ params, searchParams }: { params: { id: string }, searchParams: { [key: string]: string | string[] | undefined } }) {
  const role = searchParams?.role;

  if (role === 'user' || role === 'user-joining') {
     // In a real app, you would check if the host is present.
     // For this simulation, we will redirect users to a waiting page first.
     // The host link (?role=host) will bypass this check.
     if (role === 'user') {
        return redirect(`/room/${params.id}/wait`);
     }
  }

  // The 'host' or a user who clicked "Try to Join" from the waiting page will land here.
  const meetingRole = role === 'host' ? 'host' : 'user';
  
  return <MeetingRoom roomId={params.id} role={meetingRole} />;
}
