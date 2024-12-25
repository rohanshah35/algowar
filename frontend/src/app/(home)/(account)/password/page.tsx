import { ChangePassword } from "@/components/account-forms/change-password";

export default async function Password() {
  return (
    <div style={{ display: 'flex' }}>
     <div style={{ flex: 1 }}>
       <ChangePassword />
     </div>
   </div>
  )
}