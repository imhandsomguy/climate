// [코드 시작]
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Link } from 'react-router-dom';

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function Home() {
  const [data, setData] = useState(null);

  useEffect(() => {
    axios.get(`${API_URL}/api/emissions`)
      .then(res => setData(res.data))
      .catch(err => console.error(err));
  }, []);

  if (!data) return <div className="container">로딩 중...</div>;

  const centerTextPlugin = {
    id: 'centerText',
    afterDraw: (chart) => {
      const { ctx, chartArea: { top, bottom, left, right, width, height } } = chart;
      const centerX = (left + right) / 2;
      const centerY = (top + bottom) / 2;
      const fontSizeTitle = Math.round(width / 20);
      const fontSizeValue = Math.round(width / 15);

      ctx.save();
      ctx.font = `bold ${fontSizeTitle}px Segoe UI`;
      ctx.fillStyle = '#2c3e50';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('총 배출량', centerX, centerY - (fontSizeValue / 0.85));
      
      ctx.font = `bold ${fontSizeValue}px Segoe UI`;
      ctx.fillStyle = '#e74c3c';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${data.comparison.total_amount} GtCO2`, centerX, centerY + (fontSizeValue / 2.5));
      ctx.restore();
    }
  };

  const chartData = {
    labels: data.chartData.map(d => d.category),
    datasets: [{
      data: data.chartData.map(d => parseFloat(d.amount)),
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
      hoverOffset: 30,
      hoverBackgroundColor: ['#d6526e', '#2c89c7', '#d9af4a', '#3fa3a3', '#8256d9', '#d98736']
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    layout: { padding: 60 },
    plugins: {
      legend: { display: false },
      datalabels: {
        color: '#fff',
        textAlign: 'center',
        font: { weight: 'bold', size: 12 },
        formatter: (value, ctx) => {
          let sum = 0;
          let dataArr = ctx.chart.data.datasets[0].data;
          dataArr.map(data => sum += data);
          let percentage = (value * 100 / sum).toFixed(1) + "%";
          let label = ctx.chart.data.labels[ctx.dataIndex];
          return label + '\n' + percentage;
        },
        display: (context) => context.dataset.data[context.dataIndex] > 5
      }
    }
  };

  const changeText = data.comparison.change_rate >= 0 
    ? `전년도보다 약 ${data.comparison.change_rate}% 증가했습니다.`
    : `전년도보다 약 ${Math.abs(data.comparison.change_rate)}% 감소했습니다.`;

  return (
    <div className="container">
      <h1>2024년 세계 이산화탄소 배출량</h1>
      <div className="card">
        <div style={{ maxWidth: '500px', margin: '0 auto' }}>
          <Doughnut data={chartData} options={chartOptions} plugins={[centerTextPlugin]} />
        </div>
        <p style={{ marginTop: '20px', fontWeight: 'bold', fontSize: '1.2rem' }}>{changeText}</p>
      </div>

      <div className="nav-icons">
        <Link to="/reduction" className="nav-item">
          <span>🌱</span>
          <p>어떻게 줄일 수 있을까요?</p>
        </Link>
        <Link to="/future" className="nav-item">
          <span>🌍</span>
          <p>이대로라면 지구는?</p>
        </Link>
      </div>
    </div>
  );
}

export default Home;
// [코드 끝]
