import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import { Button } from "./button";
import { updateUserDetails } from "@/app/lib/actions/updateProfile";

interface EditProfileProps {
  firstname: string;
  lastname: string;
  email: string;
}

export function EditProfile({ firstname, lastname, email }: EditProfileProps) {
  const [fname, setFname] = useState(firstname);
  const [lname, setLname] = useState(lastname);
  const [emailNew, setEmailNew] = useState(email);
  return (
    <div className="flex flex-row justify-evenly mt-8  border rounded-xl shadow">
      <Avatar className="h-48 w-48 m hidden xl:flex self-center">
        <AvatarImage src="https://avatar.iran.liara.run/public/17" />
        <AvatarFallback>U</AvatarFallback>
      </Avatar>

      <div className="grid max-w-sm items-center mx-6 mb-4">
        <Label htmlFor="text" className="mt-4 font-semibold text-lg">
          First name
        </Label>
        <Input
          defaultValue={fname}
          type="text"
          id="firstname"
          placeholder="First name"
          className="w-40 md:w-48 lg:w-64 xl:w-80"
          onChange={(e) => {
            setFname(e.target.value);
          }}
        />
        <Label htmlFor="lastname" className="mt-2 font-semibold text-lg">
          Last name
        </Label>
        <Input
          defaultValue={lname}
          type="lastname"
          id="lastname"
          placeholder="Last name"
          className="w-40 md:w-48 lg:w-64 xl:w-80"
          onChange={(e) => {
            setLname(e.target.value);
          }}
        />
        <Label htmlFor="email" className="font-semibold text-lg">
          Email
        </Label>
        <Input
          defaultValue={emailNew}
          type="email"
          id="email"
          placeholder="Email"
          className="w-40 md:w-48 lg:w-64 xl:w-80"
          onChange={(e) => {
            setEmailNew(e.target.value);
          }}
        />
        <Button
          className="w-12 text-xs bg-green-500 mt-5 hover:bg-slate-100 hover:text-green-500"
          onClick={async () => {
            const res = await updateUserDetails(
              fname || firstname,
              lname || lastname,
              emailNew || email
            );
            if (res) {
              window.location.reload();
            }
          }}
        >
          Save
        </Button>
      </div>
    </div>
  );
}
