import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// 引入全局样式 (包含 Tailwind 指令)
import './index.css';
// 引入 ReactFlow 样式以替代之前 HTML 中的 CDN 链接
import 'reactflow/dist/style.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);