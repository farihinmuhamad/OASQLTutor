# OASQLTutor  
**An Intelligent SQL Learning Tutor with Fine-Grained Progress Modeling**

OASQLTutor is a web-based intelligent tutoring system designed to support SQL learning through adaptive problem selection, granular skill tracking, and secure learning analytics based on OATutor (https://github.com/CAHLR/OATutor).  
The system integrates **Bayesian Knowledge Tracing (BKT)**, **event-based learning logs**, and **client-side progress aggregation** to provide meaningful feedback on both skill-level and lesson-level mastery.

---

## Live Demo

**Production (GitHub Pages)**  
https://farihinmuhamad.github.io/OASQLTutor/

> Login is required to access learning and progress features.

---

## Key Features

- Firebase Authentication (Email & Password)
- Fine-grained **Skill Progress Tracking**
- Aggregated **Lesson Progress Modeling**
- Incremental (Online) Progress Update — no server aggregation required
- Learner Progress Dashboard
- Event-based Logging (append-only, secure)
- Bayesian Knowledge Tracing (BKT) with mastery threshold
- Modular and extensible architecture

---

## System Architecture Overview

OASQLTutor adopts an **event-driven client-side architecture**:

User Interaction
↓
Event Logging (Firestore – append only)
↓
Client-side Aggregation
↓
Derived Progress Data (Skill & Lesson)
↓
Progress Dashboard


Raw interaction logs and derived progress data are **strictly separated** to ensure data integrity and auditability.

---

## Progress Modeling and Learning Analytics

### Skill-Level Progress

Path:
users/{uid}/skillProgress/{skillId}


Each skill maintains:
- Number of attempts
- Number of correct answers
- Accuracy
- Mastery status (Not Started / Developing / Mastered)

### Lesson-Level Progress

Path:
users/{uid}/lessonProgress/{lessonId}


Lesson progress is computed as an aggregation of mastered skills within a lesson.

### Online Aggregation

Progress is updated **incrementally on each learner interaction**, without reprocessing historical logs or relying on backend batch jobs.

---

## Technology Stack

| Layer       | Technology |
|------------|------------|
| Frontend   | React (CRA) |
| Routing    | React Router |
| UI         | Material-UI |
| Auth       | Firebase Authentication |
| Database   | Cloud Firestore |
| Analytics  | Custom Event Logging |
| Deployment | GitHub Pages |

---

## Installation and Local Development

### Clone Repository

```bash
git clone https://github.com/farihinmuhamad/OASQLTutor.git
cd OASQLTutor
```

Install Dependencies
```bash
npm install
```
Run Locally
```bash
npm start
```
Application runs at:
```bash
http://localhost:3001
```

---

### Firebase Configuration

Create a Firebase project and enable:

- Authentication → Email/Password
- Cloud Firestore

Create or edit this file:
```bash
src/config/firebaseConfig.js
```

Make sure you see this, and replace ... with your own configuration.
```bash
export const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
};
```
Important: Do not commit secrets to GitHub.

---

### Academic Context

This project was developed as part of an academic exploration of:
- Intelligent Tutoring Systems (ITS)
- Learning Analytics
- Bayesian Knowledge Tracing
- Secure educational data pipelines
- The system emphasizes data integrity, interpretability, and minimal server dependency.

---

### Limitations and Future Work

- Instructor dashboard not yet implemented
- No cross-session adaptive curriculum sequencing
- Visualization can be expanded with richer analytics
- Optional server-side aggregation for large-scale deployment

---

### License

This project is released under the MIT License.
See the LICENSE file for details.
