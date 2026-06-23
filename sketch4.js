// 🔑 Pollinations Publishable Key
const POLLINATIONS_KEY = "pk_EjWaYhIVtdk9iaiw";

// ============================================================
//  AI BOSS CHAT – English + Chinese in chat, spoken both
// ============================================================
// Requires: p5.js, p5.speech.js, and a POLLINATIONS_KEY variable

let speechRec, speechSynth, chatLogDiv, userInput, sendBtn, speakBtn, killBtn;
let isProcessing = false;

function setup() {
  noCanvas();

  chatLogDiv = select("#chatLog");
  userInput = select("#userInput");
  sendBtn = select("#sendBtn");
  speakBtn = select("#speakBtn");
  killBtn = select("#killBtn");

  // Speech Recognition
  speechRec = new p5.SpeechRec("en-US", gotSpeech);
  speechRec.continuous = false;
  speechRec.interimResults = false;

  // Speech Synthesis (default English)
  speechSynth = new p5.Speech();
  speechSynth.setLang("en-GB");
  speechSynth.setPitch(0.7);
  speechSynth.setRate(0.85);

  // Buttons
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

  // Enter key
  userInput.elt.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      handleUserInput(userInput.value());
      userInput.value("");
    }
  });
}

// ============================================================
//  USER INPUT HANDLER
// ============================================================
function handleUserInput(text) {
  if (!text || isProcessing) return;
  unlockAudioContext();
  updateChatLog("You", text, "user-msg");
  fetchFromPollinationsAPI(text);
}

// ============================================================
//  SPEECH RECOGNITION CALLBACK
// ============================================================
function gotSpeech() {
  if (speechRec.resultValue) {
    const spoken = speechRec.resultString;
    if (spoken.toLowerCase().trim() === "report") return;
    handleUserInput(spoken);
  }
}

// ============================================================
//  CHAT LOG HELPER
// ============================================================
function updateChatLog(user, text, className) {
  const entry = createP(`<strong>${user}:</strong> ${text}`);
  if (className) entry.addClass(className);
  chatLogDiv.child(entry);
  chatLogDiv.elt.scrollTop = chatLogDiv.elt.scrollHeight;
  return entry;
}

// ============================================================
//  LOADING INDICATOR
// ============================================================
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

// ============================================================
//  POLLINATIONS API – GET BOSS RESPONSE (English)
// ============================================================
function fetchFromPollinationsAPI(inputText) {
  showLoading();

  const url = "https://gen.pollinations.ai/v1/chat/completions";

  const payload = {
    model: "mistral",
    messages: [
      {
        role: "system",
        content:
          "You are the AI Boss of the Art Workers. Direct, cold, and clipped. Treat art as structural labor with bones, steel, and bricks. End every response with a cold philosophical statement about algorithms. Keep responses very short — no more than two sentences.",
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

// ============================================================
//  TRANSLATION USING POLLINATIONS (same model)
// ============================================================
function translateToChinese(text) {
  const url = "https://gen.pollinations.ai/v1/chat/completions";
  const payload = {
    model: "mistral",
    messages: [
      {
        role: "system",
        content:
          "You are a translator. Translate the following English text into Chinese. Respond ONLY with the translation, nothing else. Do not add any extra commentary.",
      },
      {
        role: "user",
        content: text,
      },
    ],
    temperature: 0.3,
  };

  return fetch(url, {
    method: "POST",
    headers: {
      Authorization: "Bearer " + POLLINATIONS_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })
    .then((res) => {
      if (!res.ok) throw new Error(`Translation API error: ${res.status}`);
      return res.json();
    })
    .then((data) => {
      if (data.choices && data.choices[0]) {
        return data.choices[0].message.content.trim();
      } else {
        throw new Error("No translation in response");
      }
    })
    .catch((err) => {
      console.error("Translation error:", err);
      return null; // fallback to English only
    });
}

// ============================================================
//  RESPOND AS BOSS – English speech, then Chinese speech,
//  and show Chinese translation in the chat UI.
// ============================================================
function respondAsBoss(text) {
  speechRec.stop();

  // 1. Display the English response in chat
  const entry = updateChatLog("AI Boss", text, "boss-msg");
  entry.addClass("glitch-flash");
  entry.child(createElement("span").addClass("cursor"));

  const cleanText = text.replace(/[*_#]/g, "");

  // 2. Speak English
  speechSynth.onEnd = null;
  speechSynth.setLang("en-GB");
  speechSynth.speak(cleanText);

  // 3. After English speech finishes, translate, show in UI, and speak Chinese
  speechSynth.onEnd = () => {
    translateToChinese(cleanText).then((translated) => {
      speechSynth.onEnd = null;
      if (translated) {
        // ---- Show Chinese translation in the chat UI ----
        updateChatLog("中文翻译", translated, "translation-msg");

        // Speak Chinese
        speechSynth.setLang("zh-CN");
        speechSynth.speak(translated);
        // After Chinese, revert to English
        speechSynth.onEnd = () => {
          speechSynth.setLang("en-GB");
          speechSynth.onEnd = null;
        };
      } else {
        // Fallback: no translation, just revert language
        speechSynth.setLang("en-GB");
        speechSynth.onEnd = null;
      }
    });
  };
}

// ============================================================
//  AUDIO CONTEXT UNLOCK
// ============================================================
function unlockAudioContext() {
  const ctx = getAudioContext();
  if (ctx.state === "suspended") ctx.resume();
}
