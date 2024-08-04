import { html } from 'htm';
import { signal, computed, effect } from 'preact/signals';
import {OpenAI} from 'openai'

const openApiKey = signal(localStorage.getItem("OPENAPI_KEY") ?? '');
const openApiKeyValid = signal(localStorage.getItem("OPENAPI_KEY_VALID") === "true");

const configOpen = signal(!openApiKeyValid.value);
const openApiTestResult = signal(openApiKeyValid.value ? "SUCCESSFULL": "NOT_TESTED");

effect(()=>{
  localStorage.setItem("OPENAPI_KEY", openApiKey.value);
  localStorage.setItem("OPENAPI_KEY_VALID", String(openApiTestResult.value === 'SUCCESSFULL'));
  if(openApiTestResult.value === "FAILED") configOpen.value = true;
})

effect(()=>{
  openApiKeyValid.value = (openApiTestResult.value === 'OPENAPI_KEY_VALID');
})

const testopenApiKey = async () => {
  const openai = new OpenAI({apiKey: openApiKey.value, dangerouslyAllowBrowser: true});
  openApiTestResult.value = "NOT_TESTED"
  try {
  await openai.chat.completions.create({
    messages: [{ role: 'user', content: 'Say this is a test' }],
    model: 'gpt-4o-mini',
  });
  openApiTestResult.value = "SUCCESSFULL";
  } catch (e) {
    openApiTestResult.value = "FAILED";
  }
}

const OpenApiSuccessResult = () => {
  if (openApiTestResult.value === "NOT_TESTED") return "❔"
  if (openApiTestResult.value === "SUCCESSFULL") return "✅"
  if (openApiTestResult.value === "FAILED") return "❌"
  return "❓"
}

export const App = () => html`
<div>
  <${CollapsableSection} title="Configuration" open=${configOpen}>
    <label> OpenAPI Key: <input value=${openApiKey} onChange=${(e)=>openApiKey.value = e.currentTarget.value}/> </label>
    <button onClick=${testopenApiKey}>Test</button>
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
