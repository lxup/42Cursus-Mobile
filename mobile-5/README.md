# 📅 Mobile 5 – Diary App: Dashboard & Agenda View with Expo + Supabase

This module expands the diary app built in Module 04 by adding **advanced data visualization**, **user statistics**, and an **interactive calendar-based agenda**.

The app is now composed of 3 pages:

1. Login Page
2. Profile Page (dashboard overview)
3. Agenda Page (calendar + entries by date)

---

## 🧩 Exercises Overview

| Exercise | Title        | Description                                                                 |
|---------:|--------------|-----------------------------------------------------------------------------|
| ex00     | Profile Page | Display user data, stats, recent entries, and real-time updates.            |
| ex01     | Agenda Page  | Calendar view with selectable dates and entry filtering by day.             |

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