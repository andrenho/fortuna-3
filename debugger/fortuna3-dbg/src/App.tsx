import React from 'react';
import { Fortuna3Emulator } from "fortuna3-emu";

function App() {

  const emulator = new Fortuna3Emulator();
  emulator.initialize().then(r => {});

  return (
    <div className="App">
    </div>
  );
}

export default App;
