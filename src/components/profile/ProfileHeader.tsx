import Image from "next/image";
import { Edit2, LogOut } from "lucide-react";
import { StatBadge, Stat } from "./StatBadge";

interface ProfileHeaderProps {
  fullName: string;
  email: string;
  avatarUrl: string | null;
}

export function ProfileHeader({
  fullName,
  email,
  avatarUrl,
}: ProfileHeaderProps) {
  return (
    <div className="apple-glass rounded-[2rem] p-4 md:p-6 pt-24 md:pt-28 relative shadow-2xl mt-20 md:mt-24">
      {/* Floating Avatar */}
      <div className="absolute -top-16 md:-top-20 left-1/2 -translate-x-1/2 w-32 h-32 md:w-40 md:h-40 group z-20">
        <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-white/25">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt="Avatar"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 128px, 160px"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-4xl md:text-5xl font-bold text-gray-600">
                {(fullName || "U")[0].toUpperCase()}
              </span>
            </div>
          )}
        </div>
        <button className="absolute bottom-2 right-2 p-2.5 rounded-full bg-[#1a1d29] text-white border border-white/10 shadow-lg hover:bg-white hover:text-black transition-colors">
          <Edit2 size={16} />
        </button>
      </div>

      <div className="relative flex flex-col items-center text-center">
        <h2
          className="text-xl md:text-2xl font-bold text-white mb-1"
          style={{ fontFamily: "Be Vietnam Pro, sans-serif" }}
        >
          {fullName || "User"}
        </h2>
        <p className="text-sm text-gray-400 mb-6 md:mb-8">{email}</p>
      </div>
    </div>
  );
}
