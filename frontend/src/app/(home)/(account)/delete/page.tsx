import { DeleteAccount } from "@/components/account-forms/delete-account";

export default async function Email() {
  return (
    <div style={{ display: 'flex' }}>
     <div style={{ flex: 1 }}>
       <DeleteAccount />
     </div>
   </div>
  )
}