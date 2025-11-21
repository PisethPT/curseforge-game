import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
//const API_KEY = import.meta.env.VITE_API_KEY;
const API_KEY = `$2a$10$MZu/6h6OcZspplxUPfI.quK4loG8Z7iWgY6960XZnQQNL/2p6CQlW`;

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "x-api-key": API_KEY,
    "Content-Type": "application/json",
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    console.log(
      `Making ${config.method?.toUpperCase()} request to: ${config.url}`
    );
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error("API Error:", error.response?.data || error.message);

    if (error.response?.status === 401) {
      console.error("Authentication failed - check your API key");
    } else if (error.response?.status === 429) {
      console.error("Rate limit exceeded");
    }

    return Promise.reject(error);
  }
);

// Transform CurseForge API data to our app format
const transformGameData = (apiGame) => {
  return {
    id: apiGame.id,
    name: apiGame.name,
    slug: apiGame.slug,
    summary: apiGame.summary || "No description available.",
    // Use the assets from API response
    logo: {
      url:
        apiGame.assets?.iconUrl ||
        apiGame.assets?.tileUrl ||
        "/placeholder-game.jpg",
    },
    cover: {
      url:
        apiGame.assets?.coverUrl ||
        apiGame.assets?.tileUrl ||
        "/placeholder-game.jpg",
    },
    category: "Game", // You might want to fetch categories separately
    dateCreated:
      apiGame.dateModified || apiGame.dateCreated || new Date().toISOString(),
    websiteUrl: `https://www.curseforge.com/${apiGame.slug}`,
    status: apiGame.status,
    apiStatus: apiGame.apiStatus,
    // Original API data for reference
    _raw: apiGame,
  };
};

// API service methods
export const gameService = {
  async getGames(params = {}) {
    try {
      const response = await apiClient.get("/games", { params });
      const games = response.data.data || [];
      return games.map(transformGameData);
    } catch (error) {
      console.error("Error fetching games:", error);
      // Return mock data for demo purposes
      return this.getMockGames();
    }
  },

  async getFeaturedGames() {
    try {
      const response = await apiClient.get("/games", {
        params: { pageSize: 6 },
      });
      const games = response.data.data || [];
      return games.map(transformGameData);
    } catch (error) {
      console.error("Error fetching featured games:", error);
      // Return mock data for demo purposes
      return this.getMockGames().slice(0, 6);
    }
  },

  async getGameById(id) {
    try {
      const response = await apiClient.get(`/games/${id}`);
      const game = response.data.data;
      return game ? transformGameData(game) : null;
    } catch (error) {
      console.error(`Error fetching game ${id}:`, error);
      // Return mock game for demo purposes
      return (
        this.getMockGames().find((game) => game.id === parseInt(id)) || null
      );
    }
  },

  async searchGames(query) {
    try {
      // Note: CurseForge API might not have a direct search endpoint for games
      // We'll filter the existing games client-side for now
      const response = await apiClient.get("/games");
      const allGames = response.data.data || [];
      const filteredGames = allGames.filter(
        (game) =>
          game.name.toLowerCase().includes(query.toLowerCase()) ||
          game.slug.toLowerCase().includes(query.toLowerCase())
      );
      return filteredGames.map(transformGameData);
    } catch (error) {
      console.error("Error searching games:", error);
      // Filter mock data for demo purposes
      const mockGames = this.getMockGames();
      return mockGames.filter((game) =>
        game.name.toLowerCase().includes(query.toLowerCase())
      );
    }
  },

  // Mock data for demo when API is not available
  getMockGames() {
    return [
      {
        id: 78135,
        name: "Demeo",
        slug: "demeo",
        summary:
          "A virtual reality dungeon-crawling board game where players work together to defeat monsters and complete quests.",
        logo: {
          url: "https://media.forgecdn.net/avatars/468/250/637751406649699690.png",
        },
        cover: {
          url: "https://media.forgecdn.net/game-covers/78135_b8970d8d-91f4-4353-8e67-2aa5f3e499bb.webp",
        },
        category: "RPG",
        dateCreated: "2022-11-28T12:07:33.87Z",
        websiteUrl: "https://www.curseforge.com/demeo",
        status: 6,
        apiStatus: 2,
      },
      {
        id: 432,
        name: "Minecraft",
        slug: "minecraft",
        summary:
          "A sandbox adventure game where you can build and explore infinite worlds.",
        logo: {
          url: "https://media.forgecdn.net/avatars/thumbnails/1/100/64/64/635292862241129938.png",
        },
        cover: {
          url: "https://media.forgecdn.net/game-covers/432_cover.jpg",
        },
        category: "Sandbox",
        dateCreated: "2011-11-18T00:00:00Z",
        websiteUrl: "https://www.curseforge.com/minecraft",
        status: 6,
        apiStatus: 2,
      },
      {
        id: 1,
        name: "World of Warcraft",
        slug: "wow",
        summary:
          "Massively multiplayer online role-playing game set in the Warcraft universe.",
        logo: {
          url: "https://media.forgecdn.net/avatars/thumbnails/2/100/64/64/635292862398848929.png",
        },
        cover: {
          url: "https://media.forgecdn.net/game-covers/1_cover.jpg",
        },
        category: "MMORPG",
        dateCreated: "2004-11-23T00:00:00Z",
        websiteUrl: "https://www.curseforge.com/wow",
        status: 6,
        apiStatus: 2,
      },
      {
        id: 2,
        name: "The Elder Scrolls V: Skyrim",
        slug: "skyrim",
        summary:
          "Epic fantasy role-playing game where you battle dragons and explore a vast world.",
        logo: {
          url: "https://media.forgecdn.net/avatars/thumbnails/3/100/64/64/635292862518848929.png",
        },
        cover: {
          url: "https://media.forgecdn.net/game-covers/2_cover.jpg",
        },
        category: "RPG",
        dateCreated: "2011-11-11T00:00:00Z",
        websiteUrl: "https://www.curseforge.com/skyrim",
        status: 6,
        apiStatus: 2,
      },
      {
        id: 3,
        name: "Cyberpunk 2077",
        slug: "cyberpunk-2077",
        summary:
          "Open-world, action-adventure RPG set in the dystopian Night City.",
        logo: {
          url: "https://media.forgecdn.net/avatars/thumbnails/4/100/64/64/635292862638848929.png",
        },
        cover: {
          url: "https://media.forgecdn.net/game-covers/3_cover.jpg",
        },
        category: "RPG",
        dateCreated: "2020-12-10T00:00:00Z",
        websiteUrl: "https://www.curseforge.com/cyberpunk-2077",
        status: 6,
        apiStatus: 2,
      },
      {
        id: 4,
        name: "Grand Theft Auto V",
        slug: "gta-v",
        summary:
          "Action-adventure game set in the fictional state of San Andreas.",
        logo: {
          url: "https://media.forgecdn.net/avatars/thumbnails/5/100/64/64/635292862758848929.png",
        },
        cover: {
          url: "https://media.forgecdn.net/game-covers/4_cover.jpg",
        },
        category: "Action",
        dateCreated: "2013-09-17T00:00:00Z",
        websiteUrl: "https://www.curseforge.com/gta-v",
        status: 6,
        apiStatus: 2,
      },
    ];
  },
};

export default apiClient;
