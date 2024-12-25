import { Settings } from "@/components/settings-form/settings-form";

export default async function SettingsPage() {
  return (
    <div style={{ display: 'flex' }}>
     <div style={{ flex: 1 }}>
       <Settings />
     </div>
   </div>
  )
}