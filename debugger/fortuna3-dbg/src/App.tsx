import React from 'react';
import { Fortuna3Emulator } from "fortuna3-emu";

function App() {

  Fortuna3Emulator.initialize(require("fortuna3-emu/dist/fortuna.wasm")).then(emulator => console.log(emulator.life()));

  return (
    <div className="App">
      Hello
    </div>
  );
}

export default App;
