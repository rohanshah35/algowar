import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { SignupForm } from '@/components/Authentication/auth-forms/signup-form';

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

export default async function LoginPage() {
  const auth = await checkAuth();
  
  if (auth) {
    redirect('/');
  }
  console.log(auth);

  return <SignupForm />;
}