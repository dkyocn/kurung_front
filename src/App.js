import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import './App.css';

import CheckButton from './components/buttons/CheckButton';
import UpdateButton from './components/buttons/UpdateButton';
import SaveButton from './components/buttons/SaveButton';
import CreateButton from './components/buttons/CreateButton';
import DeleteButton from './components/buttons/DeleteButton'; // 

function App() {
  const [isChecked, setIsChecked] = useState(false);

  const handleCheck = () => setIsChecked((prev) => !prev);
  const handleUpdate = () => alert("수정 버튼이 클릭되었습니다!");
  const handleSave = () => alert("저장 버튼이 클릭되었습니다!");
  const handleCreate = () => alert("생성 버튼이 클릭되었습니다!");
  const handleDelete = () => alert("삭제 버튼이 클릭되었습니다!"); // 

  return (
    <Router>
      <div className="App" style={{ padding: '50px' }}>
        <CheckButton
          label="체크박스 테스트!"
          checked={isChecked}
          onChange={handleCheck}
        />

        <h2 style={{ marginTop: '40px' }}>UpdateButton 테스트 화면</h2>
        <UpdateButton onClick={handleUpdate} />

        <h2 style={{ marginTop: '40px' }}>SaveButton 테스트 화면</h2>
        <SaveButton onClick={handleSave} />

        <h2 style={{ marginTop: '40px' }}>CreateButton 테스트 화면</h2>
        <CreateButton onClick={handleCreate} />

        <h2 style={{ marginTop: '40px' }}>DeleteButton 테스트 화면</h2>
        <DeleteButton onClick={handleDelete} /> {/* ✅ 추가 */}
      </div>
    </Router>
  );
}

export default App;
