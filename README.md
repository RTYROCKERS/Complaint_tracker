# 🎪 Circus of Wonders – Complaint Tracking Web Application

> **A civic-tech platform that empowers citizens to report, track, and visualize public complaints — turning civic issues into actionable insights.**

---

## 🌐 Live Website  
**👉 [https://complaint-tracker-two.vercel.app/](https://complaint-tracker-two.vercel.app/)**  

Visit the link above to explore the live version of **Circus of Wonders**.

---

## 🌍 Overview

**Circus of Wonders** is a full-stack complaint tracking web application that allows citizens to report real-world civic issues such as **garbage dumping, potholes, streetlight failures**, and more.  

Officials and moderators can view, analyze, and resolve complaints using **Heatmap visualization**, **LiveStat dashboard**, and **detailed PDF/CSV reports** — making city management smarter and more transparent.

---

## 🚀 Key Features

### 🔐 Dual Login System
- **Google Login** – Quick and secure login using Google OAuth.  
- **Aadhaar-Based Login** – Traditional login system using Aadhaar number with **built-in Aadhaar validation** to prevent invalid entries.

### 📝 Complaint (Post) Management
- Citizens can create **posts** (complaints) with:
  - **Title**
  - **Description**
  - **Image upload** (via **Cloudinary**)  
- Officials and moderators can view, verify, and act on complaints.

### 🗺️ Heatmap Visualization
- Displays complaint **density and distribution** across **cities and localities**.
- Built using **Leaflet.js** for smooth, interactive map visualization.
- Helps identify **problem hotspots** efficiently.

### 📊 LiveStat Dashboard
- Provides real-time visual analytics using **Recharts**:
  - Bar Chart  
  - Pie Chart  
  - Line Graph  
- Tracks complaint types, progress, and resolution rates.

### ⏱️ SLA Tracking
- Automatically tracks the **status lifecycle** of each complaint:
  - **Open → In Progress → Resolved**
- Resolved complaints are automatically removed from the SLA dashboard.

### 📄 Reports (CSV & PDF)
- Generate and download **filtered complaint reports** (by city and locality).
- Supported formats:
  - **CSV** – for data analysis
  - **PDF** – for official documentation and sharing
- Enables easy record keeping and administrative reporting.

### 🧑‍🤝‍🧑 Group & Role Management
- Create groups and assign roles:
  - **Citizens**
  - **Officials**
  - **Moderators**
- Each role has limited and meaningful access for efficient workflow.

---

## 🛠️ Tech Stack

| Category | Technologies |
|-----------|--------------|
| **Frontend** | React.js, Simple CSS (custom modular structure) |
| **Backend** | Node.js, Express.js |
| **Database** | PostgreSQL (Supabase – hosted online) |
| **Authentication** | Google OAuth + Aadhaar Validation |
| **Media Management** | Cloudinary (for complaint images) |
| **Visualization** | Leaflet.js (Heatmap), Recharts (LiveStat) |
| **Hosting** | Render (Backend) & Vercel (Frontend) |

---


