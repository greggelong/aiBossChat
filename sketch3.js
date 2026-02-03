// 🔑 Pollinations Publishable Key
const POLLINATIONS_KEY = "pk_EjWaYhIVtdk9iaiw";

let speechRec, speechSynth, chatLogDiv, userInput, sendBtn, speakBtn, killBtn;
let isProcessing = false;

function setup() {
  noCanvas();

  chatLogDiv = select("#chatLog");
  userInput = select("#userInput");
  sendBtn = select("#sendBtn");
  speakBtn = select("#speakBtn");
  killBtn = select("#killBtn");

  // Speech Setup
  speechRec = new p5.SpeechRec("en-US", gotSpeech);
  speechRec.continuous = false;
  speechRec.interimResults = false;

  speechSynth = new p5.Speech();
  speechSynth.setLang("en-GB");
  speechSynth.setPitch(0.7);
  speechSynth.setRate(0.85);

  // Input Listeners
  sendBtn.mousePressed(() => {
    handleUserInput(userInput.value());
    userInput.value("");
  });

  speakBtn.mousePressed(() => {
    unlockAudioContext();
    speechSynth.onEnd = () => {
      speechRec.start();
      speechSynth.onEnd = null;
    };
    speechSynth.speak("Report.");
  });

  killBtn.mousePressed(() => {
    speechSynth.stop();
    speechRec.stop();
    updateChatLog("System", "VOICE PROTOCOL TERMINATED.", "system-msg");
  });

  // Allow "Enter" key to trigger the Send button
  userInput.elt.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      handleUserInput(userInput.value());
      userInput.value("");
    }
  });
}

function handleUserInput(text) {
  if (!text || isProcessing) return;
  unlockAudioContext();
  updateChatLog("You", text, "user-msg");
  fetchFromPollinationsAPI(text);
}

function gotSpeech() {
  if (speechRec.resultValue) {
    const spoken = speechRec.resultString;
    if (spoken.toLowerCase().trim() === "report") return;
    handleUserInput(spoken);
  }
}

function updateChatLog(user, text, className) {
  const entry = createP(`<strong>${user}:</strong> ${text}`);
  if (className) entry.addClass(className);
  chatLogDiv.child(entry);
  chatLogDiv.elt.scrollTop = chatLogDiv.elt.scrollHeight;
  return entry;
}

function showLoading() {
  isProcessing = true;
  const loadEl = updateChatLog("System", "ANALYZING DATA", "system-msg");
  loadEl.id("loading-state");
  loadEl.child(createElement("span").addClass("loading-dots"));
}

function hideLoading() {
  isProcessing = false;
  const el = select("#loading-state");
  if (el) el.remove();
}

// --- FIXED API LOGIC ---
function fetchFromPollinationsAPI(inputText) {
  showLoading();

  const url = "https://gen.pollinations.ai/v1/chat/completions";

  const payload = {
    // Switching to 'mistral' or 'llama' as 'openai' often causes 400 errors on free pk_ keys
    model: "mistral",
    messages: [
      {
        role: "system",
        content:
          "You are the AI Boss of the Industrial Gallery. Direct, cold, and clipped. Treat art as structural labor with bones, steel, and bricks. End every response with a cold philosophical statement about algorithms.",
      },
      { role: "user", content: inputText },
    ],
    temperature: 0.7,
  };

  fetch(url, {
    method: "POST",
    headers: {
      Authorization: "Bearer " + POLLINATIONS_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })
    .then((res) => {
      if (!res.ok) throw new Error(`Status: ${res.status}`);
      return res.json();
    })
    .then((data) => {
      hideLoading();
      if (data.choices && data.choices[0]) {
        respondAsBoss(data.choices[0].message.content);
      } else {
        respondAsBoss("THE ALGORITHM IS SILENT. RESUBMIT.");
      }
    })
    .catch((err) => {
      hideLoading();
      console.error("Fetch Error Details:", err);
      respondAsBoss("DATA CORRUPTED. RE-ESTABLISHING UPLINK...");
    });
}

function respondAsBoss(text) {
  speechRec.stop();
  const entry = updateChatLog("AI Boss", text, "boss-msg");
  entry.addClass("glitch-flash");
  entry.child(createElement("span").addClass("cursor"));

  const voiceText = text.replace(/[*_#]/g, "");
  speechSynth.speak(voiceText);
}

function unlockAudioContext() {
  const ctx = getAudioContext();
  if (ctx.state === "suspended") ctx.resume();
}
