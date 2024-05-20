import { atom, selector } from "recoil";

export interface OnRampTransactionTypes {
  id: number;
  status: "Success" | "Failure" | "Processing";
  token: string;
  provider: string;
  amount: number;
  startTime: string;
  userId: number;
}
export interface User {
  id: number;
  email?: string;
  firstname?: string;
  lastname?: string;
  number: string;
  password: string;
}

export interface BalanceTypes {
  id: number;
  userId: number;
  amount: number;
  locked: number;
}
export interface OutgoingTypes {
  id: number;
  status: StatusTypes;
  token: string;
  startTime: Date;
  userId: number;
  to: string;
  user: User;
  amount: number;
}

export interface IncomingTypes {
  id: number;
  status: StatusTypes;
  token: string;
  startTime: Date;
  userId: number;
  from: string;
  user: User;
  amount: number;
}

export enum StatusTypes {
  Success = "Success",
  Failure = "Failure",
  Processing = "Processing",
}

export const outgoingTransactionsAtom = atom<OutgoingTypes[]>({
  key: "outgoingTransactionsAtom",
  default: [],
});

export const incomingTransactionsAtom = atom<IncomingTypes[]>({
  key: "incomingTransactionsAtom",
  default: [],
});
export const firstnameAtom = atom<string | null>({
  key: "firstnameAtom",
  default: "",
});

export const lastnameAtom = atom<string | null>({
  key: "lastnameAtom",
  default: "",
});

export const emailAtom = atom<string | null>({
  key: "emailAtom",
  default: null,
});

export const phoneAtom = atom<string>({
  key: "phoneAtom",
  default: "",
});

export const balanceAtom = atom<BalanceTypes | null>({
  key: "balanceAtom",
  default: null,
});
export const allOnRampTransactionsAtom = atom<OnRampTransactionTypes[]>({
  key: "allOnRampTransactionsAtom",
  default: [],
});
export const failedTransactionsAtom = atom<OnRampTransactionTypes[]>({
  key: "failedTransactionsAtom",
  default: [],
});

export const processingTransactionsAtom = atom<OnRampTransactionTypes[]>({
  key: "processingTransactionsAtom",
  default: [],
});

export const successfulTransactionsAtom = atom<OnRampTransactionTypes[]>({
  key: "successfulTransactionsAtom",
  default: [],
});

export const totalSuccessfulTransactionsCurrentMonthSelector = selector<number>(
  {
    key: "totalSuccessfulTransactionsCurrentMonthSelector",
    get: ({ get }) => {
      const successfulTransactions = get(successfulTransactionsAtom);

      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1;
      const currentYear = currentDate.getFullYear();

      const transactionsCurrentMonth = successfulTransactions.filter(
        (transaction) => {
          const transactionDate = new Date(transaction.startTime);
          return (
            transactionDate.getMonth() + 1 === currentMonth &&
            transactionDate.getFullYear() === currentYear
          );
        }
      );

      const totalAmount = transactionsCurrentMonth.reduce(
        (total, transaction) => total + transaction.amount,
        0
      );

      return totalAmount;
    },
  }
);
export const totalProcessingTransactionsAmountSelector = selector<number>({
  key: "totalProcessingTransactionsAmountSelector",
  get: ({ get }) => {
    const processingTransactions = get(processingTransactionsAtom);

    const totalAmount = processingTransactions.reduce(
      (total, transaction) => total + transaction.amount,
      0
    );

    return totalAmount;
  },
});
