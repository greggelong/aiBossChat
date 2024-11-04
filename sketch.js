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

// Function to fetch text from Pollinations API
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
