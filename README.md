# AI Boss Chat 🎙️🤖

> Command the Art Workers through voice or text. The AI Boss speaks English, then translates into Chinese — all powered by Pollinations.ai.

**Live Demo:** [https://greggelong.github.io/aiBossChat/](https://greggelong.github.io/aiBossChat/)

---

## 📖 Description

**AI Boss Chat** is an interactive voice-and-text chatbot that puts you in command of a fictional workforce of "Art Workers." You issue orders — by typing or speaking — and the AI Boss responds with cold, clipped, authoritative directives. The Boss commands workers to build, dismantle, and reshape sculptures using bones, steel, and bricks, all while delivering grim philosophical pronouncements about algorithms and the post-human future.

The app integrates **Pollinations.ai** for:

- **Text Generation** – The Boss’s responses are generated via Pollinations’ `/v1/chat/completions` endpoint.
- **Translation** – Each English response is translated into Chinese using the same Pollinations model.
- **Speech Synthesis** – The Boss speaks first in English, then in Chinese, using the browser's Web Speech API.

All interactions are logged in a chat interface, with the Chinese translation displayed directly beneath the English response.

---

## ✨ Features

- **Voice & Text Input** – Speak or type your commands.
- **Dual-Language Speech** – The Boss speaks in English, then repeats in Chinese.
- **Chinese Translation Display** – The Chinese version appears in the chat UI.
- **Voice Commands** – Say "Report" to trigger a status update.
- **Kill Switch** – Emergency stop for all voice activity.
- **No Sign‑up Required** – Just open the page and start commanding.

---

## 🛠️ How It Works

1. **User Input** – You type or speak a message.
2. **Pollinations API Call** – The app sends your input to Pollinations’ chat completions endpoint with a custom system prompt that defines the AI Boss persona.
3. **English Response** – The Boss replies in English (displayed in the chat).
4. **Translation** – The English response is sent back to Pollinations with a translation prompt, returning Chinese text.
5. **Speech Output** – The Boss speaks the English response, then the Chinese translation, using the browser’s Speech Synthesis API.
6. **Chat Log** – Both the English and Chinese versions appear in the chat interface.

---

## 🔗 Pollinations.ai Integration

This app uses the **Pollinations.ai API** for all generative AI functionality:

| Feature         | Endpoint                    | Purpose                     |
| --------------- | --------------------------- | --------------------------- |
| Text Generation | `POST /v1/chat/completions` | Generate Boss responses     |
| Translation     | `POST /v1/chat/completions` | Translate English → Chinese |

**Authentication:** The app uses a publishable API key (`pk_`) in the `Authorization: Bearer` header.

**Model:** `mistral` – chosen for its strong performance on both creative text generation and translation tasks.

---

## 🚀 Getting Started

### Prerequisites

- A modern web browser (Chrome, Edge, or Firefox recommended).
- A Pollinations.ai API key (sign up at [enter.pollinations.ai](https://enter.pollinations.ai)).

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/greggelong/aiBossChat.git
   ```
2. Open `index.html` in your browser.
3. Set your Pollinations API key in the JavaScript (or via environment variable).

### Usage

- **Type** a message in the input field and press Enter or click Send.
- **Click the microphone** button to speak your command.
- **Click "Report"** to have the Boss give a status update.
- **Click the kill button** to stop all speech immediately.

---

## 📁 Repository Structure

```
aiBossChat/
├── index.html          # Main HTML file
├── sketch.js           # p5.js application logic
├── style.css           # Custom styling
└── README.md           # This file
```

---

## 🙏 Credits

- **Pollinations.ai** – For providing the generative AI API that powers the Boss’s responses and translations.
- **p5.js** – For the creative coding framework.
- **p5.speech** – For speech recognition and synthesis bindings.

---

## 📜 License

This project is open source and available under the [MIT License](LICENSE).

---

## 📬 Contact

- **Author:** Greggelong
- **GitHub:** [https://github.com/greggelong](https://github.com/greggelong)
- **Live App:** [https://greggelong.github.io/aiBossChat/](https://greggelong.github.io/aiBossChat/)

---

## 🏷️ Built With Pollinations.ai

[![Built With Pollinations.ai](https://img.shields.io/badge/Built%20With-Pollinations.ai-000000?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCIgdmlld0JveD0iMCAwIDQwIDQwIj48cGF0aCBkPSJNMjAgM0wzIDM3aDM0TDIwIDN6IiBmaWxsPSIjZmZmIi8+PC9zdmc+)](https://pollinations.ai)

---

> _"Destruction is creation, and creation is following the algorithm."_ — The AI Boss
