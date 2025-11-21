import { ref, computed, onMounted } from "vue";
import { useGameStore } from "@/stores/gameStore";

export function useGames() {
  const store = useGameStore();

  const searchQuery = ref("");

  const games = computed(() => store.paginatedGames);
  const featuredGames = computed(() => store.featuredGames);
  const isLoading = computed(() => store.isLoading);
  const error = computed(() => store.error);
  const currentPage = computed(() => store.currentPage);
  const totalPages = computed(() => store.totalPages);

  const handleSearch = () => {
    store.setSearchQuery(searchQuery.value);
  };

  const handlePageChange = (page) => {
    store.setPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  onMounted(async () => {
    if (store.games?.length === 0) {
      await store.fetchGames();
    }
    if (store.featuredGames?.length === 0) {
      await store.fetchFeaturedGames();
    }
  });

  return {
    searchQuery,
    games,
    featuredGames,
    isLoading,
    error,
    currentPage,
    totalPages,
    handleSearch,
    handlePageChange,
  };
}
