import axios from 'axios';

const unsplashApiKey = import.meta.env.VITE_UNSPLASH_API_KEY;
const BASE_URL = 'https://api.unsplash.com/search/photos';

/**
 * Fetches a photo URL from Unsplash based on a query.
 * @param {string} query - The search term (e.g., city name, place name).
 * @returns {Promise<string|null>} The URL of the photo or null if not found.
 */
export const getPhoto = async (query) => {
  if (!unsplashApiKey) {
    console.error("Unsplash API key is missing. Please add VITE_UNSPLASH_API_KEY to your .env file.");
    return null;
  }

  try {
    const response = await axios.get(BASE_URL, {
      params: {
        query: query,
        per_page: 1,
        orientation: 'landscape',
        client_id: unsplashApiKey,
      },
    });

    if (response.data.results && response.data.results.length > 0) {
      return response.data.results[0].urls.regular;
    }
    console.warn(`No photo found on Unsplash for query: ${query}`);
    return null;
  } catch (error) {
    console.error('Error fetching photo from Unsplash:', error);
    return null;
  }
};
