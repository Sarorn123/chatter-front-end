import Image from "next/image";
import React from "react";

type Props = {
  avatar: string;
  username: string;
  isOnline: boolean;
};

const Header = ({ avatar, username, isOnline }: Props) => {
  return (
    <div className="flex items-center gap-2 py-5">
      <Image
        src={avatar}
        className="w-10 h-10 object-cover rounded-full"
        width={50}
        height={50}
        alt={username}
      />
      <p className="font-semibold text-xl">{username}</p>
      <div
        className={`w-3 h-3 rounded-full ${
          isOnline ? "bg-green-600" : "bg-red-600"
        }`}
      ></div>
    </div>
  );
};

export default Header;
