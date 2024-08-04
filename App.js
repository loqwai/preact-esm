import { html } from 'htm';
import { signal, computed, effect } from 'preact/signals';

const name = signal(window.location.hash);
const charactersInName = computed(()=>name.value.length);
const isAHacker = computed(()=>name.value === 'redaphid');
effect(()=>{
<<<<<<< Updated upstream
  window.location.hash = name.value
});
=======
  localStorage.setItem("OPENAPI_KEY", openapiKey.value);
})

const openApiTestResult = signal("NOT_TESTED");

const testOpenApiKey = async () => {
  console.log("Testing OpenAPI Key");
  const openai = new OpenAI({apiKey: openapiKey.value, dangerouslyAllowBrowser: true});
  try {
  await openai.chat.completions.create({
    messages: [{ role: 'user', content: 'Say this is a test' }],
    model: 'gpt-3.5-turbo',
  });
  openApiTestResult.value = "SUCCESSFUL";
  } catch (e) {
    openApiTestResult.value = "FAILED";
  }

}

const OpenApiSuccessResult = () => {
  if (openApiTestResult.value === "NOT_TESTED") return "❔"
  if (openApiTestResult.value === "SUCCESSFUL") return "✅";
  return "❌";
}

>>>>>>> Stashed changes
export const App = () => html`
  <div>
  <h1 class=${isAHacker.value === true ? 'hacker': 'not-a-hacker'}>Hi ${name}</h1>
  <h2>You have ${charactersInName} characters in your name</h2>
  <form onSubmit=${(e)=>e.preventDefault()}>
    <label>a <input value=${name} onInput=${(e)=>name.value = e.currentTarget.value} /></label>
  </form>
</div>
`;
