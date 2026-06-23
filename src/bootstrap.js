import React from 'react';
import ReactDOM from 'react-dom/client';
import { applyThemeToCssVariables, generateTheme } from '@/styles/theme';
import App from './App';

const primaryColor = '#4F185A';

applyThemeToCssVariables(primaryColor);

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <App theme={generateTheme(primaryColor)} />
  </React.StrictMode>,
);
