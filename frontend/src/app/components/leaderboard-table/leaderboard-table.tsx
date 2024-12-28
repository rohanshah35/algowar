import { Table, TableData } from '@mantine/core';

const generateLeaderboardData = () => {
  const usernames = [
    'GrandMaster42', 'ChessWhiz99', 'QueenSlayer', 'KnightRider', 'BishopBoss',
    'PawnStars', 'RookieKing', 'CheckMate365', 'TacticalGenius', 'EndGamePro',
    'ChessNinja', 'StrategicMind', 'BoardMaster', 'CasualChamp', 'PuzzlePro',
    'BlitzKing', 'OpeningMaster', 'DefenseGuru', 'AttackMode', 'MidGameQueen',
    'ChessWizard', 'KingHunter', 'PawnCrusher', 'RookMaster', 'BishopElite'
  ];

  const data = usernames.map(username => {
    const wins = Math.floor(Math.random() * (500 - 50) + 50);
    const elo = Math.floor(Math.random() * (2400 - 800) + 800);
    return { username, wins, elo };
  });

  return data
    .sort((a, b) => b.elo - a.elo)
    .map((player, index) => {
      const rank = index + 1;
      return [rank, player.username, player.wins, player.elo];
    });
};

const tableData: TableData = {
  head: ['RANK', 'USERNAME', 'WINS', 'ELO'],
  body: generateLeaderboardData(),
};

export function LeaderboardTable() {
  return (
    <Table
      data={tableData}
      styles={{
        table: {
          color: '#d4d4d8',
        },
        thead: {
          backgroundColor: '#3f3f46',
        },
        th: {
          color: '#d4d4d8 !important',
          fontSize: '0.9rem',
          fontWeight: 600,
          padding: '1rem',
        },
        td: {
          color: '#d4d4d8',
          padding: '0.75rem 1rem',
          fontSize: '0.95rem',
        },
      }}
    />
  );
}