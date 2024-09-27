import { useEffect, useState } from "react";
import { FaYoutube } from "react-icons/fa6";
import ChatLists from "./ChatLists";
import InputText from "./InputText";
import UserLogin from "./UserLogin";
import socketIOClient from "socket.io-client";
import '../style.css'

const ChatContainer = () => {
  const [user, setUser] = useState(localStorage.getItem("user"));
  const [receiver, setReceiver] = useState(localStorage.getItem("receiver"));

  const socketio = socketIOClient("http://localhost:8080");
  const [chats, setChats] = useState([]);

  // Fetch chats from DB on initial load or after refresh
  useEffect(() => {
    if (user && receiver) {
      socketio.emit("joinRoom", { sender: user, receiver }); // Emit joinRoom event to fetch chat history
    }

    socketio.on("chat", (fetchedChats) => {
      setChats(fetchedChats); // Set chat history after fetching from DB
    });

    socketio.on("message", (msg) => {
      setChats((prevChats) => [...prevChats, msg]); // Add new message
    });

    return () => {
      socketio.off("chat");
      socketio.off("message");
    };
  }, [user, receiver]);

  const addMessage = (chat) => {
    const newChat = {
      senderUsername: user,
      receiverUsername: receiver,
      message: chat,
      avatar: localStorage.getItem("avatar"),
    };
    socketio.emit("newMessage", newChat); // Emit new message to the room
  };

  const Logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("receiver");
    localStorage.removeItem("avatar");
    setUser("");
    setReceiver("");
  };

  return (
    <div>
      {user ? (
        <div className="home">
          <div className="chats_header">
            <h4>Sender: {user}</h4>
            <h4>Receiver: {receiver}</h4>
            <p>
              <FaYoutube className="chats_icon" /> Code With Yousaf
            </p>
            <p className="chats_logout" onClick={Logout}>
              <strong>Logout</strong>
            </p>
          </div>
          <ChatLists chats={chats} />
          <InputText addMessage={addMessage} />
        </div>
      ) : (
        <UserLogin setUser={setUser} setReceiver={setReceiver} />
      )}
    </div>
  );
};

export default ChatContainer;
