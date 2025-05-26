import JoinRoom from "@/components/Play/join-room/join-room";

export default async function Join() {
  return (
    <div style={{ display: 'flex' }}>
     <div style={{ flex: 1 }}>
       <JoinRoom />
     </div>
   </div>
  )
}