"use client";

import { registerService } from "@/help/api";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Toaster, toast } from "react-hot-toast";

const Register = () => {
  const router = useRouter();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [avatar, setAvatar] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const [avatars] = useState([
    "https://firebasestorage.googleapis.com/v0/b/cloudonly-a85fd.appspot.com/o/boy.webp?alt=media&token=768409fe-ec78-46de-8f6f-a2690df511e5",
    "https://firebasestorage.googleapis.com/v0/b/cloudonly-a85fd.appspot.com/o/man.jpg?alt=media&token=e382d80d-e64e-45a3-9b0b-5cf501445bd5",
    "https://firebasestorage.googleapis.com/v0/b/cloudonly-a85fd.appspot.com/o/girl.jpg?alt=media&token=6bd2b2a1-12a1-4e3a-89dd-fc38996a31fe",
  ]);

  async function register() {
    if (username && password && avatar && email) {
      setLoading(true);
      const response = await registerService(username, password, email, avatar);
      if (response.status === 200) {
        router.push("/login");
      } else {
        toast.error(response.message);
      }

      return setLoading(false);
    }

    toast.error("please select avatar and input all field !")
  }

  return (
    <>
      <Toaster />

      <div className="flex flex-col gap-5 md:w-1/2 lg:w-1/4   absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2">
        <h1 className="text-blue-600 font-bold text-2xl">
          Register to Chatter 💕😍
        </h1>

        <div className="flex justify-center gap-5">
          {avatars.map((singleAvatar: string, index: number) => (
            <Image
              src={singleAvatar}
              key={index}
              alt="select avatar"
              width={50}
              height={50}
              className={`rounded object-cover cursor-pointer hover:border-2 hover:border-blue-600 ${
                singleAvatar === avatar && "border-2 border-blue-600"
              }`}
              onClick={() => setAvatar(singleAvatar)}
            />
          ))}
        </div>

        <input
          type="text"
          placeholder="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={register}
          className="mt-32 bg-blue-600 px-4 py-2 rounded-md text-white active:bg-blue-500"
          disabled={loading}
        >
          {loading ? "Loading ..." : "Register"}
        </button>

        <Link href={"/login"}>
          <button className="mt-32 w-full border border-blue-600 px-4 py-2 rounded-md text-white active:bg-blue-500">
            Go To Login
          </button>
        </Link>
      </div>
    </>
  );
};

export default Register;
