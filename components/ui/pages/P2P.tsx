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
  BalanceTypes,
  balanceAtom,
  incomingTransactionsAtom,
  outgoingTransactionsAtom,
  IncomingTypes,
  OutgoingTypes,
} from "@/app/store/atoms/wallet";
import { SendMoney } from "@/components/ui/SendMoney";
import { P2PList } from "@/components/ui/P2PList";

const cardIcons: LucideIcon[] = [IndianRupee, Download, Upload];
export default function P2P() {
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
  const incomingTR: IncomingTypes[] | null = useRecoilValue(
    incomingTransactionsAtom
  );
  const outgoingTR: OutgoingTypes[] | null = useRecoilValue(
    outgoingTransactionsAtom
  );
  const totaltransfer = String(
    (incomingTR.length || 0) + (outgoingTR.length || 0) || 0
  );

  return (
    <div className="flex flex-col gap-4  w-full">
      <PageTitle title="Dashboard" />
      <section className="grid w-full grid-cols-1 gap-4 transition-all sm:grid-cols-2 ">
        <Card label="Current balance" amount={currAmount} icon={cardIcons[0]} />
        <Card
          label="Transfers till now"
          amount={totaltransfer}
          icon={cardIcons[1]}
        />
      </section>
      <section className="grid grid-cols-1  gap-4 transition-all lg:grid-cols-2">
        <CardContent className="flex justify-start gap-4">
          <section className="mb-5 p-4 font-semibold text-xl">
            <p className="">Send money</p>
          </section>
          <section className="mb-5 p-4 overflow-auto">
            <SendMoney />
          </section>
        </CardContent>
        <CardContent className="flex justify-start gap-4">
          <section className="mb-5 p-4 font-semibold text-xl">
            <p className="">P2P History</p>
          </section>
          <P2PList />
        </CardContent>
      </section>
    </div>
  );
}
