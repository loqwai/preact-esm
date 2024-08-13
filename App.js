import { html } from 'htm';
import {signal, useSignal, useComputed, computed, effect } from 'preact/signals';
import {OpenAI} from 'openai'

const ApiTest = {
  Success: "SUCCESSFULL",
  Failed: "FAILED",
  Unknown: "UNKNOWN",
}

const openApiKey = signal(localStorage.getItem("OPENAPI_KEY") ?? "");
const openApiTestResult = signal(localStorage.getItem("OPENAPI_KEY_VALID") === "true" ? ApiTest.Success : ApiTest.Unknown);
const apiReady = computed(()=> openApiTestResult.value === ApiTest.Success)

const personality = {
  name: signal(localStorage.getItem("PERSONALITY_NAME") ?? ""),
  age: signal(Number(localStorage.getItem("PERSONALITY_AGE") ?? 0)),
  politeness: signal(Number(localStorage.getItem("PERSONALITY_POLITENESS") ?? 0)),
  humor: signal(Number(localStorage.getItem("PERSONALITY_HUMOR") ?? 0)),
  description: computed(()=>{
    return `My name is ${personality.name.value}, I am ${personality.age.value} years old. I am ${personality.politeness.value}% polite and ${personality.humor.value}% humorous.`
  })
}

const chat = {
  history: signal([]),
  message: signal(""),
  sendMessage: async () => {
    const message = chat.message.value.trim();
    if(message.length === 0) return;
    chat.message.value = "";
    chat.history.value = [...chat.history.value, message];
    const openai = new OpenAI({apiKey: openApiKey.value, dangerouslyAllowBrowser: true});
    const response = await openai.chat.completions.create({
      messages: [
        { role: 'system', content: 'You describe yourself as such:' + personality.description.value },
        { role: 'user', content: message },
      ],
      model: 'gpt-4o-mini',
      max_tokens: 150,
      temperature: 0.9,
    });
    chat.history.value = [...chat.history.value, response.choices[0].message.content];
    chat.message.value = "";
  }
}


const personalityReady = computed(()=> personality.name.value !== "" || personality.age.value !== 0 || personality.politeness.value !== 0 || personality.humor.value !== 0)
const chatReady = computed(()=> apiReady.value && personalityReady.value)
effect(()=>{
  localStorage.setItem("OPENAPI_KEY", openApiKey.value);
  localStorage.setItem("OPENAPI_KEY_VALID", String(openApiTestResult.value === ApiTest.Success));
  localStorage.setItem("PERSONALITY_NAME", personality.name.value);
  localStorage.setItem("PERSONALITY_AGE", personality.age.value);
  localStorage.setItem("PERSONALITY_POLITENESS", personality.politeness.value);
  localStorage.setItem("PERSONALITY_HUMOR", personality.humor.value);
  localStorage.setItem("CHAT_HISTORY", JSON.stringify(chat.history.value));
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
effect(()=>{
  // if the chat message ends with a newline, send it.
  console.log(chat.message.value)
  if (chat.message.value.endsWith("\n")) chat.sendMessage();
})
export const App = () => html`
<div>
  <${CollapsableSection} title="API Settings" open=${!apiReady}>
    <label> OpenAPI Key: <input value=${openApiKey} onChange=${(e)=>openApiKey.value = e.currentTarget.value}/> </label>
    <button onClick=${testopenApiKey}>Test</button>
    <${OpenApiSuccessResult}/>
  <//>
  <${CollapsableSection} title="Personality" open=${!personalityReady}>
    <label> Name: <input value=${personality.name} onChange=${(e)=>personality.name.value = e.currentTarget.value}/> </label>
    <label> Age: <input value=${personality.age} type="number" onChange=${(e)=>personality.age.value = e.currentTarget.value}/> </label>
    <label> Politeness: <input value=${personality.politeness} type="range" min="0" max="100" onChange=${(e)=>personality.politeness.value = e.currentTarget.value}/> </label>
    <label> Humor: <input value=${personality.humor} type="range" min="0" max="100" onChange=${(e)=>personality.humor.value = e.currentTarget.value}/> </label>
    <p>${personality.description}</p>
  <//>
  <${CollapsableSection} title="Chat" open=${chatReady} canManuallyOpen=${false}>
    <${ChatHistory} history=${chat.history}/>
    <textarea value=${chat.message} onKeyUp=${(e)=>chat.message.value = e.currentTarget.value} ></textarea>
    <button onClick=${(e) => chat.sendMessage()} >Chat</button>
  <//>
</div>
`;

const CollapsableSection = ({title, open:externallyOpen, canManuallyOpen=true, children}) => {
  const manuallyOpen = useSignal(false);
  const open = useComputed(()=> (manuallyOpen.value && canManuallyOpen) || externallyOpen.value);

  return html`<section className="CollapsableSection ${ !open.value ? 'collapsed' : ''}" >
     <header onClick=${()=>manuallyOpen.value = !manuallyOpen.value}>${externallyOpen.value ? '🔓': ''} ${title}</header>
     <div>${children}</div>
  </section>
`
}

const ChatHistory = ({history}) => {
  return html`<ul>
    ${history.value.map((message, i) => html`<li key=${i}>${message}</li>`)}
  </ul>`
}
