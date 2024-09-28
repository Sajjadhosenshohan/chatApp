import { useEffect, useState } from "react";
import { FaYoutube } from "react-icons/fa6";
import ChatLists from "./ChatLists";
import InputText from "./InputText";
import UserLogin from "./UserLogin";
import socketIOClient from "socket.io-client";
import '../style.css';

const ChatContainer = () => {
    const [userInfo, setUserInfo] = useState(JSON.parse(localStorage.getItem("userInfo")));
    const [receiver, setReceiver] = useState(localStorage.getItem("receiver"));
    const [normalUsers, setNormalUsers] = useState([]); // Store normal users
    const socketio = socketIOClient("http://localhost:8080");
    const [chats, setChats] = useState([]);

    useEffect(() => {
        const getData = async () => {
            try {
                // Post request to create a new user
                const response = await fetch('http://localhost:8080/api/users', {
                    method: 'GET',
                    // headers: {
                    //     'Content-Type': 'application/json'
                    // },
                    // body: JSON.stringify(userInfo)
                });

                if (response.ok) {
                    const createdUser = await response.json();
                    console.log('User found:', createdUser);
                    setNormalUsers(createdUser)
                } else {
                    console.log('Failed to create user');
                }
            } catch (error) {
                console.log('Error:', error);
            }
        }
        getData()
    }, [])

    useEffect(() => {
        if (userInfo && receiver) {
            socketio.emit("joinRoom", { sender: userInfo.username, receiver });
        }

        socketio.on("chat", (fetchedChats) => {
            setChats(fetchedChats);
        });

        socketio.on("message", (msg) => {
            setChats((prevChats) => [...prevChats, msg]);
        });

        return () => {
            socketio.off("chat");
            socketio.off("message");
        };
    }, [userInfo, receiver]);

    const addMessage = (chat) => {
        const newChat = {
            senderUsername: userInfo.username,
            receiverUsername: receiver,
            message: chat.text, // Use the message text
            avatar: userInfo.avatar,
        };
        socketio.emit("newMessage", newChat);
    };

    const Logout = () => {
        localStorage.removeItem("userInfo");
        localStorage.removeItem("receiver");
        setUserInfo(null);
        setReceiver("");
    };

    return (
        <div>
            {userInfo ? (
                <div className="home">
                    <div className="chats_header">
                        <h4>Sender: {userInfo.username}</h4>
                        <h4>Receiver: {receiver}</h4>
                        <p>
                            <FaYoutube className="chats_icon" /> Code With Yousaf
                        </p>
                        <p className="chats_logout" onClick={Logout}>
                            <strong>Logout</strong>
                        </p>
                    </div>
                    <div className="sidebar">
                        {/* Sidebar for normal users */}
                        {normalUsers.map((user) => (
                            <div key={user.id} onClick={() => setReceiver(user.username)}>
                                <img src={user.avatar} alt={user.username} />
                                <p>{user.username}</p>
                            </div>
                        ))}
                    </div>
                    <ChatLists chats={chats} />
                    <InputText addMessage={addMessage} />
                </div>
            ) : (
                <UserLogin setUser={setUserInfo} setReceiver={setReceiver} />
            )}
        </div>
    );
};

export default ChatContainer;
