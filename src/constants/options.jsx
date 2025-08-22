export const SelectTravelersList = [
    {
      id: 1,
      title: 'Just Me',
      desc: 'A sole traveler exploring the world',
      icon: '🙋',
      people: '1 Person',
    },
    {
      id: 2,
      title: 'A Couple',
      desc: 'Two travelers in tandem',
      icon: '👩‍❤‍👨',
      people: '2 People',
    },
    {
      id: 3,
      title: 'Family',
      desc: 'A group of fun-loving adventurers',
      icon: '🧑‍🧑‍🧒‍🧒',
      people: '3 to 5 People',
    },
    {
      id: 4,
      title: 'Friends',
      desc: 'A bunch of thrill-seekers',
      icon: '🥂',
      people: '5 to 10 People',
    },
  ];
  
  export const SelectBudegetOptions = [
    {
      id: 1,
      title: 'Cheap',
      desc: 'Stay conscious of costs',
      icon: '🪙',
    },
    {
      id: 2,
      title: 'Moderate',
      desc: 'Keep costs on the average side',
      icon: '🤑',
    },
    {
      id: 3,
      title: 'Luxurious',
      desc: 'Indulge in luxury and comfort',
      icon: '💸',
    },
  ];

  export const AI_PROMPT = `
    You are a master travel planner. Your task is to generate a detailed, personalized travel itinerary for {location}.
    The trip is for {totalDays} days, for {travelers}, with a {budget} budget.

    **IMPORTANT**: Your entire response MUST be a single, valid JSON object. Do not include any text, notes, or markdown formatting before or after the JSON object.

    The JSON object must follow this exact structure, including all specified keys:

    {
      "locationImageUrl": "(string) A URL for a high-quality, beautiful image of {location}.",
      "bestTimeToVisit": "(string) A concise description of the best time to visit {location}.",
      "estimatedCost": {
        "flights": "(number) Estimated cost for flights/transport in INR.",
        "accommodation": "(number) Estimated cost for accommodation in INR.",
        "food": "(number) Estimated cost for food in INR.",
        "activities": "(number) Estimated cost for activities and attractions in INR.",
        "total": "(number) The total estimated cost in INR."
      },
      "ecoScore": "(number) An eco-friendliness score for the trip from 1 (poor) to 10 (excellent), based on transportation, accommodation, and activities.",
      "carbonFootprint": {
        "flight": "(number) Estimated round-trip carbon footprint in kg CO₂ per person for flying to the destination.",
        "train": "(number) Estimated round-trip carbon footprint in kg CO₂ per person for taking a train (if applicable).",
        "car": "(number) Estimated round-trip carbon footprint in kg CO₂ per person for driving (if applicable)."
      },
      "ecoFriendlyTips": "(string) A short paragraph with 2-3 actionable tips for making this specific trip more eco-friendly, such as suggesting alternative transport or sustainable practices.",
      "hotelOptions": [
        {
          "hotelName": "(string) The name of the hotel.",
          "hotelAddress": "(string) The full street address of the hotel.",
          "price": "(string) The estimated price per night in INR, as a string without the currency symbol (e.g., '12,000-15,000').",
          "hotelImageUrl": "(string) A URL for a high-quality image of the hotel.",
          "rating": "(number) The hotel's rating (e.g., 4.5)."
        }
      ],
      "itinerary": [
        {
          "day": "(number) The day number of the itinerary (e.g., 1).",
          "title": "(string) A creative title for the day's activities (e.g., 'Exploring the Historic Quarter').",
          "places": [
            {
              "placeName": "(string) The name of the place to visit.",
              "placeDetails": "(string) A brief, engaging description of the place.",
              "placeImageUrl": "(string) A URL for a high-quality image of the place.",
              "ticketPricing": "(string) The cost of admission (e.g., 'Free', '₹200 per person').",
              "rating": "(number) The place's rating (e.g., 4.8).",
              "openingHours": "(string) The typical opening and closing times (e.g., '9:00 AM - 5:00 PM').",
              "timeToTravel": "(string) Estimated travel time from the previous location or hotel (e.g., '15 min drive')."
            }
          ]
        }
      ]
    }

    Every single piece of information, including hotel names, addresses, place names, and all image URLs, must be for {location}. Do not use placeholder data.
    `