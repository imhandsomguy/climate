// [코드 시작]
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function Reduction() {
  const [methods, setMethods] = useState(null);

  useEffect(() => {
    axios.get(`${API_URL}/api/reduction-methods`)
      .then(res => setMethods(res.data))
      .catch(err => console.error(err));
  }, []);

  if (!methods) return <div className="container">로딩 중...</div>;

  return (
    <div className="container">
      <Link to="/" className="btn-home" style={{ float: 'left' }}>← 홈으로</Link>
      <h1>탄소 배출 절감 방법</h1>
      
      <div className="card">
        <h2>가장 효율적인 TOP 5 방법</h2>
        <ul className="reduction-list">
          {methods.top.map((m, idx) => (
            <li key={m.id}>
              <strong>{idx + 1}. {m.title}</strong> <span className="badge">{m.efficiency}% 효율</span>
              <p style={{ margin: '5px 0 0 0', color: '#666' }}>{m.description}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="small-text">
        이외에도 {methods.others.map(m => m.title).join(', ')} 등 다양한 노력들이 필요합니다.
      </div>
    </div>
  );
}

export default Reduction;
// [코드 끝]
