"use client";
import Card, { CardContent } from "@/components/ui/MyCard";
import PageTitle from "@/components/ui/PageTitle";
import { useRecoilValue } from "recoil";
import {
  OnRampTransactionTypes,
  allOnRampTransactionsAtom,
} from "@/app/store/atoms/wallet";
import { DataTable } from "@/components/ui/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { P2PList } from "@/components/ui/P2PList";
import { getUserDetails } from "@/app/lib/actions/getUserDetails";
import {
  useInitializeUserData,
  UserDataTypes,
} from "@/app/store/hooks/useInitializeUserData";
import { useState, useEffect } from "react";

type Payment = {
  amount: String;
  startdate: string;
  starttime: string;
  method: string;
  id: string;
  status?: "Success" | "Failure" | "Processing";
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
  {
    accessorKey: "status",
    header: "Status",
  },
];

export default function Transactions() {
  const [userData, setUserData] = useState<UserDataTypes | null>(null);
  useEffect(() => {
    async function fire() {
      const details: any = await getUserDetails();
      setUserData(details);
    }
    fire();
  }, []);

  useInitializeUserData(userData);

  const OnRampTransaction: OnRampTransactionTypes[] = useRecoilValue(
    allOnRampTransactionsAtom
  );

  const data: Payment[] = OnRampTransaction.map((transaction) => {
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
      status: transaction.status,
    };
  });
  data.sort(
    (a, b) =>
      new Date(b.startdate + " " + b.starttime).getTime() -
      new Date(a.startdate + " " + a.starttime).getTime()
  );
  return (
    <div className="flex flex-col gap-5  w-full">
      <PageTitle title="Transaction history" />
      <section className="grid grid-cols-1  gap-4 transition-all lg:grid-cols-2">
        <CardContent className="flex justify-start gap-4">
          <section className="mb-20 p-4 font-semibold text-xl">
            <p className="">Wallet transfers</p>
          </section>
          <section className="mb-5 p-4 overflow-auto">
            <DataTable columns={columns} data={data} />
          </section>
        </CardContent>
        <CardContent className="flex justify-start gap-4">
          <section className="mb-5 p-4 font-semibold text-xl">
            <p className="">P2P transfers</p>
          </section>
          <section className="mb-5 p-4 overflow-auto">
            <P2PList />
          </section>
        </CardContent>
      </section>
    </div>
  );
}
