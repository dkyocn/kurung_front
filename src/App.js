import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import './App.css';

import Header from './components/common/Header';
import Footer from './components/common/Footer';
import AppRouter from './routers/router';

function App() {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <Router>
      <Header />
      <AppRouter />
      <Footer />
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
