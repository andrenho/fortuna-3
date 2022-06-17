import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import FortunaStore, { FortunaContext } from "./store/fortunaStore";

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
    <React.StrictMode>
        <FortunaContext.Provider value={new FortunaStore()}>
            <App />
        </FortunaContext.Provider>
    </React.StrictMode>
);
