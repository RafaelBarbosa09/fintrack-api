export type TransactionDatabase = {
  id: string;
  title: string;
  amount: number;
  type: string;
  categoryId: string | null;
  createdAt: Date;
  updatedAt: Date | null;
};
