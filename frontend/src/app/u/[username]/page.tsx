import AppNavbar from '@/components/Navbars/navbar';
import { NavbarNested } from '@/components/Navbars/vertical-navbar/vertical-navbar';
import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import { ProfileGrid } from '@/components/Profile/profile-grid/profile-grid';
import { ProfileProvider } from '@/context/profile-context';

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

async function fetchProfileInfo(username: string) {
  const cookieStore = cookies().toString();
  const response = await fetch(`http://localhost:8080/user/profile-info/${username}`, {
    headers: {
      "Content-Type": "application/json",
      Cookie: cookieStore,
    },
    credentials: "include",
  });

  if (!response.ok) throw new Error("Failed to fetch profile info");
  return response.json();
}

const UserProfile = async ({ params }: { params: { username: string } }) => {
  const { username } = await params;
  const auth = await checkAuth();

  const userExistsResponse = await fetch(`http://localhost:8080/user/exists/${username}`);
  const userExists = await userExistsResponse.json();
  if (!userExists.exists) notFound();

  const profileInfo = await fetchProfileInfo(username);

  return (
    <ProfileProvider profileInfo={profileInfo}>
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
    </ProfileProvider>
  );
};

export default UserProfile;
