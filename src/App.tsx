import React from "react";
import './App.css';
import { BrowserRouter as Router } from "react-router-dom"
import { AuthProvider } from "./routes/AuthContext"
import { Provider } from 'react-redux'
import Routes from "./routes/Routes"
import Protected from "./routes/Protected";
import { PersistGate } from "redux-persist/integration/react";
import store from "./redux/store";
import persistStore from "redux-persist/es/persistStore";
let persistor = persistStore(store);

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Router>
          <AuthProvider>
            <Routes />
          </AuthProvider>
        </Router>
      </PersistGate>
    </Provider>
  )
}
export default App;