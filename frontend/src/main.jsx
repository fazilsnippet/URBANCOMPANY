
// import React from 'react';
// import { createRoot } from 'react-dom/client';
// import { BrowserRouter } from 'react-router-dom';
// import { Provider } from 'react-redux';
// import App from './App';
// import { store } from './app/store';
// import './index.css';

// createRoot(document.getElementById('root')).render(
//   <React.StrictMode>
//     <Provider store={store}>
//       <BrowserRouter>
//         <App />
//       </BrowserRouter>
//     </Provider>
//   </React.StrictMode>
// );



import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { store } from '../redux/store.js';
import { ThemeProvider } from '@material-tailwind/react';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
      <BrowserRouter>
      <ThemeProvider>
        <App />
        </ThemeProvider>
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      </BrowserRouter>
  </React.StrictMode>
);
