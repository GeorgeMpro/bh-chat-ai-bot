# 🤖 BH Chat Ai Bot

A real-time chat application with an AI-powered bot that assists with Angular and frontend development questions. Built with Angular, Node.js, Socket.IO, and Google's Gemini AI.

![Angular](https://img.shields.io/badge/Angular-18-red)
![Node.js](https://img.shields.io/badge/Node.js-20-green)
![NX](https://img.shields.io/badge/NX-Monorepo-blue)
![Socket.IO](https://img.shields.io/badge/Socket.IO-4.0-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)

--````-

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Bot Personality](#bot-personality)
- [What's Implemented](#whats-implemented)
- [Future Enhancements](#future-enhancements)
- [Testing](#testing)

---

## ✨ Features

### Core Functionality

- **Real-time Chat**: Instant message synchronization using WebSocket (Socket.IO)
- **AI-Powered Bot**: Senior frontend developer bot powered by Google Gemini AI
- **User Authentication**: Simple username and avatar selection (no backend auth required)
- **Emoji Avatars**: 20 unique emoji avatars to choose from
- **Message History**: Persistent chat history during session
- **Typing Indicators**: Visual feedback for message sending
- **Profanity Filter**: Automatic filtering of inappropriate content
- **System Notifications**: Connection status and user activity updates

---

## 🛠 Tech Stack

### Frontend

- **Angular 18** - Modern component-based framework
- **TypeScript 5.0** - Type-safe development
- **RxJS** - Reactive programming for real-time updates
- **Socket.IO Client** - WebSocket communication
- **SCSS** - Advanced styling with variables and mixins

### Backend

- **Node.js 20** - JavaScript runtime
- **Express** - Web server framework
- **Socket.IO** - Real-time bidirectional communication
- **Google Gemini AI** - AI-powered bot responses
- **Bad-words** - Profanity filtering

### Development Tools

- **NX Monorepo** - Workspace management and build optimization
- **Jest** - Unit testing framework
- **ESLint** - Code quality and consistency
- **Prettier** - Code formatting

---

## 🏗 Architecture

### Client-Server Communication

```
┌─────────────────┐         WebSocket         ┌─────────────────┐
│                 │◄──────────────────────────►│                 │
│  Angular Client │    Socket.IO Protocol      │   Node.js API   │
│                 │                             │                 │
└────────┬────────┘                             └────────┬────────┘
         │                                               │
         │ Components                                    │ Services
         │ Services                                      │ Bot Logic
         │ Models                                        │ AI Integration
         └───────────────────────────────────────────────┘
```

### Data Flow

```
User Input → MessageInputComponent 
    → ChatComponent 
    → SocketService 
    → Server (chat.service)
    → Broadcast to all clients
    → SocketService (receive)
    → ChatComponent (update)
    → MessageListComponent (display)
```

### State Management

- **UserService**: Manages user authentication and avatar selection
- **SocketService**: Handles WebSocket connections and message transmission
- **ChatComponent**: Central state management with Angular signals
- **LocalStorage**: Persists user data across sessions

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20.x or higher
- npm or yarn
- Gemini API key (for bot functionality)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/GeorgeMpro/bh-chat-ai-bot

cd bh-chat-ai-bot
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory:

```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3000
```

4. **Run the development servers**

Start both frontend and backend:

```bash
# Terminal 1 - Frontend (Angular)
npx nx serve bh-chat-ai-bot

# Terminal 2 - Backend (Node.js)
npx nx serve api
```

5. **Open your browser**

```
http://localhost:4200
```

### Production Build

```bash
# Build frontend
npx nx build bh-chat-ai-bot

# Build backend
npx nx build api

# Run production
npm run start:prod
```

---

## 📁 Project Structure

```
bh-chat-ai-bot/
├── apps/
│   ├── bh-chat-ai-bot/              # Angular Frontend
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── components/       # UI Components
│   │   │   │   │   ├── chat/
│   │   │   │   │   ├── chat-header/
│   │   │   │   │   ├── login/
│   │   │   │   │   ├── message-input/
│   │   │   │   │   ├── message-item/
│   │   │   │   │   └── message-list/
│   │   │   │   ├── services/         # Business Logic
│   │   │   │   │   ├── socket.service.ts
│   │   │   │   │   └── user.service.ts
│   │   │   │   └── models/           # Data Models
│   │   │   │       └── message.model.ts
│   │   │   └── styles/               # Global Styles
│   │   └── project.json
│   │
│   └── api/                          # Node.js Backend
│       ├── src/
│       │   ├── main.ts               # Server Entry Point
│       │   └── services/
│       │       ├── chat.service.ts   # Chat Logic
│       │       └── bot.service.ts    # AI Bot Integration
│       └── project.json
│
├── nx.json                           # NX Configuration
├── package.json
└── README.md
```

---

## 🤖 Bot Personality

The AI bot is designed with a unique personality:

- **Expertise**: Senior Angular developer with deep knowledge of:
  - Angular, React, Vue
  - TypeScript, JavaScript
  - RxJS, State Management
  - HTML, CSS, Modern Web APIs

- **Personality Traits**:
  - Enthusiastic but slightly sarcastic 😏
  - Concise responses (2-3 sentences for simple questions)
  - Detailed explanations for complex topics
  - Occasional tech jokes and emojis 🚀
  - Professional yet approachable

- **Behavior**:
  - Only responds to frontend development questions
  - Politely redirects off-topic conversations
  - Provides code examples when helpful
  - Encourages best practices

### Bot Trigger Keywords

The bot responds when messages contain:

- Question words: `how`, `what`, `why`, `?`
- Tech keywords: `angular`, `react`, `typescript`, `component`, `rxjs`, `css`, etc.

---

## 🔮 Future Enhancements

### Planned Features

- [ ] **Message Reactions**: Quick emoji reactions (👍, ❤️, 😂, etc.)
- [ ] **Message Editing**: Edit sent messages with history tracking
- [ ] **Message Deletion**: Delete own messages
- [ ] **User List**: See all connected users with their avatars
- [ ] **Typing Indicators**: "User is typing..." status
- [ ] **Read Receipts**: Message read status
- [ ] **Code Syntax Highlighting**: For code snippets in messages
- [ ] **File Sharing**: Upload and share images/files
- [ ] **Voice Messages**: Record and send audio messages
- [ ] **Message Search**: Search through chat history
- [ ] **Dark Mode Toggle**: User preference for theme
- [ ] **Custom Themes**: Multiple color scheme options
- [ ] **Notification Sounds**: Audio feedback for new messages
- [ ] **Message Persistence**: Database integration for history
- [ ] **User Authentication**: OAuth integration (Google, GitHub)

### Bot Enhancements

- [ ] **Context Awareness**: Remember conversation context
- [ ] **Code Execution**: Run code snippets safely
- [ ] **Multi-language Support**: Respond in different languages
- [ ] **Personality Modes**: Switch between different bot personalities
- [ ] **Custom Commands**: `/help`, `/commands`, etc.
- [ ] **Bot Training**: Learn from chat interactions
- [ ] **Multiple AI Models**: Switch between different AI providers

---

## 🧪 Testing

### Unit Tests

```bash
# Run all tests
npx nx test

# Run specific project tests
npx nx test bh-chat-ai-bot
npx nx test api

# Run with coverage
npx nx test --coverage
```

## 📝 Documentation

### API Documentation

#### Socket Events

**Client → Server**

```typescript
// Send message
socket.emit('sendMessage', {
  text: string,
  username: string,
  avatar: string
}, callback)
```

**Server → Client**

```typescript
// Receive message
socket.on('message', (message: ServerMessage | string) => {
  // Handle message
})
```
