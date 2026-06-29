const API_KEY = "YOUR_GEMINI_API_KEY_HERE";
const MODEL = "gemini-2.5-flash";

const chatBox = document.getElementById("chatBox");
const userInput = document.getElementById("userInput");

// Conversation history
let history = [];

// Display messages
function addMessage(text, type) {

    const div = document.createElement("div");

    div.className = "message " + type;

    div.textContent = text;

    chatBox.appendChild(div);

    chatBox.scrollTop = chatBox.scrollHeight;

    return div;
}

// Send Message
async function sendMessage() {

    const message = userInput.value.trim();

    if (!message) return;

    addMessage(message, "user");

    userInput.value = "";

    const loading = addMessage("Thinking...", "bot");

    history.push({
        role: "user",
        parts: [
            {
                text: message
            }
        ]
    });

    try {

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    contents: history
                })
            }
        );

        const data = await response.json();

        console.log(data);

        loading.remove();

        if (!response.ok) {

            addMessage(
                data.error?.message || "Unknown API Error",
                "bot"
            );

            return;

        }

        const reply =
            data.candidates[0].content.parts[0].text;

        addMessage(reply, "bot");

        history.push({
            role: "model",
            parts: [
                {
                    text: reply
                }
            ]
        });

    }

    catch (error) {

        loading.remove();

        console.error(error);

        addMessage(error.message, "bot");

    }

}

// Press Enter
userInput.addEventListener("keypress", function(e) {

    if (e.key === "Enter") {

        sendMessage();

    }

});