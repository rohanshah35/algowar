import { notFound } from 'next/navigation';

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

  console.log(stats);

  return (
    <div>
      <h1>Profile page for: {username}</h1>
      <pre>{JSON.stringify(stats, null, 2)}</pre>
    </div>
  );
};

export default UserProfile;
