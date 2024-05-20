import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
export function DemoHead() {
  return (
    <div className="flex items-start p-4 border shadow-sm rounded-xl">
      <div className="flex items-start gap-4 text-sm">
        <Avatar className="">
          <AvatarImage alt=" " />
          <AvatarFallback></AvatarFallback>
        </Avatar>
        <div className="grid gap-1">
          <div className="font-semibold">Your friend</div>
          <div className="line-clamp-1 text-xs">
            <span className="font-medium">Enter phone number to search</span>
          </div>
        </div>
      </div>
    </div>
  );
}
