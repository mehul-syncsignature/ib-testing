import {
  DropdownMenu,
  // DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import {
  LogOut,
  UserRound,
  PanelsTopLeft,
  BanknoteArrowUp,
  Settings,
  Heart,
  ChevronRight,
} from "lucide-react";

const UserMenuPopup = ({
  displayName,
  email,
  planLabel,
  onSignOut,
  router,
}: // hasProPlan,
{
  displayName: string;
  email: string;
  planLabel: string;
  onSignOut: () => void;
  router: ReturnType<typeof useRouter>;
  hasProPlan: boolean;
}) => (
  <DropdownMenu>
    {/* <DropdownMenuTrigger asChild> */}
    {/* <button className="relative w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium hover:opacity-90 transition-opacity">
        {displayName
          .split(" ")
          .map((n) => n[0])
          .join("")
          .substring(0, 2)
          .toUpperCase()} */}
    {/* {hasProPlan && (
          <span className="absolute -top-1 -right-1 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full p-1">
            <Crown className="w-3 h-3 text-white" />
          </span>
        )} */}
    {/* </button> */}
    <div className="relative w-[37px] h-[36px] bg-[#22808D] rounded-[8.2px]">
      {/* Ellipse 21530 (background face) */}
      <div className="absolute left-[9.9px] top-[6.3px] w-[17.1px] h-[17.1px] rounded-full bg-[#70D0DD]" />
      {/* Ellipse 21521 */}
      <div className="absolute left-[11.7px] top-[2.7px] w-[8.1px] h-[8.1px] rounded-full bg-[#021B1F]" />
      {/* Ellipse 21522 */}
      <div className="absolute left-[17.1px] top-[3.6px] w-[4.5px] h-[6.3px] rounded-full bg-[#021B1F]" />
      {/* Ellipse 21523 */}
      <div className="absolute left-[19.8px] top-[5.4px] w-[6.3px] h-[6.3px] rounded-full bg-[#021B1F]" />
      {/* Ellipse 21524 */}
      <div className="absolute left-[9.9px] top-[5.4px] w-[6.3px] h-[6.3px] rounded-full bg-[#021B1F]" />
      {/* Vector 3445 (line) */}
      <div className="absolute left-[15.3px] top-[18px] w-[6.3px] h-[1.51px] border-t-[0.9px] border-[#C9F8FF]" />
      {/* Rectangle 921853 */}
      <div className="absolute left-[5.4px] top-[23.4px] w-[26.1px] h-[13.7px] bg-[#FEB101] rounded-full" />
      {/* Rectangle 921851 */}
      <div className="absolute left-[15.3px] top-[21.6px] w-[6.3px] h-[7.2px] bg-[#70D0DD]" />
    </div>
    {/* </DropdownMenuTrigger> */}
    <DropdownMenuContent className="w-72 p-0 ml-4 mb-4">
      {/* Header */}
      <div className="flex flex-col items-center justify-center bg-[#F1F3F3] border-b border-[#E1E3E3] py-3 rounded-t-md">
        <div className="relative w-[37px] h-[36px] rounded-[7.2px] bg-[#22808D]">
          {/* Avatar vector shapes go here */}
        </div>
        <div className="flex flex-col items-center gap-1 mt-2 w-40">
          <span className="font-semibold text-xs text-[#333] block w-full text-center">
            {displayName}
          </span>
          <span className="font-normal text-xs text-[#666] block w-full text-center">
            {email}
          </span>
        </div>
      </div>
      <div className="py-2">
        <DropdownMenuItem
          onClick={() => router.push("/appearance")}
          className="pt-2 pr-3 pb-2 pl-3"
        >
          <span className="flex items-center gap-2 w-full justify-between">
            <span className="flex items-center gap-2">
              <PanelsTopLeft className="w-4 h-4" />
              Appearance
              <span className="ml-2 text-[10px] text-[#999]">(Light)</span>
            </span>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => router.push("/profile")}
          className="pt-2 pr-3 pb-2 pl-3"
        >
          <span className="flex items-center gap-2 w-full justify-between">
            <span className="flex items-center gap-2">
              <UserRound className="w-4 h-4" />
              Manage Profile
            </span>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => router.push("/billing")}
          className="pt-2 pr-3 pb-2 pl-3"
        >
          <span className="flex items-center gap-2 w-full justify-between">
            <span className="flex items-center gap-2">
              <BanknoteArrowUp className="w-4 h-4" />
              Billing Details
              <span className="ml-2 text-[10px] text-[#999]">{planLabel}</span>
            </span>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => router.push("/preference")}
          className="pt-2 pr-3 pb-2 pl-3"
        >
          <span className="flex items-center gap-2 w-full justify-between">
            <span className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Preference
            </span>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => router.push("/whats-new")}
          className="pt-2 pr-3 pb-2 pl-3"
        >
          <span className="flex items-center gap-2 w-full justify-between">
            <span className="flex items-center gap-2">
              <Heart className="w-4 h-4" fill="currentColor" />
              What&apos;s New
            </span>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </span>
        </DropdownMenuItem>
      </div>
      <DropdownMenuSeparator />
      <DropdownMenuItem onClick={onSignOut} className="pt-2 pb-3 pl-3 pr-3">
        <LogOut className="w-4 h-4 mr-2" />
        Logout
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

export default UserMenuPopup;
