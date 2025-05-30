import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from 'clipper-ui';
import App from './App';
import 'clipper-ui/styles.css'



ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>
); 