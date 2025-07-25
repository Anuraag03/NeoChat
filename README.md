# NeoChat

![NeoChat Logo](/image.png)
# NeoChat

NeoChat is a real-time chat application with a Matrix-style animated background, built using React and Socket.io.

## Features
- Real-time messaging
- Username Choice
- Matrix animation background
- Responsive UI

---

## Requirements
- Node.js (v18 or higher recommended)
- npm (v9 or higher recommended)

---

## Getting Started

### 1. Clone the Repository

```
git clone https://github.com/<your-username>/NeoChat.git
cd NeoChat
```

### 2. Install Dependencies

Install dependencies for both client and server:

```
cd client
npm install
cd ../server
npm install
```

### 3. Environment Variables

Create a `.env` file in the `server` directory. Example:

```
PORT=3000
MONGO_URL=your_mongodb_url
```



### 4. Running the Application

#### Start the Server

```
cd server
npm start
```

#### Start the Client

Open a new terminal window:

```
cd client
npm run dev
```

The client will run on [http://localhost:5173](http://localhost:5173) (default Vite port).
The server will run on [http://localhost:3000](http://localhost:3000).

---

## Usage
- Register a username to join the chat.
- Send messages in real time.
- Enjoy the animated Matrix background!

---

## Troubleshooting
- Make sure both server and client are running.
- Check `.env` for correct configuration.
- If you change ports, update the client socket connection URL in `client/src/App.jsx`.

---

## License
MIT
# NeoChat
A live message board application using Socket.IO , MongoDB, Express , React and Node.js
