import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { VerificationForm } from '@/components/forms/verification-form';

async function checkAuth() {
  try {
    const response = await fetch("http://localhost:8080/auth/check-auth", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
          Cookie: cookies().toString(),
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

  return <VerificationForm />;
}