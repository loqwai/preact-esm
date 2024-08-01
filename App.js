import { html } from 'htm';
import { signal, computed, effect } from 'preact/signals';

const name = signal(window.location.hash);
const charactersInName = computed(()=>name.value.length);
const isAHacker = computed(()=>name.value === 'redaphid');
effect(()=>{
  window.location.hash = name.value
});
export const App = () => html`
  <div>
  <h1 class=${isAHacker.value === true ? 'hacker': 'not-a-hacker'}>Hi ${name}</h1>
  <h2>You have ${charactersInName} characters in your name</h2>
  <form onSubmit=${(e)=>e.preventDefault()}>
    <label>a <input value=${name} onInput=${(e)=>name.value = e.currentTarget.value} /></label>
  </form>
</div>
`;
