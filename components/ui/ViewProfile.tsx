import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface EditProfileProps {
  firstname: string;
  lastname: string;
  email: string;
}

export function ViewProfile({ firstname, lastname, email }: EditProfileProps) {
  return (
    <div className="flex flex-row justify-evenly mt-8 border rounded-xl shadow">
      <Avatar className="h-48 w-48 m hidden xl:flex self-center">
        <AvatarImage src="https://avatar.iran.liara.run/public/17" />
        <AvatarFallback>U</AvatarFallback>
      </Avatar>

      <div className="grid max-w-sm items-center mx-6 mb-8">
        <h1 className="mt-8 font-semibold text-lg underline">First name</h1>
        <p className="w-40 md:w-48 lg:w-64 xl:w-80 text-lg">{firstname}</p>
        <h1 className="mt-8 font-semibold text-lg underline">Last name</h1>
        <p className="w-40 md:w-48 lg:w-64 xl:w-80 text-lg">{lastname}</p>
        <h1 className="mt-8 font-semibold text-lg underline">Email</h1>
        <p className="w-40 md:w-48 lg:w-64 xl:w-80 text-lg">{email}</p>
      </div>
    </div>
  );
}
