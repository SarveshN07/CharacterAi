## Setup Instructions

### Prerequisites

- Node.js 18+ installed
- Google Gemini API key ([Get it here](https://makersuite.google.com/app/apikey))
- Git (for version control and deployment)
- npm or yarn package manager

### Local Development Setup

#### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file:
```bash
echo "GEMINI_API_KEY=your_api_key_here" > .env
```

4. Start the development server:
```bash
npm run dev
```