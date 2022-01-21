import React from 'react';
import ReactDOM from 'react-dom';
import ExampleComponent from '../components/ExampleComponent';
import { ReactComponent as Logo } from './logo.svg';

ReactDOM.render(
    <React.StrictMode>
        <Logo />
        <ExampleComponent />
    </React.StrictMode>,
    document.getElementById('root')
);
