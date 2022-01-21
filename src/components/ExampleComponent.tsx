import React from 'react';
import stylesheet from './exampleComponent.module.css';

class ExampleComponent extends React.PureComponent {
    render(): JSX.Element {
        return <p className={stylesheet.example}>Hello world</p>;
    }
}

export default ExampleComponent;
