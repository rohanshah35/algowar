import { NavbarNested } from "@/components/vertical-navbar/vertical-navbar";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

async function checkAuth() {
    try {
      const cookieStore = await cookies();
      const response = await fetch("http://localhost:8080/auth/check-auth", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Cookie: cookieStore.toString(),
        },
        credentials: "include",
      });
  
      if (response.ok) {
        const data = await response.json();
        return data;
      }
      return null;
    } catch (error) {
      console.error('Auth check failed:', error);
      return null;
    }
  }

export default async function Home() {
    const auth = await checkAuth();
    if (!auth) {
      redirect('/');
    }
    return (
      <div style={{ display: 'flex' }}>
       <NavbarNested username={auth.username} email={auth.email} />
       <div style={{ flex: 1 }}>
         {/* Your main content goes here */}
       </div>
     </div>
    )
  }