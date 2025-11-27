# Bookmark Manager – Project Documentation

---

## 1. Overview

This app helps users **manage and organize bookmarks** efficiently.  
It uses a **login/signup UI**, and once logged in, users can **create, view, and manage** bookmarks with multiple functionalities (search, sort, pin, archive, edit, delete, etc.).

---

## 2. Core Files

### 🧩 `index.html`
- Contains **all UI structure**:
  - Login Form
  - Signup Form
  - Password Reset
  - Dashboard (Bookmarks, Sidebar, Profile)
  - Add/Edit Modal

It connects the UI with logic through:
```html
<script src="./formula.js"></script>
```

---

### ⚙️ `formula.js`
Handles **all interactivity and logic** such as:
- Authentication simulation
- Dynamic bookmark loading from `data.json`
- CRUD operations (Create, Read, Update, Delete)
- Sorting, searching, and filtering
- UI updates and state management
- Theme toggling and local storage

#### Key Functions:

| Function | Description |
|----------|--------------|
| `loadBookmarks()` | Loads bookmarks from `data.json` and displays them dynamically |
| `createBookmarkCard()` | Builds HTML for each bookmark card |
| `sortBookmarks()` | Sorts by "recent add", "recent visit", or "most visit" |
| `updateVisitStats()` | Increments visit count and updates last visited date |
| `togglePinStatus()` | Pins or unpins a bookmark |
| `toggleArchiveStatus()` | Moves bookmark to/from archive |
| `deleteBookmark()` | Deletes a bookmark |
| `showNotification()` | Displays toast messages on actions |
| `initializeBookmarkModal()` | Handles Add/Edit bookmark modal functionality |
| `initializeSearch()` | Filters bookmarks based on search term |

---

### 🗂️ `data.json`
- Acts as a **local data source** (like a small database)
- Contains all bookmark entries with metadata
- Example fields:
  - `id`, `title`, `url`, `favicon`, `description`
  - `tags` → used for tag filtering
  - `pinned`, `isArchived` → boolean status
  - `visitCount`, `createdAt`, `lastVisited` → analytics info

---

## 3. Authentication (Frontend Only)
- Login and Signup handled purely on frontend (no real backend)
- Credentials stored in variables during the session
- Password reset feature allows temporary password change

---

## 4. Sorting and Filtering
- **Sorting:**  
  - `recentAdd` → newest added first  
  - `recentVisit` → most recently visited first  
  - `mostVisit` → highest visit count first

- **Filtering:**  
  Sidebar tags can filter bookmarks by specific tags.

---

## 5. Theme System
- Light and Dark theme toggle using localStorage:
  ```js
  const savedDarkMode = localStorage.getItem('darkMode') === 'true';
  if (savedDarkMode) applyDarkTheme();
  else applyLightTheme();
  ```

---

## 6. Notifications
Custom toast notifications appear for user feedback (e.g., “Bookmark added successfully”).

---

## 7. Responsiveness
The layout uses **TailwindCSS** classes with a mobile-first approach:
- Sidebar collapses on smaller screens
- Hamburger menu toggles sidebar visibility

---

## 8. Data Flow
```
data.json → loadBookmarks() → createBookmarkCard() → render → user action → update → refreshCurrentView()
```

---

## 9. Known Limitations
- Data not persistent after refresh (no backend)
- Only one demo user session at a time
- No real authentication or encryption

---

## 10. License
This project is open source and free to use for educational or personal purposes.

---

**End of Documentation**
