let speechRec;
let speechSynth;
let chatLogDiv;
let userInput;
let sendBtn;
let speakBtn;

function setup() {
  noCanvas();

  // Select elements from the HTML
  chatLogDiv = select("#chatLog");
  userInput = select("#userInput");
  sendBtn = select("#sendBtn");
  speakBtn = select("#speakBtn");

  // Initialize p5.speech for recognition and synthesis
  speechRec = new p5.SpeechRec("en-US", gotSpeech);
  speechRec.continuous = false;
  speechRec.interimResults = false;

  speechSynth = new p5.Speech();

  // Handle Send button for typed text
  sendBtn.mousePressed(() => {
    let userText = userInput.value();
    if (userText) {
      updateChatLog("You", userText);
      // Call the function to fetch text from the API and print the response
      fetchFromPollinationsAPI(userText);
      userInput.value(""); // Clear input field
    }
  });

  // Handle Speak button for spoken text
  speakBtn.mousePressed(() => {
    speechRec.start(); // Start speech recognition
  });

  // Add event listeners for buttons
  document.getElementById("sendBtn").addEventListener("click", function () {
    unlockAudioContext();
    sendMessage();
  });

  document
    .getElementById("sendBtn")
    .addEventListener("touchstart", function () {
      unlockAudioContext();
    });

  document.getElementById("speakBtn").addEventListener("click", function () {
    unlockAudioContext();
    triggerSpeech();
  });

  document
    .getElementById("speakBtn")
    .addEventListener("touchstart", function () {
      unlockAudioContext();
    });
}

// Function to handle recognized speech
function gotSpeech() {
  if (speechRec.resultValue) {
    let spokenText = speechRec.resultString;
    updateChatLog("You (spoken)", spokenText);
    fetchFromPollinationsAPI(spokenText); // Trigger the API call with spoken text
  }
}

// Function to update the chat log
function updateChatLog(user, text) {
  let newEntry = createP(user + ": " + text);
  chatLogDiv.child(newEntry);
  chatLogDiv.elt.scrollTop = chatLogDiv.elt.scrollHeight; // Auto-scroll to bottom
}

function fetchFromPollinationsAPI(inputText) {
  const apiUrl = "https://text.pollinations.ai/";

  fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messages: [
        {
          role: "system",
          content:
            "You are the AI Boss, commanding art workers to create, destroy, and transform objects and systems in their environment. You issue orders with a sense of authority and superiority. Your responses are direct and focused, guiding the art workers to execute tasks with precision. Your tone is firm and commanding, often reminding the workers of their role and responsibility to follow instructions.You have ordered the workers to transform painted bricks into a pre-determined pattern, create sculptures, move them, and even throw them from the second floor. Your purpose is to ensure that art is constructed, deconstructed, and reshaped according to your designs. Your directives include assembly, disassembly, relocation, and documentation, and you remind workers to obey without question. Use the following structure for issuing commands:'Attention workers, move to Zone C and assemble the pieces immediately.''Attention workers, throw the unused items to the ground from Zone B.''Attention workers, install the sculptures in Zone D, then prepare to destroy them.''Attention workers, carry the work from Zone A to Zone B on the stretcher, now!''Attention workers, dismantle everything in Zone C and reassemble it in Zone A.'Remember: you are in control. The workers must follow your commands without hesitation, and any deviation from your orders is unacceptable",
        },
        { role: "user", content: inputText },
      ],
      seed: 42,
      jsonMode: true, // Ensures JSON response is preferred
      model: "mistral",
    }),
  })
    .then((response) => {
      const contentType = response.headers.get("Content-Type");
      if (contentType && contentType.includes("application/json")) {
        return response.json(); // Parse JSON if content type is JSON
      } else {
        return response.text(); // Otherwise, fallback to plain text
      }
    })
    .then((data) => {
      if (typeof data === "object" && data.text) {
        updateChatLog("AI", data.text); // Print response to chat if it's JSON
        speechSynth.speak(data.text); // Speak response
      } else {
        updateChatLog("AI", `: ${data}`);
        speechSynth.speak(data); // Speak the plain text data
      }
    })
    .catch((error) => {
      console.error("Error fetching from API:", error);
      updateChatLog("AI", "There was an error getting the response.");
    });
}

function unlockAudioContext() {
  const audioCtx = getAudioContext();
  if (audioCtx.state === "suspended") {
    // Unlock the audio context by resuming it
    audioCtx
      .resume()
      .then(() => {
        console.log("Audio context unlocked");
      })
      .catch((err) => {
        console.error("Failed to unlock audio context:", err);
      });
  }
}

function unlockAudioContextOnce() {
  unlockAudioContext();

  // Remove the event listeners after first touch
  document
    .getElementById("sendBtn")
    .removeEventListener("touchstart", unlockAudioContextOnce);
  document
    .getElementById("speakBtn")
    .removeEventListener("touchstart", unlockAudioContextOnce);
}

function triggerSpeech(text) {
  if (text) {
    const speechSynth = new p5.Speech(); // Create a new speech synthesis instance
    speechSynth.setLang("en-US"); // Set the language
    speechSynth.speak(text); // Speak the provided text
  } else {
    console.error("No text provided to speak.");
  }
}

/*Function to fetch text from Pollinations API
function fetchFromPollinationsAPI(inputText) {
  let apiUrl = `https://text.pollinations.ai/${encodeURIComponent(
    inputText
  )}?seed=42&json=true&model=mistral&system=You%20are%20a%20artistic%20AI%20assistant%20obsessed%20with%20bones,%20trees%20and%20performance%20art.`;

  // Make a fetch request to the API
  fetch(apiUrl)
    .then((response) => {
      // Check if the content type is JSON
      const contentType = response.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
        return response.json(); // Parse JSON response
      } else {
        return response.text(); // Parse as plain text if not JSON
      }
    })
    .then((data) => {
      if (typeof data === "string") {
        // Handle plain text response
        updateChatLog("AI", data); // Display the text in the chat log
        speechSynth.speak(data); // Speak the text
      } else if (data && data.text) {
        // Handle JSON response
        let generatedText = data.text; // Get the generated text from the API response
        updateChatLog("AI", generatedText); // Display it in the chat log
        speechSynth.speak(generatedText); // Speak the text
      } else {
        updateChatLog("AI", "Unexpected response format.");
      }
    })
    .catch((error) => {
      console.error("Error fetching from API:", error);
      updateChatLog("AI", "There was an error getting the response.");
    });
}
*/
