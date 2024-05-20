"use client";
import { ProfileHead } from "./ProfileHead";
import { DemoHead } from "./DemoHead";
import { Input } from "./input";
import { Label } from "@radix-ui/react-label";
import { Button } from "./button";
import { useState } from "react";
import { findUserByPhone } from "@/app/lib/actions/search";
import { transferAmount } from "@/app/lib/actions/p2pTransfer";
import { toast } from "react-hot-toast";

interface searchTypes {
  name: string | null;
  email: string | null;
  number: string;
}
export function SendMoney() {
  const [searchTerm, setSearchTerm] = useState("");
  const [amount, setAmount] = useState(0);
  const [searchResult, setSearchResult] = useState<searchTypes | null>();

  return (
    <div>
      <section className="mb-4">
        <Label className="font-semibold xl:text-lg">Search by phone</Label>
        <div className="flex flex-row mt-2">
          <Input
            type="text"
            placeholder="+91 XXXX-XXX-XXX"
            className="mr-2"
            onChange={(e) => {
              setSearchTerm(e.target.value);
            }}
          ></Input>
          <Button
            onClick={async () => {
              const res: searchTypes | null = await findUserByPhone(searchTerm);
              setSearchResult(res);
              if (res) {
                toast.success("Found the user");
              } else {
                toast.error("Recheck the phone number");
              }
            }}
          >
            Search
          </Button>
        </div>
      </section>
      {searchResult ? (
        <ProfileHead name={searchResult.name} email={searchResult.email} />
      ) : (
        <DemoHead />
      )}
      <section className="flex flex-row mt-8 ml-1">
        <section>
          <Label className="font-semibold xl:text-lg">Amount</Label>
          <div className="flex flex-row mt-2">
            <Input
              type="text"
              placeholder="₹"
              className="mr-2"
              onChange={(e) => {
                setAmount(Number(e.target.value));
              }}
            ></Input>
            <Button
              disabled={!(searchResult && searchResult.name)}
              onClick={async () => {
                const res = await transferAmount(
                  searchResult?.number,
                  amount * 100
                );
                if (res) {
                  toast.success("Transfer successful, refresh for new entries");
                } else {
                  toast.error("Transaction failed, rolling back balance");
                }
              }}
            >
              Transfer
            </Button>
          </div>
        </section>
      </section>
    </div>
  );
}
