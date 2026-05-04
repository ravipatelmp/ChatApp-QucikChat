import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const { socket, authUser } = useContext(AuthContext);

    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [unseenMessage, setUnseenMessage] = useState({});

    // ================= TOKEN HELPER =================
    const getAuthHeader = () => {
        const token = localStorage.getItem("token");
        return {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };
    };

    // ================= GET USERS =================
    const getUsers = async () => {
        try {
            const { data } = await axios.get(
                "/api/v1/messages/users",
                getAuthHeader()
            );

            if (data.success) {
                setUsers(data.users);
                setUnseenMessage(data.unseenMessage || {});
            }

        } catch (error) {
            console.log("GET USERS ERROR:", error.response?.data || error.message);
            toast.error(error.response?.data?.message || error.message);
        }
    };

    // ================= GET MESSAGES =================
    const getMessages = async (userId) => {
        try {
            const { data } = await axios.get(
                `/api/v1/messages/${userId}`,
                getAuthHeader()
            );

            if (data.success) {
                setMessages(data.messages);
            }

        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    };

    // ================= SEND MESSAGE =================
const sendMessage = async (text, image = null) => {
    if (!selectedUser) return;

    try {
        let response;

        if (image) {
            // ✅ image के लिए FormData
            const formData = new FormData();
            formData.append("text", text);
            formData.append("image", image);

            response = await axios.post(
                `/api/v1/messages/send/${selectedUser._id}`,
                formData,
                getAuthHeader()
            );

        } else {
            // ✅ text के लिए JSON
            response = await axios.post(
                `/api/v1/messages/send/${selectedUser._id}`,
                { text },
                getAuthHeader()
            );
        }

        if (response.data.success) {
            setMessages((prev) => [...prev, response.data.newMessage]);
        }

    } catch (error) {
        console.log("ERROR MESSAGE:", error.response?.data?.message);
        toast.error(error.response?.data?.message || error.message);
    }
};

    // ================= MARK AS SEEN =================
    const markAsSeen = async (userId) => {
        try {
            await axios.put(
                `/api/v1/messages/mark/${userId}`,
                {},
                getAuthHeader()
            );

            setUnseenMessage((prev) => ({
                ...prev,
                [userId]: 0,
            }));

        } catch (error) {
            console.log(error.message);
        }
    };

    // ================= SOCKET LISTENER =================
    useEffect(() => {
        if (!socket) return;

        const handleNewMessage = async (newMsg) => {
            const senderId = newMsg.senderId;

            if (selectedUser && senderId === selectedUser._id) {
                newMsg.seen = true;
                setMessages((prev) => [...prev, newMsg]);

                await markAsSeen(senderId);
            } else {
                setUnseenMessage((prev) => ({
                    ...prev,
                    [senderId]: (prev[senderId] || 0) + 1,
                }));
            }
        };

        socket.on("newMessage", handleNewMessage);

        return () => socket.off("newMessage", handleNewMessage);

    }, [socket, selectedUser?._id]);

    // ================= WHEN USER SELECTED =================
    useEffect(() => {
        if (selectedUser) {
            getMessages(selectedUser._id);
            markAsSeen(selectedUser._id);
        }
    }, [selectedUser]);

    // ================= LOAD USERS =================
    useEffect(() => {
        if (authUser) {
            getUsers();
        }
    }, [authUser]);

    const value = {
        messages,
        users,
        selectedUser,
        setSelectedUser,
        sendMessage,
        unseenMessage,
        setUnseenMessage,
        getUsers,
    };

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    );
};