# 📚 Bookmark Manager

A responsive and user-friendly **Bookmark Manager App** built using **HTML**, **Tailwind CSS**, and **Vanilla JavaScript**.  
It allows users to **add, edit, delete, sort, archive, and search** bookmarks with an intuitive interface.

---

## 🚀 Features

- 🔐 **Login / Signup System** (Local, not connected to backend)
- ➕ **Add / Edit / Delete Bookmarks**
- 📌 **Pin & Unpin Bookmarks**
- 🗃️ **Archive / Unarchive Bookmarks**
- 🔎 **Search Bookmarks by Title**
- 🏷️ **Tag Filtering System**
- 📊 **Sorting Options**
  - Recently Added
  - Recently Visited
  - Most Visited
- 🌓 **Light & Dark Theme Toggle**
- 📱 **Fully Responsive Layout (Mobile / Tablet / Desktop)**

---

## 🧠 Tech Stack

- **HTML5**
- **TailwindCSS**
- **Vanilla JavaScript (ES6+)**
- **JSON** (for local bookmark data)

---

## 📂 Folder Structure

```
project/
│
├── index.html
├── formula.js
├── data.json
├── src/
│   └── output.css
└── assets/
    └── images/
```

---

## ⚙️ How to Run

1. **Clone this repository**
   ```bash
   git clone https://github.com/yourusername/bookmark-manager.git
   cd bookmark-manager
   ```

2. **Open the project**
   Simply open `index.html` in your browser.

3. **(Optional)** For Tailwind changes, rebuild CSS:
   ```bash
   npx tailwindcss -i ./src/input.css -o ./src/output.css --watch
   ```

---

## 🧩 Data Format

Your bookmarks are stored in `data.json` as an array of objects:
```json
{
  "id": "bm-001",
  "title": "GitHub",
  "url": "https://github.com",
  "favicon": "./assets/images/favicon-github.png",
  "description": "Where the world builds software.",
  "tags": ["Tools", "Community", "Git"],
  "pinned": false,
  "isArchived": false,
  "visitCount": 198,
  "createdAt": "2024-01-05T06:00:00Z",
  "lastVisited": "2025-09-24T15:30:00Z"
}
```

---

## 🎨 UI Preview

- **Login Page**
- **Signup Page**
- **Bookmark Dashboard**
- **Add/Edit Modal**
- **Dark/Light Theme Modes**

---

## 🧰 Future Improvements

- 🌐 Connect to backend (Firebase / MongoDB)
- 👤 Multi-user authentication
- ☁️ Cloud sync and import/export bookmarks
- 📱 PWA support (installable app)

---

## 👨‍💻 Author

**Hafizur Rahman**  
Full Stack Developer | Passionate about clean UI and efficient code.  
📧 [tonmoy.a009@gmail.com]  
🔗 [LinkedIn](https://www.linkedin.com/in/md-hafizur-rahman-69b723258/) • [GitHub](https://github.com/tonmoystark)
