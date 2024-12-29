import { Container } from "@mantine/core";
import AppNavbar from "./components/navbar";
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Footer } from "./components/footer";

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
  if (auth) {
    redirect('/home')
  } 

  return (
    <div style={{ 
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <AppNavbar />
      <Container style={{ marginTop: '2rem', textAlign: 'center', flex: 1 }}>
      </Container>
      <Footer />
    </div>
  );
}