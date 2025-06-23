<template>
  <div>
    <div ref="chatRef" class="chat-block">
      <div
          v-for="(msg, index) in messages"
          :key="index"
          class="chat-message"
          :class="[msg.role === 'user' ? 'from-user' : 'from-bot', msg.role === 'bot' ? 'full-width' : '']"
      >
        <template v-if="msg.type === 'text'">
          <div v-html="formatMessage(msg.content)" class="chat-text"></div>
        </template>
        <template v-else-if="msg.type === 'image'">
          <img :src="msg.content" class="chat-image" />
        </template>
      </div>
    </div>

    <div class="input-block">
      <textarea
          ref="textAreaRef"
          v-model="inputText"
          class="input-chat"
          placeholder="Введите сообщение..."
          @paste="handlePaste"
      ></textarea>

      <input type="file" @change="handleFileUpload" accept="image/*" />

      <div v-if="previewImage" class="preview-image-block">
        <img :src="previewImage" class="preview-image" />
        <button class="remove-image-button" @click="removeImage">✕</button>
      </div>

      <button @click="sendMessage">Отправить</button>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted } from 'vue'

const messages = ref([])
const inputText = ref('')
const imageFile = ref(null)
const previewImage = ref(null)
const chatRef = ref(null)

const chatDays = ref([])

onMounted(() => {
  fetchDays()
})

async function fetchDays() {
  const res = await fetch('/chat/sessions')
  chatDays.value = await res.json()
}


function formatMessage(text) {
  const escaped = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')

  return escaped
      .replace(/```([a-z]*)\n([\s\S]*?)```/g, (_match, lang, code) => {
        return `<pre style="background: #f0f0f0; padding: 10px; border-radius: 10px" class='code-block'><code>${code.trim()}</code></pre>`
      })
      .replace(/\n/g, '<br>')
}

async function sendMessage() {
  const userMessage = inputText.value.trim()
  const userImage = imageFile.value

  if (!userMessage && !userImage) return

  if (userMessage) {
    messages.value.push({ type: 'text', content: userMessage, role: 'user' })
  }

  if (userImage) {
    messages.value.push({ type: 'image', content: userImage, role: 'user' })
  }

  inputText.value = ''
  imageFile.value = null
  previewImage.value = null

  scrollToBottom()

  try {
    const response = await fetch('/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: userMessage || undefined,
        image: userImage?.split(',')[1] || undefined
      })
    })

    const result = await response.text()

    messages.value.push({ type: 'text', content: result, role: 'bot' })
    scrollToBottom()
  } catch (error) {
    console.log(error)
    messages.value.push({
      type: 'text',
      content: 'Ошибка при получении ответа от сервера.',
      role: 'bot'
    })
    scrollToBottom()
  }
}

function handlePaste(event) {
  const items = event.clipboardData?.items
  if (!items) return

  for (const item of items) {
    if (item.type.indexOf('image') === 0) {
      const file = item.getAsFile()
      const reader = new FileReader()
      reader.onload = () => {
        imageFile.value = reader.result
        previewImage.value = reader.result
      }
      reader.readAsDataURL(file)
    }
  }
}

function handleFileUpload(event) {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = () => {
      imageFile.value = reader.result
      previewImage.value = reader.result
    }
    reader.readAsDataURL(file)
  }
}

function removeImage() {
  imageFile.value = null
  previewImage.value = null
}

function scrollToBottom() {
  nextTick(() => {
    if (chatRef.value) {
      chatRef.value.scrollTop = chatRef.value.scrollHeight
    }
  })
}
</script>

<style scoped>
.chat-block {
  position: absolute;
  margin-left: 370px;
  width: 800px;
  height: 500px;
  border: 1px solid #d0d0d0;
  border-radius: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px;
  background: #f9f9f9;
}

.chat-message {
  background: white;
  padding: 10px 15px;
  border-radius: 10px;
  word-wrap: break-word;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.05);
  max-width: 45%;
  width: fit-content;
  overflow-wrap: break-word;
}

.full-width {
  max-width: 100% !important;
}

.chat-text {
  white-space: pre-wrap;
  font-family: inherit;
  font-size: 14px;
  line-height: 1.4;
  overflow-wrap: break-word;
}

.code-block {
  background: #f0f0f0;
  padding: 10px;
  border-radius: 6px;
  font-family: monospace;
  overflow-x: auto;
  margin-top: 5px;
  white-space: pre;
}

.from-user {
  align-self: flex-end;
  background-color: #daf1ff;
}

.from-bot {
  align-self: flex-start;
  background-color: #ffffff;
}

.chat-image {
  max-width: 100%;
  border-radius: 10px;
  margin-top: 10px;
}

.preview-image-block {
  margin-top: 5px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.preview-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid #ccc;
}

.remove-image-button {
  background: #ff4d4f;
  border: none;
  color: white;
  padding: 5px 10px;
  font-size: 16px;
  border-radius: 8px;
  cursor: pointer;
}

.input-block {
  position: absolute;
  bottom: 30px;
  margin-left: 370px;
  width: 820px;
  min-height: 150px;
  border: 1px solid #cecece;
  border-radius: 20px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  padding: 10px;
  gap: 10px;
  background: white;
}

.input-chat {
  width: 100%;
  min-height: 95%;
  resize: none;
  border: none;
  padding: 10px;
  box-sizing: border-box;
  outline: none;
  font-size: 16px;
  border-radius: 0;
  flex: 1;
}
</style>