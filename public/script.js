// Define a unique userId for this session
const userId = `user-${Math.random().toString(36).substr(2, 9)}`;

// Get DOM elements
const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

// Flag to track if a message is being processed
let isProcessing = false;

// Function to append messages to the chat box
function appendMessage(content, sender) {
  const messageDiv = document.createElement("div");
  messageDiv.classList.add("message", sender);
  
  // Format the content: this will handle adding paragraphs and newlines.
  messageDiv.innerHTML = formatContent(content);
  
  chatBox.appendChild(messageDiv);
  chatBox.scrollTop = chatBox.scrollHeight; // Scroll to the bottom
  return messageDiv;  // Return the message div for later modification
}

// Function to format the AI response content
function formatContent(content) {
  // Replace multiple newlines or a specific formatting with <p> tags or <br> as needed
  return content
    .split("\n")
    .map(paragraph => `<p>${paragraph}</p>`)
    .join(""); // Join paragraphs with <p> tags
}

// Function to handle sending messages
async function sendMessage() {
  if (isProcessing) return; // Prevent sending another message if already processing
  const message = userInput.value.trim();
  if (message === "") return;

  // Set the flag to indicate processing state
  isProcessing = true;

  // Append the user's message to the chat box
  const userMessage = appendMessage(message, "user");
  userInput.value = ""; // Clear the input field

  // Disable the send button and change its text
  sendBtn.disabled = true;
  sendBtn.textContent = "Asteapta";

  // Append the "AI is thinking..." message
  const thinkingMessage = appendMessage("Zenithra se gandeste...", "bot");

  try {
    // Make the request to the backend for AI response
    const response = await fetch("/api/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: message, userId }),
    });

    if (response.ok) {
      const data = await response.json();
      // Update the "AI is thinking..." message with the actual AI response
      thinkingMessage.innerHTML = formatContent(data.reply);
    } else {
      // If an error occurs, update the message
      thinkingMessage.textContent = "Error: Unable to fetch response from AI.";
    }
  } catch (error) {
    console.error("Error sending message:", error);
    thinkingMessage.textContent = "Error: Something went wrong. Try again later.";
  } finally {
    // Re-enable the send button after the response is received
    sendBtn.disabled = false;
    sendBtn.textContent = "Trimite"; // Reset the button text

    // Reset the processing flag
    isProcessing = false;
  }
}

// Attach event listeners
sendBtn.addEventListener("click", sendMessage);
userInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") sendMessage();
});
