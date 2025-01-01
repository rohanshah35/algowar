import { LeaderboardTable } from "@/components/Leaderboard/leaderboard-table/leaderboard-table";

export default async function Leaderboard() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-[#d4d4d8] text-center">
          GLOBAL TOP 100
        </h1>
        <div 
          className="rounded-xl shadow-lg p-8"
          style={{ 
            backgroundColor: '#27272a',
            border: '1px solid #3f3f46',
            boxShadow: '0px 6px 16px rgba(0, 0, 0, 0.5)'
          }}
        >
          <LeaderboardTable />
        </div>
      </div>
    </div>
  );
}