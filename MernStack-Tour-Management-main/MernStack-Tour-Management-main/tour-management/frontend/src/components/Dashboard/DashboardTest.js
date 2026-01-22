import React, { useState, useEffect } from 'react';
import './Dashboard.css';

const DashboardTest = () => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCount(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="dashboard-test">
      <h2>Dashboard Test Component</h2>
      <p>Counter: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
};

export default DashboardTest;
