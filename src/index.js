import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';

import App from './App';

const users = JSON.parse(localStorage.getItem('users'));
const admin = users && users.find(user => user.email == 'admin@admin.com');
if (!admin) {
  localStorage.setItem('users', JSON.stringify(
    [{ email: 'admin@admin.com', password: 'admin', role: 'администратор', active: true }]
  ));
}

if (!JSON.parse(localStorage.getItem('projects'))) {
  localStorage.setItem('projects', JSON.stringify([]));
}

if (!JSON.parse(localStorage.getItem('tasks'))) {
  localStorage.setItem('tasks', JSON.stringify([]));
}

if (!JSON.parse(localStorage.getItem('checks'))) {
  localStorage.setItem('checks', JSON.stringify([]));
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
