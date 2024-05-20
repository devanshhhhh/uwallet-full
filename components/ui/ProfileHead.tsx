import { Avatar, AvatarFallback, AvatarImage } from "./avatar";

interface inputProp {
  name: String | null;
  email: String | null;
}
export function ProfileHead({ name, email }: inputProp) {
  return (
    <div className="flex items-start p-4 border shadow-sm rounded-xl">
      <div className="flex items-start gap-4 text-sm">
        <Avatar>
          <AvatarImage alt={(name && name[0])?.toUpperCase() || "U"} />
          <AvatarFallback>
            {(name && name[0])?.toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>
        <div className="grid gap-1">
          <div className="font-semibold">{name || "No name"}</div>
          <div className="line-clamp-1 text-xs">
            <span className="font-medium">Email:</span>{" "}
            {email || "noemail@email.com"}
          </div>
        </div>
      </div>
    </div>
  );
}
