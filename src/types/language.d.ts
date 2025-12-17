export type Language = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  _count: {
    submissions: number;
    solutions: number;
  };
};

