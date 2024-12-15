# **MediCo**

An all-in-one learning platform tailored for medical students to unleash their full potential by enhancing organization, learning efficiency, and collaboration.

---

## **Problem Statement**
Medical students often face:
- Fragmented resources that make organization difficult.
- Inefficient study methods, leading to poor knowledge retention.
- Limited collaborative platforms to connect with peers and mentors.

These challenges hinder their ability to perform and grow in their demanding academic journey.

---

## **Our Solution**
*MediCo* centralizes essential tools and resources into one platform:
- **Dashboard**: Manage flashcards, study lists, calendars, and to-do lists in one place.
- **Flashcards**: Create and study flashcards using a spaced-repetition algorithm for better retention.
- **Community**: Engage with peers and professionals to share knowledge and build connections.
- **Classes**: A feature-rich collaboration tool for students and teachers, similar to Google Classroom.

Our app empowers medical students to:
- Stay organized.
- Learn more efficiently.
- Build meaningful connections.

---

## **Features**
### **1. Dashboard**
- Displays recently added flashcards, study lists, calendar events, and to-do lists.

### **2. Flashcards**
- Add and review flashcards with spaced-repetition techniques.

### **3. Community**
- Forums for discussions with other students and professionals.

### **4. Classes**
- A collaborative space for teachers and students to manage classes, assignments, and discussions.

### **5. Login and Signup**
- Secure and efficient onboarding with:
  - **JWT Authentication** for secure sessions.
  - Password hashing with **bcrypt** for user data protection.

---

## **CS Concepts Implemented**
### **Frontend**
- Component-based design with **React**.
- Responsive design for seamless usage across devices.

### **Backend**
- RESTful API built with **Node.js** and **Express.js**.
- User authentication with **JWT** and bcrypt.

### **Database**
- NoSQL database using **MongoDB** for flexible and efficient data management.

### **Web Security**
- Secure data validation and sanitization.

---

## **Getting Started**
### **Prerequisites**
- Node.js
- MongoDB
- Git

### **Installation**
1. Clone the repository:
   ```bash
   git clone https://github.com/[your-username]/[your-repo-name].git
   cd [your-repo-name]
2. Install dependencies:
   ```bash
   npm install
3. Set up environment variables:
   - Create a .env file in the root directory with the following:
     ```bash
     MONGO_URI = "mongodb+srv://admin:adminuser123@cluster0.4408g.mongodb.net/MediCo?retryWrites=true&w=majority"
     JWT_SECRET=secretkey
     PORT=3001
     NODE_ENV = development
4. Start the app:
   ```bash
   npm start


## **Usage**

- **Signup/Login**: Create an account or log in to access features.
- **Dashboard**: View your recent activities.
- **Flashcards**: Add and study your flashcards.
- **Community**: Join discussions with others.
- **Classes**: Collaborate with teachers and students.

## **Contributors**

| Name           | Role                | Responsibilities                                  |
|----------------|---------------------|--------------------------------------------------|
| Carle Francis L. Medina   | Full-Stack Developer| Frontend and backend development, JWT authentication, MongoDB setup |
| Vex Ivan C. Sumang | Backend Developer                | Responsibilities                                 |
| Dorothy C. Salva | Frontend Developer                | Responsibilities                                 |
