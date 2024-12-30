import { ProfileGrid } from "@/components/profile-grid/profile-grid";

export default async function Profile() {
    return (
      <div style={{ display: 'flex' }}>
       <div style={{ flex: 1 }}>
         <ProfileGrid />
         <ProfileGrid />
       </div>
     </div>
    )
  }