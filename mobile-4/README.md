# 📔 Mobile 4 – Diary App: Auth & Database with Expo + Supabase

This module introduces **authentication** and **data persistence** through a diary application built with **React Native using Expo**, and powered by **Supabase** for both the database and OAuth authentication.

You’ll build secure login flows, manage user sessions, and implement the core logic for reading, creating, and deleting diary entries in a structured and persistent backend.

---

## 🧩 Exercises Overview

| Exercise | Title        | Description                                                              |
|---------:|--------------|--------------------------------------------------------------------------|
| ex00     | Login Page   | Add authentication (Google/GitHub) and redirect users accordingly.       |
| ex01     | Profile Page | Display, create, read, and delete diary entries from a Supabase backend. |

---

## 🔐 Tech Stack

- [Expo](https://expo.dev/)
- [Supabase](https://supabase.com/) – Auth & Database

---

## 🎬 Preview

![Diary App Preview](./docs/preview.gif)

---

## 🛠️ Installation

### 🔧 Requirements

- Node.js
- Expo CLI
- Supabase project (set up before launching)

### 📦 Installation & Launch

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up your Supabase project

3. Copy `.env.example` to `.env` and fill in your Supabase URL and API key.

4. Start in development mode:
   ```bash
   npx expo prebuild --clean
   npx expo run:ios # or npx expo run:android
   ```