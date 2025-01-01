import { ChangeEmail } from "@/components/Account/account-forms/change-email";

export default async function Email() {
  return (
    <div style={{ display: 'flex' }}>
     <div style={{ flex: 1 }}>
       <ChangeEmail />
     </div>
   </div>
  )
}