# NoteHD - Full-Stack Note-Taking Application

NoteHD is a modern, full-stack note-taking application designed with a clean user interface and a secure, dual-mode authentication system. Users can create an account via Email & OTP or their Google account, manage their personal notes, and enjoy a seamless, responsive experience on both desktop and mobile devices.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

### Live Demo

[*[Visit NoteHD]*](https://note-fullstack-app-2dr7.vercel.app/)


---

### Features

- **Secure User Authentication:** Sign up and sign in using either:
  - Email and a One-Time Password (OTP)
  - Google OAuth 2.0
- **JWT-Based Authorization:** User sessions are managed securely using JSON Web Tokens.
- **Account Linking:** Users who sign up with email can seamlessly sign in with a matching Google account later.
- **Note Management:** Authenticated users can create, view, and delete their personal notes.
- **Responsive Design:** A clean, mobile-first UI built with Tailwind CSS that works beautifully on all screen sizes.
- **API and User Feedback:** Clear error messages and loading states to ensure a smooth user experience.

---

### Technology Stack

**Frontend:**
- **Framework:** React (with Vite)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Routing:** React Router
- **API Communication:** Axios

**Backend:**
- **Framework:** Node.js & Express
- **Language:** TypeScript
- **Authentication:** Passport.js (for Google OAuth), JSON Web Token (JWT)
- **Email Service:** Nodemailer with a transactional email provider (like SendGrid or Brevo)

**Database:**
- **Database:** MongoDB
- **ODM:** Mongoose

---

### Getting Started

Follow these instructions to set up the project on your local machine for development and testing.

#### Prerequisites

You will need the following tools installed on your computer:
- [Node.js](https://nodejs.org/) (LTS version recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Git](https://git-scm.com/)
- A free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account
- A free [Google Cloud Platform](https://console.cloud.google.com/) account (for OAuth credentials)
- A free [SendGrid](https://sendgrid.com/) or [Brevo](https://brevo.com/) account (for sending OTP emails)

#### Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://your-repository-url.git](https://your-repository-url.git)
    cd NoteHD
    ```

2.  **Setup the Backend:**
    ```bash
    cd backend
    ```
    - Create a `.env` file in the `backend` directory. Copy the contents of the `.env.example` section below into it.
    - Fill in all the required values (your database URI, secrets, API keys, etc.).
    - Install dependencies:
      ```bash
      npm install
      ```
    - Start the backend server:
      ```bash
      npm run dev
      ```

3.  **Setup the Frontend:**
    - Open a new terminal window.
    ```bash
    cd frontend
    ```
    - Install dependencies:
      ```bash
      npm install
      ```
    - Start the frontend development server:
      ```bash
      npm run dev
      ```

---

### Environment Variables

For the application to run, you must create a `.env` file in the `backend` directory.

**File: `backend/.env.example`**
```env
# Server Configuration
PORT=5000

# MongoDB Connection String (from MongoDB Atlas)
MONGO_URI=your_mongodb_connection_string

# JWT Secret (use a long, random string)
JWT_SECRET=this_is_a_very_long_and_secret_string!

# SendGrid SMTP Credentials (or Brevo, etc.)
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASS=your_sendgrid_api_key_starting_with_SG.
SENDER_EMAIL=the_email_you_verified_as_a_single_sender@example.com

# Google OAuth Credentials (from Google Cloud Platform)
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Frontend URL (for redirects)
CLIENT_URL=http://localhost:5173
```
Author
Vishal Yadav

GitHub:[vishal1230](https://github.com/vishal1230/)

LinkedIn:[vishal-yadav](https://www.linkedin.com/in/vishal-yadav-35b027281)

