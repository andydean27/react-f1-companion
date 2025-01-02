import React, { useState, useEffect, createContext } from 'react';
import { AppProvider } from './contexts/Contexts';
import MainPage from './pages/MainPage/MainPage';
import TimePlayer from './components/ui/TimePlayer';

function App() {
    

  
    return (
        <AppProvider>
          <div className="App">
              <MainPage/>
          </div>
        </AppProvider>
    );
}

export default App;
