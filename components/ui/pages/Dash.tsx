"use client";
import { IndianRupee, LucideIcon, Upload, Download } from "lucide-react";
import Card, { CardContent, CardProps } from "@/components/ui/MyCard";
import PageTitle from "@/components/ui/PageTitle";
import { getUserDetails } from "@/app/lib/actions/getUserDetails";
import { useEffect, useState } from "react";
import {
  useInitializeUserData,
  UserDataTypes,
} from "@/app/store/hooks/useInitializeUserData";
import { useRecoilValue } from "recoil";
import {
  OnRampTransactionTypes,
  BalanceTypes,
  balanceAtom,
  firstnameAtom,
  emailAtom,
  totalSuccessfulTransactionsCurrentMonthSelector,
  successfulTransactionsAtom,
  lastnameAtom,
} from "@/app/store/atoms/wallet";
import { EditProfile } from "@/components/ui/EditProfile";
import { Button } from "@/components/ui/button";
import { ViewProfile } from "@/components/ui/ViewProfile";
import { DataTable } from "@/components/ui/DataTable";
import { ColumnDef } from "@tanstack/react-table";

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

export default function DashPage() {
  const [userData, setUserData] = useState<UserDataTypes | null>(null);
  const [edit, setEdit] = useState(false);
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
  const successfulTransaction: OnRampTransactionTypes[] = useRecoilValue(
    successfulTransactionsAtom
  );
  const success = (String(successfulTransaction.length) || "0") + " times";
  let thisMonth =
    String(
      useRecoilValue(totalSuccessfulTransactionsCurrentMonthSelector) / 100
    ) || "0";
  thisMonth = "₹" + thisMonth;
  const firstname = useRecoilValue(firstnameAtom) || "Firstname";
  const lastname = useRecoilValue(lastnameAtom) || "Lastname";
  const email = useRecoilValue(emailAtom) || "noemail@email.com";
  const data: Payment[] = successfulTransaction.map((transaction) => {
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
  return (
    <div className="flex flex-col gap-5  w-full">
      <PageTitle title="Dashboard" />
      <section className="grid w-full grid-cols-1 gap-4 transition-all sm:grid-cols-2 xl:grid-cols-3">
        <Card label="Current balance" amount={currAmount} icon={cardIcons[0]} />
        <Card
          label="Wallet montly traffic"
          amount={thisMonth}
          icon={cardIcons[1]}
        />
        <Card label="Added this month" amount={success} icon={cardIcons[2]} />
      </section>
      <section className="grid grid-cols-1  gap-4 transition-all lg:grid-cols-2">
        <CardContent>
          <section className="mb-5 p-4 font-semibold text-xl">
            <p className="p-4 font-semibold text-xl">My account</p>
          </section>
          <section className=" flex-col px-4 items-center">
            {edit ? (
              <EditProfile
                firstname={firstname}
                lastname={lastname}
                email={email}
              />
            ) : (
              <ViewProfile
                firstname={firstname}
                lastname={lastname}
                email={email}
              />
            )}
            <Button
              className={"lg:36 lg:h-10 xl:w-44 xl:h-12 self-center mt-8"}
              onClick={() => {
                setEdit(!edit);
              }}
            >
              {edit ? "Cancel" : "Edit Profile"}
            </Button>
          </section>
        </CardContent>
        <CardContent className="flex justify-start gap-4">
          <section className="mb-5 p-4 font-semibold text-xl">
            <p className="">Added to your wallet</p>
          </section>
          <section className="mb-5 p-4 overflow-auto">
            <DataTable columns={columns} data={data} />
          </section>
        </CardContent>
      </section>
    </div>
  );
}
