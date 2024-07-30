import React from 'react'
import ReactDOM from 'react-dom/client'
//import App from './App.tsx'
import './global.css'
import './index.css'
//import { Button } from './components/ui/button.tsx'
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App.tsx'
import { Provider } from 'react-redux';
import { Store } from './Redux/Store.ts';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={Store}>
      <Router>
          <App/>
        </Router>

    </Provider>
      
  </React.StrictMode>,
)
