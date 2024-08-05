import { html } from 'htm';
import { Signal, signal, useSignal, useComputed, computed, effect } from 'preact/signals';
import {OpenAI} from 'openai'

/** @typedef {"SUCCESSFULL"|"FAILED"|"UNKNOWN"} ApiTest */

const ApiTest = {
  Success: "SUCCESSFULL",
  Failed: "FAILED",
  Unknown: "UNKNOWN",
}
const openApiKey = signal(localStorage.getItem("OPENAPI_KEY") ?? "");
const openApiKeyValid = signal(localStorage.getItem("OPENAPI_KEY_VALID") === "true");

/** @type {Signal<ApiTest>} */
const openApiTestResult = signal(openApiKeyValid.value ? ApiTest.Success : ApiTest.Unknown);
const configOpen = computed(()=> openApiTestResult.value !== ApiTest.Success)

effect(()=>{
  localStorage.setItem("OPENAPI_KEY", openApiKey.value);
  localStorage.setItem("OPENAPI_KEY_VALID", String(openApiTestResult.value === ApiTest.Success));
})

effect(()=>{
  openApiKeyValid.value = (openApiTestResult.value === 'OPENAPI_KEY_VALID');
})

const testopenApiKey = async () => {
  const openai = new OpenAI({apiKey: openApiKey.value, dangerouslyAllowBrowser: true});
  openApiTestResult.value = ApiTest.Unknown
  try {
  await openai.chat.completions.create({
    messages: [{ role: 'user', content: 'Say this is a test' }],
    model: 'gpt-4o-mini',
  });
  openApiTestResult.value = ApiTest.Success
  } catch (e) {
    openApiTestResult.value = ApiTest.Failed
  }
}

const OpenApiSuccessResult = () => {
  if (openApiTestResult.value === ApiTest.Unknown) return "🤷"
  if (openApiTestResult.value === ApiTest.Success) return "✅"
  if (openApiTestResult.value === ApiTest.Failed) return "❌"
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

const CollapsableSection = ({title, open:externallyOpen, children}) => {
  const manuallyOpen = useSignal(false);
  const open = useComputed(()=> manuallyOpen.value || externallyOpen.value);

  return html`<section className="CollapsableSection ${ !open.value ? 'collapsed' : ''}" >
     <header onClick=${()=>manuallyOpen.value = !manuallyOpen.value}>${title}</header>
     <div>${children}</div>
  </section>
`
}
