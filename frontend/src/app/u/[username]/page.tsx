import AppNavbar from '@/components/Navbars/navbar';
import { NavbarNested } from '@/components/Navbars/vertical-navbar/vertical-navbar';
import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import { ProfileGrid } from '@/components/Profile/profile-grid/profile-grid';

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
  const { username } = await params;

  const response = await fetch(`http://localhost:8080/user/exists/${username}`);
  const data = await response.json();

  if (data.exists !== 'true') {
    notFound();
  }

  const statsResponse = await fetch(`http://localhost:8080/user/stats/${username}`);
  const statsData = await statsResponse.json();


  let stats = {};
  if (statsData.stats) {
    try {
      stats = JSON.parse(statsData.stats);
    } catch (error) {
      console.error("Failed to parse stats JSON:", error);
    }
  }

  const auth = await checkAuth();

  return (
    <div style={{ 
      display: 'flex', 
      minHeight: '100vh', 
      flexDirection: 'column', 
    }}>
      {auth ? <NavbarNested /> : <AppNavbar />}

      <main
        style={{
          display: 'flex',
          flexDirection: 'column',
          padding: '20px',
          flex: 1,
          marginLeft: auth ? '250px' : '0',
          marginTop: auth ? '10px' : '60px',
          width: auth ? 'calc(100vw - 250px)' : '100vw',
          maxWidth: '100%',
        }}
      >
        <ProfileGrid />
      </main>
    </div>
  );
};

export default UserProfile;
