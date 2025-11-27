# Course to Calendar

Sync your course schedule to Google Calendar in seconds using AI.

## The Story

Every semester, millions of students face the same tedious ritual: manually copying their course schedule from their university portal to their personal calendar. It's a repetitive, error-prone process. You have to check the days, times, and locations for each class, create recurring events, and hope you didn't make a typo that causes you to miss a lecture.

**Course to Calendar** was born out of this frustration. We asked: "Why can't I just take a picture of my schedule and have it done for me?"

By leveraging advanced AI (Google Gemini), we built a tool that parses course details directly from a screenshot and magically syncs them to your Google Calendar. No more manual entry, no more errors—just a perfectly organized schedule in seconds.

## Developers

If you'd like to contribute or run this project locally, follow these steps:

### Prerequisites

- Node.js 18+ installed
- A Google Cloud Project with the Calendar API enabled
- A Google AI Studio account for the Gemini API

### Getting Started

1. **Clone the repository**

   ```bash
   git clone https://github.com/robtzou/course-to-cal.git
   cd course-to-cal
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up Environment Variables**

   Create a `.env.local` file in the root directory and add the following variables:

   ```env
   # Google Gemini API Key for parsing schedules
   GEMINI_API_KEY=your_gemini_api_key_here

   # Google OAuth Credentials for Sign-In and Calendar access
   AUTH_GOOGLE_ID=your_google_client_id
   AUTH_GOOGLE_SECRET=your_google_client_secret

   # NextAuth Secret (generate with `npx auth secret` or openssl)
   AUTH_SECRET=your_random_secret_string
   ```

   **Note:** Ensure your Google Cloud Console project has `http://localhost:3000/api/auth/callback/google` added to the Authorized Redirect URIs.

4. **Run the development server**

   ```bash
   npm run dev
   ```

5. **Open the app**

   Visit [http://localhost:3000](http://localhost:3000) in your browser.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **AI**: Google Gemini Flash
- **Auth**: NextAuth.js (v5)
- **Icons**: Lucide React
- **Animations**: Framer Motion
