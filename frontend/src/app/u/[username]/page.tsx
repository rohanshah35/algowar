import AppNavbar from '@/components/navbar';
import { NavbarNested } from '@/components/vertical-navbar/vertical-navbar';
import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';

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

const UserProfile = async ({ params }: { params: { username: string } }) => {
  const { username } = params;

  const response = await fetch(`http://localhost:8080/user/exists/${username}`);
  const data = await response.json();

  const statsResponse = await fetch(`http://localhost:8080/user/stats/${username}`);
  const statsData = await statsResponse.json();

  if (!data.exists) {
    notFound();
  }

  let stats = {};
  if (statsData.stats) {
    try {
      stats = JSON.parse(statsData.stats);
    } catch (error) {
      console.error("Failed to parse stats JSON:", error);
    }
  }

  const auth = await checkAuth(); // Check if the user is logged in

  return (
    <div style={{ 
      display: 'flex', 
      minHeight: '100vh', 
      flexDirection: 'column' 
    }}>
      {auth ? <NavbarNested /> : <AppNavbar />}

      <main
        style={{
          display: 'flex',
          flexDirection: 'column',
          padding: '20px',
          flex: 1,
          marginLeft: auth ? '250px' : '0', // Adjust for vertical navbar if logged in
          marginTop: auth ? '0' : '50px', // Adjust for vertical navbar if logged in
          width: auth ? 'calc(100% - 250px)' : '100%'  // Adjust content width for vertical navbar
        }}
      >
        <h1>Profile page for: {username}</h1>
        <pre>{JSON.stringify(stats, null, 2)}</pre>
      </main>
    </div>
  );
};

export default UserProfile;
