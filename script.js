  import { render } from "preact";
  import { html } from 'htm';
  import { signal } from 'preact/signals';

  const count = signal(0);
  function App() {
    return html`
    <div>
      <h1 class>Hello World!</h1>
      <button onClick=${() => (count.value += 1)}>
        Increment with signal
      </button>
      <p>Counter: ${count}</p>
    </div>
  `;
  }

  render(html`<${App} />`, document.getElementById("app"));


