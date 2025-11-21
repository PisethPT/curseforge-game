import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { gameService } from "@/services/api";

export const useGameStore = defineStore("games", () => {
  // State
  const games = ref([]);
  const featuredGames = ref([]);
  const currentGame = ref(null);
  const isLoading = ref(false);
  const error = ref(null);
  const searchQuery = ref("");
  const currentPage = ref(1);
  const totalPages = ref(0);

  // Getters
  const filteredGames = computed(() => {
    if (!searchQuery.value) return games.value;
    return games.value.filter((game) =>
      game.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  });

  const paginatedGames = computed(() => {
    const startIndex = (currentPage.value - 1) * 12;
    return filteredGames.value.slice(startIndex, startIndex + 12);
  });

  // Actions
  const fetchGames = async (params = {}) => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await gameService.getGames(params);
      games.value = response;
      totalPages.value = Math.ceil(games.value.length / 12);
    } catch (err) {
      error.value = err.message;
      console.error("Error fetching games:", err);
    } finally {
      isLoading.value = false;
    }
  };

  const fetchFeaturedGames = async () => {
    try {
      const response = await gameService.getFeaturedGames();
      featuredGames.value = response;
    } catch (err) {
      console.error("Error fetching featured games:", err);
    }
  };

  const fetchGameById = async (id) => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await gameService.getGameById(id);
      currentGame.value = response;
    } catch (err) {
      error.value = err.message;
    } finally {
      isLoading.value = false;
    }
  };

  const setSearchQuery = (query) => {
    searchQuery.value = query;
    currentPage.value = 1;
  };

  const setPage = (page) => {
    currentPage.value = page;
  };

  const clearCurrentGame = () => {
    currentGame.value = null;
  };

  return {
    // State
    games,
    featuredGames,
    currentGame,
    isLoading,
    error,
    searchQuery,
    currentPage,
    totalPages,

    // Getters
    filteredGames,
    paginatedGames,

    // Actions
    fetchGames,
    fetchFeaturedGames,
    fetchGameById,
    setSearchQuery,
    setPage,
    clearCurrentGame,
  };
});
