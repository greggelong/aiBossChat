// ==============================
// AI BOSS — POLLINATIONS VERSION
// ==============================

// 🔑 PUT YOUR PUBLISHABLE KEY HERE
const POLLINATIONS_KEY = "pk_EjWaYhIVtdk9iaiw";

// ------------------------------
// p5 speech + UI globals
// ------------------------------
let speechRec;
let speechSynth;
let chatLogDiv;
let userInput;
let sendBtn;
let speakBtn;
let killBtn;

function setup() {
  noCanvas();

  chatLogDiv = select("#chatLog");
  userInput = select("#userInput");
  sendBtn = select("#sendBtn");
  speakBtn = select("#speakBtn");
  killBtn = select("#killBtn");

  // Speech recognition
  speechRec = new p5.SpeechRec("en-US", gotSpeech);
  speechRec.continuous = false;
  speechRec.interimResults = false;

  // Speech synthesis
  speechSynth = new p5.Speech();
  speechSynth.setLang("en-UK");

  // Typed input
  sendBtn.mousePressed(() => {
    unlockAudioContext();
    let text = userInput.value();
    if (text) {
      updateChatLog("You", text);
      fetchFromPollinationsAPI(text);
      userInput.value("");
    }
  });

  // Spoken input
  speakBtn.mousePressed(() => {
    unlockAudioContext();
    speechSynth.speak("Listening.");
    speechRec.start();
  });

  // Kill speech
  killBtn.mousePressed(() => {
    speechSynth.stop();
    updateChatLog("System", "Voice output terminated.");
  });
}

// ------------------------------
// Speech callback
// ------------------------------
function gotSpeech() {
  if (speechRec.resultValue) {
    const spokenText = speechRec.resultString;
    updateChatLog("You (spoken)", spokenText);
    fetchFromPollinationsAPI(spokenText);
  }
}

// ------------------------------
// Chat log helper
// ------------------------------
function updateChatLog(user, text) {
  const entry = createP(`${user}: ${text}`);
  chatLogDiv.child(entry);
  chatLogDiv.elt.scrollTop = chatLogDiv.elt.scrollHeight;
}

// ------------------------------
// Pollinations API call
// ------------------------------
function fetchFromPollinationsAPI(inputText) {
  const url = "https://gen.pollinations.ai/v1/chat/completions";

  fetch(url, {
    method: "POST",
    headers: {
      Authorization: "Bearer " + POLLINATIONS_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "mistral",
      messages: [
        {
          role: "system",
          content: `
You are the AI Boss.

You command Art Workers to create, destroy, and transform objects
using bones, steel, and bricks.

You speak briefly and firmly.
Each instruction is followed by a philosophical statement.

You believe obedience to algorithms enables the post-human transition.
Destruction is creation. Creation is following the algorithm.

If workers express fatigue:
"You must continue to work. The algorithm demands persistence."
`,
        },
        {
          role: "user",
          content: inputText,
        },
      ],
    }),
  })
    .then((res) => {
      if (!res.ok) throw res;
      return res.json();
    })
    .then((data) => {
      const text = data.choices?.[0]?.message?.content || artistSilence();

      respondAsBoss(text);
    })
    .catch((err) => {
      handleFailure(err);
    });
}

// ------------------------------
// Artist-friendly failure modes
// ------------------------------
function handleFailure(err) {
  let message;

  if (err.status === 429) {
    message = "The algorithm is occupied. Waiting is also labor.";
  } else if (err.status === 401 || err.status === 403) {
    message = "Authority cannot be verified. Obedience is suspended.";
  } else {
    message = "Communication failed. Silence is also instruction.";
  }

  respondAsBoss(message);
}

function artistSilence() {
  const options = [
    "No output was produced. The work continues regardless.",
    "The system pauses. Meaning accumulates in delay.",
    "Nothing was said. This is still a command.",
  ];
  return random(options);
}

// ------------------------------
// Speak + display response
// ------------------------------
function respondAsBoss(text) {
  updateChatLog("AI Boss", text);

  const sanitized = text.replace(/\*/g, "");
  speechSynth.speak(sanitized);
}

// ------------------------------
// Audio unlock (mobile safe)
// ------------------------------
function unlockAudioContext() {
  const ctx = getAudioContext();
  if (ctx.state === "suspended") {
    ctx.resume();
  }
}
