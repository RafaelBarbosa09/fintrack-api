export type TransactionDatabase = {
  id: string;
  title: string;
  amount: number;
  type: string;
  category: string;
  createdAt: Date;
  updatedAt: Date | null;
};
