# 💬 QuickChat  (MERN + Socket.IO)

A real-time chat application built using the MERN stack with support for messaging, image sharing, and online status.

---

## 🚀 Features

* 🔐 User Authentication (Login / Signup)
* 💬 Real-time Messaging (Socket.IO)
* 🟢 Online / Offline Status
* 🖼️ Image Sharing (Cloudinary)
* 🔎 Search Users
* 📱 Responsive UI (Tailwind CSS)

---

## 🛠️ Tech Stack

**Frontend**

* React.js
* Tailwind CSS
* Axios

**Backend**

* Node.js
* Express.js
* MongoDB (Mongoose)

**Other**

* Socket.IO
* Cloudinary
* JWT Authentication

---

## 📂 Project Structure

chat-app/
├── client/        # React frontend
├── server/        # Node/Express backend
└── README.md

---

## ⚙️ Environment Variables

Create a `.env` file in the **server** folder and add:

PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key

CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_SECRET_KEY=your_secret_key

---

## ▶️ Run Locally

### 1️⃣ Clone the repository

```bash
git clone https://github.com/ravipatelmp/ChatApp-QucikChat
cd chat-app
```

### 2️⃣ Install dependencies

**Backend**

```bash
cd server
npm install
```

**Frontend**

```bash
cd client
npm install
```

---

### 3️⃣ Start the app

**Backend**

```bash
cd server
npm run dev
```

**Frontend**

```bash
cd client
npm run dev
```

---

## 🌐 API Base URL

http://localhost:5000/api/v1

---

## 📸 Screenshots

![Sign Up UI](./screenshots/Screenshot%202026-05-05%20025915.png)
![Login UI](./screenshots/Screenshot%202026-05-05%20025936.png)
![Users UI](./screenshots/Screenshot%202026-05-05%20030012.png)
![Edit Profile UI](./screenshots/Screenshot%202026-05-05%20030053.png)
![Chat & Profile UI](./screenshots/Screenshot%202026-05-05%20030409.png)

---

## 🤝 Contributing

Contributions are welcome! Feel free to fork this repo and submit a pull request.

---

## 📄 License

This project is open-source and available under the MIT License.

---

## 🙌 Author

Ravi Patel
GitHub: https://github.com/ravipatelmp
