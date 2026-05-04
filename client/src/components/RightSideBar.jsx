import { useContext } from "react";
import assets from "../assets/assets";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";

const RightSidebar = () => {

  const { selectedUser, messages } = useContext(ChatContext);
  const { logout, onlineUser } = useContext(AuthContext);

  if (!selectedUser) return null;

  // ✅ filter only image messages
  const mediaMessages = messages.filter((msg) => msg.image);

  return (
    <div className="bg-[#8185B2]/10 text-white w-full relative overflow-y-scroll max-md:hidden">

      {/* USER INFO */}
      <div className="pt-16 flex flex-col items-center gap-2 text-xs font-light mx-auto">

        <img
          src={selectedUser?.profilePic || assets.avatar_icon}
          alt=""
          className="w-20 h-20 rounded-full object-cover"
        />

        <h1 className="px-10 text-xl font-medium flex items-center gap-2">

          {/* ✅ online indicator */}
          {onlineUser.includes(selectedUser._id) && (
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
          )}

          {selectedUser.fullName}
        </h1>

        <p className="px-10 text-center text-gray-300">
          {selectedUser.bio || "No bio available"}
        </p>
      </div>

      {/* DIVIDER */}
      <hr className="border-[#ffffff30] my-6" />

      {/* MEDIA */}
      <div className="px-5 pb-20">

        <p className="text-sm mb-3 text-gray-300">Media</p>

        <div className="max-h-[200px] overflow-y-auto grid grid-cols-2 gap-3">

          {mediaMessages.length > 0 ? (
            mediaMessages.map((msg) => (
              <div
                key={msg._id}
                onClick={() => window.open(msg.image, "_blank")}
                className="cursor-pointer rounded overflow-hidden"
              >
                <img
                  src={msg.image}
                  alt=""
                  className="w-full h-full object-cover rounded-md hover:scale-105 transition"
                />
              </div>
            ))
          ) : (
            <p className="text-xs text-gray-400 col-span-2 text-center">
              No media available
            </p>
          )}

        </div>
      </div>

      {/* LOGOUT BUTTON */}
      <button
        onClick={logout}
        className="absolute bottom-5 left-1/2 -translate-x-1/2 
        bg-gradient-to-r from-purple-400 to-violet-600 
        text-white text-sm py-2 px-10 rounded-full cursor-pointer 
        hover:scale-105 transition"
      >
        Logout
      </button>

    </div>
  );
};

export default RightSidebar;