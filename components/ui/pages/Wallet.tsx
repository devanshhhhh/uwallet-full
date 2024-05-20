"use client";
import { IndianRupee, LucideIcon, Upload, Download } from "lucide-react";
import Card, { CardContent } from "@/components/ui/MyCard";
import PageTitle from "@/components/ui/PageTitle";
import { useRecoilValue } from "recoil";
import {
  OnRampTransactionTypes,
  BalanceTypes,
  balanceAtom,
  totalProcessingTransactionsAmountSelector,
  processingTransactionsAtom,
} from "@/app/store/atoms/wallet";
import { PaymentMethod } from "@/components/ui/payment-method";
import { DataTable } from "@/components/ui/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { useState, useEffect } from "react";
import { getUserDetails } from "@/app/lib/actions/getUserDetails";
import {
  useInitializeUserData,
  UserDataTypes,
} from "@/app/store/hooks/useInitializeUserData";

const cardIcons: LucideIcon[] = [IndianRupee, Download, Upload];

type Payment = {
  amount: String;
  startdate: string;
  starttime: string;
  method: string;
  id: string;
};

const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "amount",
    header: "Amount",
  },
  {
    accessorKey: "id",
    header: "Transaction ID",
  },
  {
    accessorKey: "startdate",
    header: "Date",
  },
  {
    accessorKey: "starttime",
    header: "Time",
  },
  {
    accessorKey: "method",
    header: "Method",
  },
];

export default function Wallet() {
  const [userData, setUserData] = useState<UserDataTypes | null>(null);

  useEffect(() => {
    async function fire() {
      const details: any = await getUserDetails();
      setUserData(details);
    }
    fire();
  }, []);

  useInitializeUserData(userData);
  let currAmount: string = "0";
  const currBalance: BalanceTypes | null = useRecoilValue(balanceAtom);
  if (currBalance) {
    const currAmountNum = currBalance.amount / 100;
    currAmount = String(currAmountNum);
    currAmount = "₹" + currAmount;
  }
  const processingTransactions: OnRampTransactionTypes[] = useRecoilValue(
    processingTransactionsAtom
  );
  const data: Payment[] = processingTransactions.map((transaction) => {
    const dateObj = new Date(transaction.startTime);

    const startdate = dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });

    const starttime = dateObj.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    return {
      amount: "₹ " + (transaction.amount / 100).toString(),
      startdate,
      starttime,
      method: transaction.provider,
      id: transaction.token,
    };
  });
  data.sort(
    (a, b) =>
      new Date(b.startdate + " " + b.starttime).getTime() -
      new Date(a.startdate + " " + a.starttime).getTime()
  );
  const success = String(processingTransactions.length) || "0";
  let thisMonth =
    String(useRecoilValue(totalProcessingTransactionsAmountSelector) / 100) ||
    "0";
  thisMonth = "₹" + thisMonth;
  return (
    <div className="flex flex-col gap-5  w-full">
      <PageTitle title="Wallet" />
      <section className="grid w-full grid-cols-1 gap-4 transition-all sm:grid-cols-2 xl:grid-cols-3">
        <Card label="Current balance" amount={currAmount} icon={cardIcons[0]} />
        <Card
          label="Balance under proscessing"
          amount={thisMonth}
          icon={cardIcons[1]}
        />
        <Card
          label="Ongoing transactions"
          amount={success}
          icon={cardIcons[2]}
        />
      </section>
      <section className="grid grid-cols-1 gap-4 transition-all md:grid-cols-2">
        <CardContent>
          <p className="p-4 font-semibold text-xl">Add money</p>
          <PaymentMethod />
        </CardContent>
        <CardContent className="flex justify-start gap-4">
          <section className="p-4 font-semibold text-xl">
            <p className=""> Processing</p>
          </section>
          <section className="px-4 overflow-auto">
            <DataTable columns={columns} data={data} />
          </section>
        </CardContent>
      </section>
    </div>
  );
}
