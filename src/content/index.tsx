import * as ReactDOM from 'react-dom';
import ExampleComponent from '../components/ExampleComponent';

// Firefox `browser.tabs.executeScript()` requires scripts return a primitive value
(() => {
    // This reference allows to listen for messages here and update the component.
    let example: ExampleComponent | null;

    // mount component to context window
    const id = 'chiff-notification-box';
    const container = document.createElement(id);
    const root = document.createElement('div');
    const shadowRoot = container.attachShadow({ mode: import.meta.env.DEV ? 'open' : 'closed' });
    container.id = id;
    container.style.all = 'initial';
    root.id = 'root';
    // Append style here
    // shadowRoot.appendChild("stylesheet");
    shadowRoot.appendChild(root);

    if (document.querySelector(id) == null) {
        document.body.insertBefore(container, document.body.firstChild);
    }
    ReactDOM.render(
        <ExampleComponent
            ref={(component) => {
                example = component;
            }}
        />,
        root
    );
})();
