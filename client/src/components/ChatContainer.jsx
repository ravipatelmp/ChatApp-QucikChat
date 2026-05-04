import React, { useContext, useEffect, useRef, useState } from "react";

import assets from "../assets/assets";
import { formatMessageTime } from "../lib/utils";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";

const ChatContainer = () => {
  const { messages, selectedUser, setSelectedUser, sendMessage } = useContext(ChatContext);
  const { authUser, onlineUser } = useContext(AuthContext);

  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null); // ✅ NEW

  const scrollEnd = useRef();

  useEffect(() => {
    scrollEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!text.trim() && !image) return;

    await sendMessage(text, image);

    setText("");
    setImage(null);
    setPreview(null);
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    console.log("SELECTED FILE:", file);

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImage(null);
    setPreview(null);
  };

  return selectedUser ? (
    <div className="h-full flex flex-col backdrop-blur-lg relative">

      {/* HEADER */}
      <div className="flex items-center gap-3 py-3 mx-4 border-b border-stone-500">
        <img
          src={selectedUser?.profilePic || assets.avatar_icon}
          alt=""
          className="w-8 h-8 rounded-full object-cover"
        />

        <p className="flex-1 text-lg text-white flex items-center gap-2">
          {selectedUser?.fullName}
          {onlineUser.includes(selectedUser._id) && (
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
          )}
        </p>

        <img
          onClick={() => setSelectedUser(null)}
          src={assets.arrow_icon}
          alt=""
          className="md:hidden w-6 cursor-pointer"
        />
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 pb-24">
        {messages.map((msg) => {
          const isMe = msg.senderId === authUser._id;

          return (
            <div
              key={msg._id}
              className={`flex items-end gap-2 ${
                isMe ? "justify-end" : "flex-row-reverse"
              }`}
            >
              <div
                className={`p-2 max-w-[250px] text-sm rounded-lg text-white ${
                  isMe ? "bg-violet-500/30" : "bg-[#282142]"
                }`}
              >
                {msg.image && (
                  <img
                    src={msg.image}
                    alt=""
                    className="max-w-full rounded-md mb-2"
                  />
                )}
                {msg.text && <p>{msg.text}</p>}
              </div>

              <div className="text-xs text-center">
                <img
                  src={
                    isMe
                      ? authUser?.profilePic || assets.avatar_icon
                      : selectedUser?.profilePic || assets.avatar_icon
                  }
                  className="w-7 h-7 rounded-full"
                />
                <p>{formatMessageTime(msg.createdAt)}</p>
              </div>
            </div>
          );
        })}
        <div ref={scrollEnd}></div>
      </div>

      {/* INPUT AREA */}
      <div className="bottom-0 left-0 right-0 flex flex-col gap-2 p-3 bg-black/30">

        {/* ✅ PREVIEW */}
        {preview && (
          <div className="relative w-20">
            <img src={preview} className="rounded-lg" />
            <button
              onClick={removeImage}
              className="absolute top-0 right-0 bg-red-500 text-white rounded-full px-1"
            >
              ✕
            </button>
          </div>
        )}

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Message..."
            className="flex-1 p-2 bg-gray-700 text-white rounded"
          />

          <input
            type="file"
            hidden
            id="file"
            onChange={handleImage}
          />

          <label htmlFor="file">
            <img src={assets.gallery_icon} className="w-5 cursor-pointer" />
          </label>

          <button onClick={handleSend}>
            <img src={assets.send_button} className="w-6" />
          </button>
        </div>
      </div>
    </div>
  ) : null;
};

export default ChatContainer;
