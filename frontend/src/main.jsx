import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import { BrowserRouter } from 'react-router-dom'
import {Provider} from 'react-redux'
import {store} from "../redux/store"
import ShopContextProvider from './context/ShopContext.jsx'
import { PersistGate } from 'redux-persist/integration/react'
import { persistor } from '../redux/store'

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
    <BrowserRouter>
      <ShopContextProvider>
        <App />
      </ShopContextProvider>
    </BrowserRouter>
    </PersistGate>
  </Provider>
)

