import CreateRoom from "@/components/Play/create-room/create-room";

export default async function Create() {
    return (
      <div style={{ display: 'flex' }}>
       <div style={{ flex: 1 }}>
         <CreateRoom />
       </div>
     </div>
    )
  }