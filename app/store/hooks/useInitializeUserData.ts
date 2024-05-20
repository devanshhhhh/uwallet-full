"use client";
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import {
  firstnameAtom,
  lastnameAtom,
  emailAtom,
  phoneAtom,
  balanceAtom,
  failedTransactionsAtom,
  processingTransactionsAtom,
  successfulTransactionsAtom,
  OnRampTransactionTypes,
  BalanceTypes,
  allOnRampTransactionsAtom,
  IncomingTypes,
  OutgoingTypes,
  incomingTransactionsAtom,
  outgoingTransactionsAtom,
} from "../atoms/wallet";

export interface UserDataTypes {
  id: number;
  email: string | null;
  firstname: string;
  lastname: string;
  number: string;
  password: string;
  OnRampTransaction: OnRampTransactionTypes[];
  Balance: BalanceTypes[];
  Incoming: IncomingTypes[];
  Outgoing: OutgoingTypes[];
}

export const useInitializeUserData = (userData: UserDataTypes | null) => {
  const [firstname, setFirstname] = useRecoilState(firstnameAtom);
  const [lastname, setLastname] = useRecoilState(lastnameAtom);
  const [email, setEmail] = useRecoilState(emailAtom);
  const [phone, setPhone] = useRecoilState(phoneAtom);
  const [balance, setBalance] = useRecoilState(balanceAtom);
  const [failedTransactions, setFailedTransactions] = useRecoilState(
    failedTransactionsAtom
  );
  const [processingTransactions, setProcessingTransactions] = useRecoilState(
    processingTransactionsAtom
  );
  const [successfulTransactions, setSuccessfulTransactions] = useRecoilState(
    successfulTransactionsAtom
  );
  const [allOnRampTransactions, setAllOnRampTransactions] = useRecoilState(
    allOnRampTransactionsAtom
  );
  const [incoming, setIncoming] = useRecoilState(incomingTransactionsAtom);
  const [outgoing, setOutgoing] = useRecoilState(outgoingTransactionsAtom);

  useEffect(() => {
    if (!userData) return;

    setFirstname(userData.firstname);
    setLastname(userData.lastname);
    setEmail(userData.email);
    setPhone(userData.number);
    setBalance(userData.Balance[0] || null);
    setAllOnRampTransactions(userData.OnRampTransaction);
    setIncoming(userData.Incoming);
    setOutgoing(userData.Outgoing);
    const failedTransactionsList = userData.OnRampTransaction.filter(
      (transaction) => transaction.status === "Failure"
    );
    const processingTransactionsList = userData.OnRampTransaction.filter(
      (transaction) => transaction.status === "Processing"
    );
    const successfulTransactionsList = userData.OnRampTransaction.filter(
      (transaction) => transaction.status === "Success"
    );

    setFailedTransactions(failedTransactionsList);
    setProcessingTransactions(processingTransactionsList);
    setSuccessfulTransactions(successfulTransactionsList);
  }, [
    userData,
    setFirstname,
    setLastname,
    setEmail,
    setPhone,
    setBalance,
    setFailedTransactions,
    setProcessingTransactions,
    setSuccessfulTransactions,
  ]);
};
