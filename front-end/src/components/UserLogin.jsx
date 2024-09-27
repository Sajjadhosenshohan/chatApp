import React, { useState } from 'react';
import { FaReact } from 'react-icons/fa6';
import _ from 'lodash';
import '../style.css'

const UserLogin = ({ setUser, setReceiver }) => {
    const [userName, setUserName] = useState('');
    const [receiverName, setReceiverName] = useState('');

    const handleUser = () => {
        if (!userName || !receiverName) return;
        localStorage.setItem('user', userName);
        localStorage.setItem('receiver', receiverName);
        setUser(userName);
        setReceiver(receiverName);
        localStorage.setItem('avatar', `https://picsum.photos/id/${_.random(1, 1000)}/200/300`);
    };

    return (
        <div className='login_container'>
            <div className='login_title'>
                <FaReact className='login_icon' />
                <h1>Chat App</h1>
            </div>
            <div className='login_form'>
                <input
                    type="text"
                    placeholder='Enter your username'
                    onChange={(e) => setUserName(e.target.value)}
                />
                <input
                    type="text"
                    placeholder='Enter receiver username'
                    onChange={(e) => setReceiverName(e.target.value)}
                />
                <button onClick={handleUser}>Login</button>
            </div>
        </div>
    );
};

export default UserLogin;
