import { ChangeUsername } from "@/components/account-forms/change-username";

export default async function Username() {
  return (
    <div style={{ display: 'flex' }}>
     <div style={{ flex: 1 }}>
       <ChangeUsername />
     </div>
   </div>
  )
}