import { NavbarNested } from "@/components/Navbars/vertical-navbar/vertical-navbar";
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

  export default async function HomeLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    const auth = await checkAuth();
    if (!auth) {
      redirect('/');
    }
  
    return (
      <div className="app-layout" style={{ display: 'flex' }}>
        <NavbarNested />
        <main style={{ 
          flex: 1,
          marginLeft: '250px',
          padding: '20px',
          minHeight: '100vh',
          width: 'calc(100% - 250px)'
        }}>
          {children}
        </main>
      </div>
    )
  }



