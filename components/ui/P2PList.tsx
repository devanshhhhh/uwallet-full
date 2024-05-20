import { DataTable } from "@/components/ui/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import {
  incomingTransactionsAtom,
  outgoingTransactionsAtom,
  IncomingTypes,
  OutgoingTypes,
} from "@/app/store/atoms/wallet";
import { useRecoilValue } from "recoil";
import { useState } from "react";
import { Button } from "./button";

type PaymentOutgoing = {
  amount: string;
  startdate: string;
  starttime: string;
  to: string;
  id: string;
};
type PaymentIncoming = {
  amount: string;
  startdate: string;
  starttime: string;
  from: string;
  id: string;
};

const columnsOutgoing: ColumnDef<PaymentOutgoing>[] = [
  {
    accessorKey: "to",
    header: "To",
  },
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
];
const columnsIncoming: ColumnDef<PaymentIncoming>[] = [
  {
    accessorKey: "from",
    header: "From",
  },
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
];

export function P2PList() {
  const [condition, setCondition] = useState(true);
  const incomingTR: IncomingTypes[] | null = useRecoilValue(
    incomingTransactionsAtom
  );
  const outgoingTR: OutgoingTypes[] | null = useRecoilValue(
    outgoingTransactionsAtom
  );
  const dataOutgoing: PaymentOutgoing[] = outgoingTR.map((transaction) => {
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
      to: transaction.to,
      id: transaction.token,
      status: transaction.status,
    };
  });
  dataOutgoing.sort(
    (a, b) =>
      new Date(b.startdate + " " + b.starttime).getTime() -
      new Date(a.startdate + " " + a.starttime).getTime()
  );

  const dataIncoming: PaymentIncoming[] = incomingTR.map((transaction) => {
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
      from: transaction.from,
      id: transaction.token,
      status: transaction.status,
    };
  });
  dataIncoming.sort(
    (a, b) =>
      new Date(b.startdate + " " + b.starttime).getTime() -
      new Date(a.startdate + " " + a.starttime).getTime()
  );
  return (
    <>
      <section className="pl-4">
        <Button
          className="w-40 "
          variant={condition ? "secondary" : "default"}
          onClick={() => setCondition(!condition)}
        >
          {condition ? "Incoming" : "Outgoing"}
        </Button>
      </section>
      <section className="mb-5 p-4 overflow-auto">
        {condition ? (
          <DataTable columns={columnsIncoming} data={dataIncoming} />
        ) : (
          <DataTable columns={columnsOutgoing} data={dataOutgoing} />
        )}
      </section>
    </>
  );
}
