import React, { useState } from 'react';
import '../style.css'

const InputText = ({ addMessage }) => {
    const [text, setText] = useState('');

    const handleSend = () => {
        if (text.trim() !== '') {
            addMessage(text); // Send the message
            setText(''); // Clear the input field
        }
    };

    return (
        <div className="inputtext_container">
            <input
            className='inputField'
                type='text'
                value={text}
                placeholder='Type a message...'
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button onClick={handleSend}>Send</button>
        </div>
    );
};

export default InputText;
