import Image from "next/image";
import { Edit2, LogOut } from "lucide-react";
import { StatBadge, Stat } from "./StatBadge";

interface ProfileHeaderProps {
  firstName: string;
  email: string;
  avatarUrl: string | null;
  stats: Stat[];
  onSignOut: () => void;
  isSigningOut: boolean;
}

export function ProfileHeader({
  firstName,
  email,
  avatarUrl,
  stats,
  onSignOut,
  isSigningOut,
}: ProfileHeaderProps) {
  return (
    <div className="bg-[#1518215f] border border-white/5 rounded-3xl p-4 md:p-6 relative lg:overflow-hidden shadow-2xl">
      <div className="relative flex flex-col items-center text-center mt-4">
        <div className="relative w-24 h-24 md:w-28 md:h-28 mb-5 group">
          <div className="relative w-full h-full rounded-full overflow-hidden border-[1px] shadow-xl">
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt="Avatar"
                fill
                className="object-cover"
                sizes="112px"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-[#0f1115]">
                <span className="text-3xl font-bold text-gray-600">
                  {(firstName || "U")[0].toUpperCase()}
                </span>
              </div>
            )}
          </div>
          <button className="absolute bottom-0 right-0 p-2 rounded-full bg-[#1a1d29] text-white border border-white/10 shadow-lg hover:bg-white hover:text-black transition-colors">
            <Edit2 size={14} />
          </button>
        </div>

        <h2
          className="text-xl md:text-2xl font-bold text-white mb-1"
          style={{ fontFamily: "Be Vietnam Pro, sans-serif" }}
        >
          {firstName || "User"}
        </h2>
        <p className="text-sm text-gray-400 mb-6 md:mb-8">{email}</p>

        <div className="flex gap-2 md:gap-3 w-full md:mb-8">
          {stats.map((stat) => (
            <StatBadge key={stat.label} stat={stat} />
          ))}
        </div>

        {/* Sign Out Button - Desktop Only (Moved to bottom on mobile) */}
        <button
          onClick={onSignOut}
          disabled={isSigningOut}
          className="hidden md:flex w-full items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-red-600/10 border border-red-600/30 text-red-500 font-bold text-sm hover:bg-red-600 hover:text-white hover:border-red-600 transition-all duration-300"
        >
          {isSigningOut ? (
            <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : (
            <LogOut size={16} />
          )}
          Sign Out
        </button>
      </div>
    </div>
  );
}
