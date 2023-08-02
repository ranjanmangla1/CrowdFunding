import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThirdwebProvider } from '@thirdweb-dev/react';

import App from "./App";
import "./main.css";

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <ThirdwebProvider desiredChainId={11155111}>
        <Router>
            {/* <StateContextProvider> */}
                <App />
            {/* </StateContextProvider> */}
        </Router>
    </ThirdwebProvider>
)