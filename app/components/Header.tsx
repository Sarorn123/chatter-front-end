import Image from "next/image";
import React, { Dispatch, SetStateAction } from "react";

type Props = {
  avatar: string;
  username: string;
  isOnline: boolean;
  setOpensidebar: Dispatch<SetStateAction<boolean>>;
};

const Header = ({ avatar, username, isOnline, setOpensidebar }: Props) => {
  return (
    <div className="flex justify-between items-center">
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
          className={`w-2 h-2 rounded-full ${
            isOnline ? "bg-green-600" : "bg-red-600"
          }`}
        ></div>
      </div>

      <p
        className="text-2xl w-10 h-10 flex justify-center items-center rounded-full bg-gray-500 "
        onClick={() => {
          setOpensidebar((pre) => !pre);
        }}
      >
        🤞
      </p>
    </div>
  );
};

export default Header;
