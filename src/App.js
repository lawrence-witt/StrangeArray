// Dependencies
import React, { useState } from 'react';
import { Provider } from 'react-redux';

// Imported Sheets
import './App.css';
import store from './redux/store';
import Overlay from './components/Overlay/Overlay';
import Scene from './components/Scene/Scene';

function App() {

  return (
    <Provider store={store}>
      <main className="app">
        <Overlay />
        <div className="canvas-container">
          <Scene />
        </div>
      </main>
    </Provider>
  );
}

export default App;
