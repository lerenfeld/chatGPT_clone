import {
  faMessage,
  faPlus,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useEffect, useState } from "react";

export const ChatSidebar = ({ chatId }) => {
  const [chatList, setChatList] = useState([]);

  useEffect(() => {
    const loadChatsList = async () => {
      const response = await fetch("/api/chat/getChatList", {
        method: "POST",
      });
      const json = await response.json();
      console.log("CHAT LIST", json);
      setChatList(json?.chats || []);
    };

    loadChatsList();
  }, [chatId]);

  return (
    <>
      <div className="flex flex-col overflow-hidden bg-gray-900 text-white">
        <Link
          className="side-menu-item bg-emerald-500 hover:bg-emerald-600"
          href="/chat"
        >
          <FontAwesomeIcon icon={faPlus} /> New chat
        </Link>
        <div className="flex-1 overflow-auto bg-gray-950 text-white">
          {chatList.map((chat) => (
            <Link
              key={chat._id}
              href={`/chat/${chat._id}`}
              className={`side-menu-item ${
                chatId === chat._id ? "bg-gray-700 hover:bg-gray-700" : ""
              }`}
            >
              <FontAwesomeIcon icon={faMessage} className="text-white/50" />
              <span
                title={chat.title}
                className="overflow-hidden text-ellipsis whitespace-nowrap"
              >
                {chat.title}
              </span>
            </Link>
          ))}
        </div>
        <Link className="side-menu-item" href="/api/auth/logout">
          <FontAwesomeIcon icon={faRightFromBracket} /> Logout
        </Link>
      </div>
    </>

    // <div className="bg-gray-900 text-white">
    //   <Link href="/api/auth/logout">Loguot</Link>
    // </div>
  );
};
