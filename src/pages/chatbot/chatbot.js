import React, { useState, useRef, useEffect } from 'react';
import '../../styles/chatbot/chatbot.css';
import biniImage from '../../assets/bini.png';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const bottomRef = useRef(null);

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
          Authorization: ``,
        },
        body: JSON.stringify({
          model: 'gpt-4.1-mini',
          messages: [
            { role: 'system', content: '당신은 친절한 건강 상담 챗봇입니다.' },
            ...newMessages.map(msg => ({
              role: msg.sender === 'user' ? 'user' : 'assistant',
              content: msg.text,
            })),
          ],
          temperature: 0.1,
        }),
      });

      const data = await response.json();
      console.log('🔍 GPT 응답:', data);

      if (data.error) {
        throw new Error(data.error.message);
      }

      const reply = data.choices?.[0]?.message?.content || '❓ 예상치 못한 응답입니다.';
      setMessages(prev => [...prev, { sender: 'bot', text: reply }]);
    } catch (error) {
      console.error('🚨 GPT 호출 오류:', error);
      setMessages(prev => [...prev, {
        sender: 'bot',
        text: `❌ 오류 발생: ${error.message}`,
      }]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="chatbot-container">
      <div className="chat-header">
        <img src={biniImage} alt="bini" className="chat-avatar" />
        <h2>KURUNG</h2>
        <div className="chat-tags"></div>
      </div>

      <div className="chat-box">
        {messages.map((msg, idx) => (
          <div key={idx} className={`chat-message ${msg.sender}`}>
            {msg.sender === 'bot' && (
              <img src={biniImage} alt="bini" className="chat-avatar-small" />
            )}
            <div className="message-bubble">{msg.text}</div>
          </div>
        ))}
        <div ref={bottomRef}></div>
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
