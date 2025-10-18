# InterestFree API — Backend (Express + TypeScript)

Backend API for **InterestFree**, an interest-free loan management SaaS platform.  
Provides secure endpoints for borrowers, loans, and payments using JWT with HttpOnly cookies.

---

## 🧾 Overview

This backend is built with **Express (TypeScript)** and **MongoDB (Mongoose)** following a **modular architecture**.  
It supports authentication, loan management, and financial aggregation using MongoDB pipelines.

---

## 🏗 Tech Stack

| Technology        | Purpose                     |
|-------------------|-----------------------------|
| **TypeScript + Express** | API & Routing         |
| **MongoDB + Mongoose**   | Database & ODM        |
| **JWT + HttpOnly Cookie**| Authentication        |
| **PM2 + NGINX**           | Deployment & Process Manager |

---

## 📁 Main Modules

- `auth` — Login, Register, Refresh Token  
- `borrowers` — Borrower CRUD  
- `loans` — Create & Manage Loans  
- `payments` — Record Manual Payments  
- `reports` — Aggregated Loan & Due Stats

---

## ⚙️ Local Setup

```bash
# Clone the backend repository
git clone https://github.com/rukonbdju/loan-management-api.git
cd loan-management-api

# Install dependencies
npm install

# Run in development
npm run dev
