import { ChangeUsername } from "@/components/page-for-input/change-username";

export default async function Username() {
  return (
    <div style={{ display: 'flex' }}>
     <div style={{ flex: 1 }}>
       <ChangeUsername />
     </div>
   </div>
  )
}