import { html } from 'htm';
import { signal, computed, effect } from 'preact/signals';
import {OpenAI} from 'openai'
const openapiKey = signal(localStorage.getItem("OPENAPI_KEY") ?? '');

const configOpen = signal(true);

effect(()=>{
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
  if (openApiTestResult.value === "SUCCESSFUL") return "✅"
  if (openApiTestResult.value === "FAILED") return "❌"
  return "❓"
}

export const App = () => html`
<div>
  <${CollapsableSection} title="Configuration" open=${configOpen}>
    <label> OpenAPI Key: <input value=${openapiKey} onChange=${(e)=>openapiKey.value = e.currentTarget.value}/> </label>
    <button onClick=${testOpenApiKey}>Test</button>
    <${OpenApiSuccessResult}/>
  </${CollapsableSection}>

</div>
`;

const CollapsableSection = ({title, open, children}) =>
  html`<section className="CollapsableSection ${ !open.value ? 'collapsed' : ''}" >
     <header onClick=${()=>open.value = !open.value}>${title}</header>
     <div>${children}</div>
  </section>
`
