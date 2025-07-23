import React, { useState } from 'react';
import '../../styles/chatbot/chatbot.css';
import biniImage from '../../assets/bini.png';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');

  const sendMessage = async () => {
    if (!userInput.trim()) return;

    const newMessages = [...messages, { sender: 'user', text: userInput }];
    setMessages(newMessages);
    setUserInput('');

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer YOUR_API_KEY`, // <-- 여기에 본인 API 키 입력
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: '친절한 건강 상담 챗봇입니다.' },
            ...newMessages.map(msg => ({
              role: msg.sender === 'user' ? 'user' : 'assistant',
              content: msg.text,
            })),
          ],
        }),
      });

      const data = await response.json();
      const reply = data.choices[0].message.content;

      setMessages(prev => [...prev, { sender: 'bot', text: reply }]);
    } catch (error) {
      setMessages(prev => [...prev, { sender: 'bot', text: '오류가 발생했어요. 다시 시도해주세요.' }]);
      console.error(error);
    }
  };

   const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // 줄바꿈 방지
      sendMessage();
    }
  };

  return (
    <div className="chatbot-container">
      <div className="chat-header">
        <img src={biniImage} alt="bini" className="chat-avatar" />
        <h2>KURUNG</h2>
        <div className="chat-tags">
        </div>
      </div>

      <div className="chat-box">
        {messages.map((msg, idx) => (
          <div key={idx} className={`chat-message ${msg.sender}`}>
            {msg.sender === 'bot' && <img src={biniImage} alt="bini" className="chat-avatar-small" />}
            <div className="message-bubble">{msg.text}</div>
          </div>
        ))}
      </div>

      <div className="chat-input">
        <input
          type="text"
          value={userInput}
          onChange={e => setUserInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="메시지를 입력하세요..."
        />
        <button onClick={sendMessage}>전송</button>
      </div>
    </div>
  );
};

export default Chatbot;
