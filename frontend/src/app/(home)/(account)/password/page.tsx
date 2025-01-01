import { ChangePassword } from "@/components/Account/account-forms/change-password";

export default async function Password() {
  return (
    <div style={{ display: 'flex' }}>
     <div style={{ flex: 1 }}>
       <ChangePassword />
     </div>
   </div>
  )
}