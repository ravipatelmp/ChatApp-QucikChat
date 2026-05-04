import React, { useContext, useEffect, useState } from "react";
import assets from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";

const SideBar = () => {

  const { users, selectedUser, setSelectedUser, unseenMessage, getUsers } = useContext(ChatContext);
  const { logout, onlineUser } = useContext(AuthContext);

  const [input, setInput] = useState("");
  const navigate = useNavigate();

  // ✅ search filter
  const filteredUsers = users.filter((u) =>
    u.fullName.toLowerCase().includes(input.toLowerCase())
  );

  // ✅ fetch users once
  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div className={`bg-[#8185B2]/10 h-full p-5 rounded-r-xl overflow-y-scroll text-white ${selectedUser ? 'max-md:hidden' : ''}`}>

      {/* HEADER */}
      <div className="pb-5">
        <div className="flex justify-between items-center">
          <img src={assets.logo} alt="logo" className="max-w-40" />

          <div className="relative group">
            <img src={assets.menu_icon} alt="menu" className="max-h-5 cursor-pointer" />

            <div className="absolute top-full right-0 z-20 w-32 p-5 rounded-md bg-[#282142] border border-gray-600 hidden group-hover:block">

              <p onClick={() => navigate("/profile")} className="cursor-pointer text-sm">
                Edit Profile
              </p>

              <hr className="my-2 border-gray-500" />

              <p onClick={logout} className="cursor-pointer text-sm">
                Logout
              </p>

            </div>
          </div>
        </div>

        {/* SEARCH */}
        <div className="bg-[#282142] rounded-full flex items-center gap-2 py-3 px-4 mt-5">
          <img src={assets.search_icon} alt="search" className="w-3" />
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Search User..."
            className="bg-transparent outline-none text-white text-xs"
          />
        </div>
      </div>

      {/* USERS LIST */}
      <div className="flex flex-col">
        {filteredUsers.map((user) => {

          const isOnline = onlineUser.includes(user._id);
          const unreadCount = unseenMessage[user._id] || 0;

          return (
            <div
              key={user._id}
              onClick={() => setSelectedUser(user)}
              className={`relative flex items-center gap-3 p-2 pl-4 rounded cursor-pointer ${
                selectedUser?._id === user._id ? "bg-[#282142]" : ""
              }`}
            >

              {/* Avatar */}
              <img
                src={user.profilePic || assets.avatar_icon}
                alt=""
                className="w-[35px] h-[35px] rounded-full object-cover"
              />

              {/* Online dot */}
              {isOnline && (
                <span className="absolute left-10 bottom-2 w-2 h-2 bg-green-500 rounded-full"></span>
              )}

              {/* Info */}
              <div className="flex flex-col leading-5">
                <p>{user.fullName}</p>
                <span className={`text-xs ${isOnline ? "text-green-400" : "text-gray-400"}`}>
                  {isOnline ? "Online" : "Offline"}
                </span>
              </div>

              {/* Unread */}
              {unreadCount > 0 && (
                <span className="absolute right-3 top-3 bg-green-500 text-xs px-2 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SideBar;