import { Inter } from 'next/font/google';
import { LeaderboardTable } from "@/components/Leaderboard/leaderboard-table/leaderboard-table";
const inter = Inter({ subsets: ['latin'], weight: ['300'] });
export default async function Leaderboard() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 style={{ fontFamily: inter.style.fontFamily, fontWeight: 600, fontSize: '2.5rem', color: '#f4f4f5', justifyContent: 'center', textAlign: 'center' }}>
          GLOBAL TOP 100
        </h1>
        <div 
          className="rounded-xl shadow-lg p-8"
          style={{ 
            backgroundColor: '#18181b',
            border: 'transparent',
            boxShadow: '0px 6px 16px rgba(0, 0, 0, 0.5)'
          }}
        >
          <LeaderboardTable />
        </div>
      </div>
    </div>
  );
}