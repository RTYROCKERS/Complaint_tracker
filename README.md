# 🎪 Circus of Wonders – AI-Powered Complaint Tracking Web Application

> **A civic-tech platform that empowers citizens to report, track, and visualize public complaints — now enhanced with self-implemented AI models for intelligent automation and insight generation.**

---

## 🌐 Live Website  
**👉 [https://complaint-tracker-two.vercel.app/](https://complaint-tracker-two.vercel.app/)**  

Explore the live deployed version of **Circus of Wonders** and experience how technology and AI can make civic management smarter.

---

## 🌍 Overview

**Circus of Wonders** is a full-stack complaint tracking web application designed to help citizens report real-world civic issues such as **garbage dumping**, **potholes**, **streetlight outages**, and more.  

Officials can visualize data through **AI-enhanced analytics, Heatmaps, and LiveStat dashboards**.  
The system integrates **self-implemented AI models** for **complaint classification, summarization, recommendation, and analysis**, delivering smart insights for both citizens and administrators.

---

## 🤖 AI-Driven Features (All Models Implemented In-House)

This system integrates **four self-developed AI models** — designed and implemented manually, **without using any APIs, pre-trained libraries, or Google services**.  

### 1️⃣ AI-Based Image Classification
- Predicts the **type of problem** in a complaint based on the **uploaded image**.
- Automatically detects categories like:
  - Garbage
  - Road Damage
  - Streetlight Issues
  - Waterlogging
  - Infrastructure Problems  
- Built using a **custom CNN (Convolutional Neural Network)** trained on real-world complaint datasets.

### 2️⃣ AI Complaint Summarization
- Generates a **concise and meaningful summary** of each complaint after it has been resolved.
- Summaries are automatically stored and displayed in the complaint history.
- Uses a **custom NLP-based text summarization model** trained on real civic complaint text data.

### 3️⃣ AI Recommendation System
- Provides **recommendations for corrective actions or improvements** based on:
  - Complaint category
  - Frequency of issues
  - Historical data from similar cases
- Helps officials decide **what preventive actions** can be taken to reduce future complaints.

### 4️⃣ AI Post Analysis & Feedback Generator
- After complaint resolution, this model:
  - Evaluates complaint patterns
  - Generates **post-resolution insights and feedback**
  - Helps the system continuously improve future complaint handling efficiency

🧠 All models were **fully trained, optimized, and integrated manually** — no APIs, no pre-trained services, and no cloud inference systems were used.

---

## 🚀 Key Functional Features

### 🔐 Dual Login System
- **Google Login** – Secure sign-in using Google OAuth.  
- **Aadhaar-Based Login** – Traditional login with **custom Aadhaar number validation**, ensuring only valid Aadhaar numbers are accepted.

### 📝 Complaint (Post) Management
- Users can create detailed complaints with:
  - Title  
  - Description  
  - Image (via **Cloudinary**)  
- AI model automatically classifies complaint type based on uploaded image.

### 🗺️ Heatmap Visualization
- Visualizes complaint density across cities/localities.
- Built using **Leaflet.js** for real-time, interactive visualization.

### 📊 LiveStat Dashboard
- Displays dynamic analytics using **Recharts**:
  - Category distribution  
  - Complaint progress over time  
  - Resolution performance

### ⏱️ SLA Tracking
- Tracks complaint lifecycle:
  - **Open → In Progress → Resolved**
- Automatically removes resolved complaints from the active SLA dashboard.

### 📄 Reports (CSV & PDF)
- Generate reports filtered by city, locality, or complaint type.
- Export in:
  - **CSV** – for analytics  
  - **PDF** – for documentation and sharing

### ☁️ Cloudinary Integration
- Handles secure, scalable **image uploads** for complaint posts.

---

## 🛠️ Tech Stack

| Category | Technologies |
|-----------|--------------|
| **Frontend** | React.js, Simple CSS |
| **Backend** | Node.js, Express.js |
| **Database** | PostgreSQL (Supabase hosted) |
| **AI Models** | Custom CNN & NLP models (implemented manually) |
| **Authentication** | Google OAuth + Aadhaar Validation |
| **Media** | Cloudinary |
| **Visualization** | Leaflet.js, Recharts |
| **Hosting** | Render (Backend) + Vercel (Frontend) |

---


git clone https://github.com/<your-username>/circus-of-wonders.git
cd circus-of-wonders
