"use client";

import Image from "next/image";
import { Inter } from "next/font/google";
import { KeyboardEvent, useEffect, useRef, useState } from "react";
import { checkAuth, getCurrentUser } from "@/help/auth";
import { useRouter } from "next/navigation";
import { io } from "socket.io-client";
import Header from "./components/Header";
import {
  addMessageService,
  getMessageService,
  getUsersService,
} from "@/help/api";
import moment from "moment";
import EmojiPicker from "emoji-picker-react";
import ScrollToBottom from "react-scroll-to-bottom";
import hi from "../images/hi.png";
import PleaseWait from "./components/PleaseWait";

const inter = Inter({ subsets: ["latin"] });

interface IUser {
  _id: string;
  username: string;
  avatar: string;
}

interface IMessage {
  fromSelf: boolean;
  message: string;
  createdAt: string;
  image: string;
  to?: string;
}

interface IOnlineUSer {
  userId: string;
  socketId: string;
}

export default function Home() {
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);
  const [openSidebar, setOpenSidebar] = useState<boolean>(true);

  const socket = useRef<any>();
  const router = useRouter();
  const [onlineUsers, setOnlineUser] = useState<string[]>([]);
  const [currentUser, setCurrentUser] = useState<IUser>();
  const [currentChatUser, setCurrentChatUser] = useState<IUser>();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [message, setMessage] = useState<string>("");
  const [users, setUsers] = useState<IUser[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);

  useEffect(() => {
    const origin: string | undefined =
      process.env.NODE_ENV === "development"
        ? process.env.NEXT_PUBLIC_DEV_API_URL
        : process.env.NEXT_PUBLIC_API_URL;
    origin && (socket.current = io(origin));
  }, []);

  useEffect(() => {
    if (socket.current && currentUser) {
      socket.current.on("connect", () => {});
      socket.current.emit("add-user", currentUser._id);

      // check online users
      socket.current.on("online-users", (users: IOnlineUSer[]) => {
        const usersOnline = users.map((user) => user.userId);
        setOnlineUser(usersOnline);
      });

      socket.current.on("receive-message", (messageFromServer: IMessage) => {
        const data = { ...messageFromServer, fromSelf: false };
        setMessages((pre) => [...pre, data]);
      });
    }
  }, [currentUser, socket]);

  async function initUser() {
    if (checkAuth()) {
      setCurrentUser(await getCurrentUser());
      setIsAuthLoading(false);
    } else {
      router.replace("/login");
    }
  }

  useEffect(() => {
    initUser();
  }, []);

  async function getMessage() {
    if (currentChatUser && currentUser) {
      const response = await getMessageService(
        currentUser._id,
        currentChatUser._id
      );
      setMessages(response.data);
    }
  }

  useEffect(() => {
    getMessage();
  }, [currentChatUser, currentUser]);

  async function getUsers() {
    if (currentUser) {
      const response = await getUsersService(currentUser._id);
      if (response.status === 200) {
        setUsers(response.data.users);
      }
    }
  }

  useEffect(() => {
    getUsers();
  }, [currentUser]);

  async function onSentMessage() {
    if (currentChatUser && currentUser && message) {
      const data: IMessage = {
        message: message,
        fromSelf: true,
        createdAt: new Date().toISOString(),
        image: "",
        to: currentChatUser._id,
      };

      const msgs = [...messages];
      msgs.push(data);
      setMessages(msgs);
      setMessage("");

      await addMessageService(
        currentUser._id,
        currentChatUser._id,
        message,
        "" // image for next time
      );
      socket.current && socket.current.emit("sent-message", data);
      setShowEmojiPicker(false);
    }
  }

  function onSentMessageByEnter(e: KeyboardEvent<HTMLInputElement>) {
    if (e.keyCode === 13) {
      onSentMessage();
    }
  }

  return isAuthLoading ? (
    <PleaseWait />
  ) : (
    <main>
      <div className="flex justify-between h-screen">
        <div
          className={`fixed  bg-gray-700 z-50 h-screen w-[70%] left-0 top-0 transition-all -translate-x-full
            ${openSidebar && "translate-x-0"} md:static  md:w-[30%] lg:w-[20%] px-2 lg:px-10 flex flex-col justify-between`}
        >
          <div>
            <h1 className="py-5 text-4xl font-bold">Chatter</h1>

            {/* render users */}
            {users.map((user, index) => (
              <div
                key={index}
                className={`flex px-2 rounded-lg items-center gap-5 mt-1 py-1 cursor-pointer hover:bg-gray-600 ${
                  currentChatUser?._id === user._id && "bg-gray-600"
                }`}
                onClick={() => setCurrentChatUser(user)}
              >
                <div className="relative">
                  <Image
                    src={user.avatar}
                    className="w-10 h-10 object-cover rounded-full relative"
                    width={50}
                    height={50}
                    alt={user.username}
                  />
                  <div
                    className={`w-3 h-3 rounded-full absolute bottom-0 right-0 ${
                      onlineUsers.includes(user._id)
                        ? "bg-green-600"
                        : "bg-red-600"
                    }`}
                  ></div>
                </div>

                <p key={index}>{user.username}</p>
              </div>
            ))}
          </div>

          <button
            className="mt-32 bg-red-600 px-4 py-2 rounded-md text-white !mb-5"
            onClick={() => {
              socket.current.emit("logout", socket.current.id);
              localStorage.clear();
              router.replace("/login");
            }}
          >
            Log Out
          </button>
        </div>

        {currentChatUser ? (
          <div className="w-full md:w-[70%] lg:w-[80%] px-2 lg:px-10 bg-gray-900 flex flex-col justify-between">
            <div>
              <Header
                username={currentChatUser.username}
                avatar={currentChatUser.avatar}
                isOnline={onlineUsers.includes(currentChatUser._id)}
                setOpensidebar={setOpenSidebar}
              />

              {/* render message */}
              <ScrollToBottom
                mode="bottom"
                className="overflow-auto h-[calc(100vh-10rem)]"
              >
                {messages.map((result, index) => (
                  <div
                    key={index}
                    className={`flex flex-col ${
                      result.fromSelf ? "items-end" : "items-start"
                    }`}
                  >
                    <div className="flex gap-2 items-end">
                      {!result.fromSelf && (
                        <Image
                          width={50}
                          height={50}
                          className="rounded-full object-cover w-5 h-5"
                          src={currentChatUser.avatar}
                          alt={currentChatUser.username}
                        />
                      )}
                      <p
                        className={`${
                          result.fromSelf ? "bg-blue-600" : "bg-gray-800"
                        } py-2 px-4 rounded-md justify-end  mt-5`}
                      >
                        {result.message}
                        <br />
                        <span className="text-sm text-gray-200">
                          {moment(result.createdAt).fromNow()}
                        </span>
                      </p>

                      {result.fromSelf && (
                        <Image
                          width={50}
                          height={50}
                          className="rounded-full object-cover w-5 h-5"
                          src={currentUser?.avatar || ""}
                          alt={currentUser?.username || ""}
                        />
                      )}
                    </div>
                  </div>
                ))}
                {messages.length === 0 && (
                  <p className="text-center mt-20">
                    Say something to your friend 😎💕
                  </p>
                )}
              </ScrollToBottom>
            </div>

            {/* message input */}
            <div className="mb-5 w-full  rounded-lg flex  gap-2 relative">
              <div>
                {showEmojiPicker && (
                  <div className="absolute bottom-[100%] left-0">
                    <EmojiPicker
                      onEmojiClick={(e) => setMessage(message + e.emoji)}
                    />
                  </div>
                )}
                <h1
                  className="bg-white p-2 cursor-pointer hover:bg-gray-200 rounded-lg"
                  onClick={() => setShowEmojiPicker((pre) => !pre)}
                >
                  😊
                </h1>
              </div>

              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full  rounded-lg"
                placeholder="Say something to your friend ..."
                onKeyDown={onSentMessageByEnter}
              />

              <button
                onClick={onSentMessage}
                className="bg-blue-600 text-white py-2 px-4 rounded-lg"
              >
                👉
              </button>
            </div>
          </div>
        ) : (
          <div className="md:w-[70%] lg:w-[80%] px-2 lg:px-10 bg-gray-900 flex flex-col justify-center items-center">
            <Image
              src={hi}
              alt="Start A Chat"
              className="w-28 md:w-36 lg:w-52 object-cover"
            />
            <p>Select a people to start a chat 👌😚😚</p>
          </div>
        )}
      </div>
    </main>
  );
}
