import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import './App.css';
import axios from 'axios';

import CheckButton from './components/buttons/CheckButton';
import UpdateButton from './components/buttons/UpdateButton';
import SaveButton from './components/buttons/SaveButton';
import CreateButton from './components/buttons/CreateButton';
import DeleteButton from './components/buttons/DeleteButton'; //

function App() {
  const [isChecked, setIsChecked] = useState(false);

  const handleCheck = () => setIsChecked((prev) => !prev);
  const handleUpdate = () => alert('수정 버튼이 클릭되었습니다!');
  const handleSave = () => alert('저장 버튼이 클릭되었습니다!');
  const handleCreate = () => alert('생성 버튼이 클릭되었습니다!');
  const handleDelete = () => alert('삭제 버튼이 클릭되었습니다!'); //

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

// function App() {
//   const baseURL = process.env.REACT_APP_PYTHON_API_BASE_URL;
//   const [message, setMessage] = useState('');

//   useEffect(() => {
//     axios
//       .get(baseURL)
//       .then((res) => setMessage(res.data.message))
//       .catch((err) => console.error.apply(err));
//   }, []);

//   return (
//     <div>
//       <h1> 연동 성공 </h1>
//       <p>
//         받은 메세지 : <strong>{message}</strong>
//       </p>
//     </div>
//   );
// }

export default App;
