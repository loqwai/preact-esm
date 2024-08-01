  import { render } from "preact";
  import { html } from 'htm';
  import { signal, computed } from 'preact/signals';

  const name = signal('Aaron');
  const charactersInName = computed(()=>name.value.length);
  const isAHacker = computed(()=>name.value === 'redaphid');
  const App = () => html`
    <div>
    <h1 class=${isAHacker.value === true ? 'hacker': 'not-a-hacker'}>Hi ${name}</h1>
    <h2>You have ${charactersInName} characters in your name</h2>
    <form>
      <label>a <input value=${name} onInput=${(e)=>name.value = e.currentTarget.value} /></label>
    </form>
  </div>
  `;

  render(html`<${App} />`, document.body);


