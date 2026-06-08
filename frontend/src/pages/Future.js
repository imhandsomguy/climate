// [코드 시작]
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function Future() {
  const [status, setStatus] = useState(null);

  useEffect(() => {
    axios.get(`${API_URL}/api/future-status`)
      .then(res => setStatus(res.data))
      .catch(err => console.error(err));
  }, []);

  if (!status) return <div className="container">로딩 중...</div>;

  return (
    <div className="container">
      <Link to="/" className="btn-home" style={{ float: 'left' }}>← 홈으로</Link>
      <h1>지구의 미래 예측</h1>

      <div className="card">
        <h2>현재 지구의 상태</h2>
        <p style={{ fontSize: '1.5rem' }}>
          현재 지구는 19세기 후반 대비 <strong>{status.status.current_temp_increase}°C</strong> 상승했습니다.
        </p>
      </div>

      <div className="card">
        <h2>온도 상승까지 남은 시간</h2>
        <table className="projection-table">
          <thead>
            <tr>
              <th>목표 온도 상승</th>
              <th>도달까지 예상 시간</th>
            </tr>
          </thead>
          <tbody>
            {status.projections.map(p => (
              <tr key={p.target_temp}>
                <td>+{p.target_temp}°C</td>
                <td>{p.years_to_reach === 0 ? '이미 도달함' : `약 ${p.years_to_reach}년`}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p class="small-text" style={{ marginTop: '15px' }}>
          * 이 예측은 현재 배출량이 지속될 경우를 가정한 수치입니다.
        </p>
      </div>
    </div>
  );
}

export default Future;
// [코드 끝]
