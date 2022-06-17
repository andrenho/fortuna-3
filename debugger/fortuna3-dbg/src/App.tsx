import React from 'react';
import { Fortuna3Emulator } from "fortuna3-emu";
import useStore from "./hooks/useStore";

function App() {

  Fortuna3Emulator.initialize(require("fortuna3-emu/dist/fortuna.wasm")).then(emulator => console.log(emulator.life()));

  return (
    <div className="App">
    </div>
  );
}

export default App;
