// Mock leaderboard data for contests
type ProblemResult = {
  problemId: string;
  order: number;
  points: number;
  attempts: number;
  solvedAt: string | null;
  status: 'solved' | 'attempted' | 'not_attempted';
};

type LeaderboardEntry = {
  rank: number;
  id: string;
  userName: string | null;
  userEmail: string;
  userAvatar?: string;
  totalPoints: number;
  solvedProblems: number;
  problemResults: ProblemResult[];
};

// Generate mock leaderboard based on contest problems
export const generateMockLeaderboard = (
  contestProblems: { id: string; order: number; points: number }[]
): LeaderboardEntry[] => {
  const mockUsers = [
    { id: 'user1', name: 'TrungKien', email: 'trungkien@example.com' },
    { id: 'user2', name: 'NgocAnh', email: 'ngocanh@example.com' },
    { id: 'user3', name: 'MinhTuan', email: 'minhtuan@example.com' },
    { id: 'user4', name: 'ThanhHa', email: 'thanhha@example.com' },
    { id: 'user5', name: 'QuangDuc', email: 'quangduc@example.com' },
    { id: 'user6', name: null, email: 'anonymous1@example.com' },
    { id: 'user7', name: 'HongNhung', email: 'hongnhung@example.com' },
    { id: 'user8', name: 'VietHoang', email: 'viethoang@example.com' },
    { id: 'user9', name: null, email: 'coder2025@example.com' },
    { id: 'user10', name: 'LanAnh', email: 'lananh@example.com' },
  ];

  // Generate problem results for each user with varying success rates
  const generateResults = (
    userId: string,
    successRate: number
  ): ProblemResult[] => {
    return contestProblems.map((problem) => {
      const random = Math.random();
      let status: 'solved' | 'attempted' | 'not_attempted';
      let attempts = 0;
      let solvedAt: string | null = null;

      if (random < successRate) {
        status = 'solved';
        attempts = Math.floor(Math.random() * 3) + 1;
        solvedAt = new Date(
          Date.now() - Math.floor(Math.random() * 3600000)
        ).toISOString();
      } else if (random < successRate + 0.2) {
        status = 'attempted';
        attempts = Math.floor(Math.random() * 5) + 1;
      } else {
        status = 'not_attempted';
      }

      return {
        problemId: problem.id,
        order: problem.order,
        points: status === 'solved' ? problem.points : 0,
        attempts,
        solvedAt,
        status,
      };
    });
  };

  // Different success rates for different users to create variety
  const successRates = [0.9, 0.85, 0.8, 0.7, 0.6, 0.5, 0.4, 0.35, 0.3, 0.25];

  const entries: LeaderboardEntry[] = mockUsers.map((user, index) => {
    const results = generateResults(user.id, successRates[index]);
    const solvedProblems = results.filter((r) => r.status === 'solved').length;
    const totalPoints = results.reduce((sum, r) => sum + r.points, 0);

    return {
      rank: 0, // Will be set after sorting
      id: user.id,
      userName: user.name,
      userEmail: user.email,
      totalPoints,
      solvedProblems,
      problemResults: results,
    };
  });

  // Sort by totalPoints (descending), then by solvedProblems (descending)
  entries.sort((a, b) => {
    if (b.totalPoints !== a.totalPoints) {
      return b.totalPoints - a.totalPoints;
    }
    return b.solvedProblems - a.solvedProblems;
  });

  // Assign ranks
  entries.forEach((entry, index) => {
    entry.rank = index + 1;
  });

  return entries;
};

// Static mock data for testing (used when no contest problems available)
export const MOCK_LEADERBOARD_DATA: LeaderboardEntry[] = [
  {
    rank: 1,
    id: 'user1',
    userName: 'TrungKien',
    userEmail: 'trungkien@example.com',
    totalPoints: 500,
    solvedProblems: 5,
    problemResults: [],
  },
  {
    rank: 2,
    id: 'user2',
    userName: 'NgocAnh',
    userEmail: 'ngocanh@example.com',
    totalPoints: 400,
    solvedProblems: 4,
    problemResults: [],
  },
  {
    rank: 3,
    id: 'user3',
    userName: 'MinhTuan',
    userEmail: 'minhtuan@example.com',
    totalPoints: 350,
    solvedProblems: 4,
    problemResults: [],
  },
];
