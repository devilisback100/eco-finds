import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // 1. Import BrowserRouter
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

// 2. Wrap your App component
root.render(
    <React.StrictMode>
            <App />
    </React.StrictMode>
);