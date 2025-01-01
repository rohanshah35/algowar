import { ChangePfp } from "@/components/Account/account-forms/change-pfp";

export default async function Pfp() {
  return (
    <div style={{ display: 'flex' }}>
     <div style={{ flex: 1 }}>
       <ChangePfp />
     </div>
   </div>
  )
}