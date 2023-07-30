document.addEventListener('DOMContentLoaded', () => {
  const chatbox = document.getElementById('chatBox');
  const chatForm = document.getElementById('chatForm');
  const userInput = document.getElementById('userInput');

  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const userMessage = userInput.value.trim();
    if (userMessage !== '') {
      appendMessage('user', userMessage);
      userInput.value = '';
      fetchChatbotReply(userMessage);
    }
  });

  function appendMessage(role, message) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add(role);
    messageDiv.innerText = message;
    chatbox.appendChild(messageDiv);
  }

  async function fetchChatbotReply(userMessage) {
    try {
      const response = await fetch('/api/openai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ user: userMessage })
      });

      if (!response.ok) {
        throw new Error('Failed to get response from the server.');
      }

      const data = await response.json();

      console.log(data);

      const chatbotReply = data.choices[0].message.content;

      console.log(chatbotReply);

      appendMessage('system', chatbotReply);

    } catch (error) {
      console.error(error);
    }
  }
});
