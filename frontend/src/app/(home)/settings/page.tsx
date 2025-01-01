import { Settings } from "@/components/Settings/settings-form/settings-form";

export default async function SettingsPage() {
  return (
    <div style={{ display: 'flex' }}>
     <div style={{ flex: 1 }}>
       <Settings />
     </div>
   </div>
  )
}