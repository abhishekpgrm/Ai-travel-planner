# AI Travel Planner 🌍✈️

An intelligent travel planning application that uses AI to create personalized trip itineraries based on your preferences, budget, and travel dates.

## Features

- **AI-Powered Trip Planning**: Generate custom itineraries using Google's Generative AI
- **Smart Destination Search**: Google Places autocomplete for destination selection
- **Budget-Friendly Options**: Choose from budget, moderate, or luxury travel options
- **Group Travel Support**: Plan for solo, couple, family, or group trips
- **Trip Management**: Save and view your planned trips
- **Photo Integration**: Automatic place photos using Google Places API
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS + Framer Motion
- **Authentication**: Google OAuth
- **Database**: Firebase Firestore
- **AI Integration**: Google Generative AI (Gemini)
- **APIs**: Google Places API, Unsplash API
- **UI Components**: Radix UI + Custom Components

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Google Cloud Console account
- Firebase project

### Installation

1. Clone the repository:
```bash
git clone https://github.com/abhishekpgrm/Ai-travel-planner.git
cd Ai-travel-planner
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory:
```env
VITE_GOOGLE_PLACE_API_KEY=your_google_places_api_key
VITE_GOOGLE_GEMINI_AI_API_KEY=your_gemini_ai_api_key
VITE_GOOGLE_AUTH_CLIENT_ID=your_google_oauth_client_id
```

4. Configure Firebase:
- Update `src/service/firebase.js` with your Firebase config

5. Start the development server:
```bash
npm run dev
```

## Usage

1. **Sign In**: Use Google OAuth to authenticate
2. **Create Trip**: Enter destination, travel dates, budget, and group size
3. **AI Generation**: Let AI create a personalized itinerary
4. **View & Manage**: Access your trips from the My Trips page
5. **Explore**: View detailed day-by-day plans with photos and recommendations

## Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Main application pages
├── Create-trip/        # Trip creation workflow
├── view-trip/          # Trip viewing interface
├── service/            # API integrations
├── constants/          # App constants and options
└── data/              # Static data files
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Contact

For questions or support, please open an issue on GitHub.