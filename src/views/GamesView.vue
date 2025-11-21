<template>
  <div class="games-view">
    <div class="games-header">
      <h1 class="page-title">All Games</h1>
      <p class="page-subtitle">Discover our complete collection of games</p>
    </div>

    <SearchBar 
      v-model="searchQuery"
      @search="handleSearch"
    />

    <div v-if="error" class="error-message">
      {{ error }}
    </div>

    <LoadingSpinner v-else-if="isLoading" />

    <div v-else>
      <div class="games-info">
        <p>Showing {{ games.length }} of {{ filteredGamesCount }} games</p>
      </div>

      <GameGrid :games="games" />

      <Pagination
        :current-page="currentPage"
        :total-pages="totalPages"
        @page-change="handlePageChange"
      />
    </div>
  </div>
</template>

<script>
import { useGames } from '@/composables/useGames'
import GameGrid from '@/components/GameGrid.vue'
import SearchBar from '@/components/SearchBar.vue'
import Pagination from '@/components/Pagination.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

export default {
  name: 'GamesView',
  components: {
    GameGrid,
    SearchBar,
    Pagination,
    LoadingSpinner
  },
  setup() {
    const {
      searchQuery,
      games,
      isLoading,
      error,
      currentPage,
      totalPages,
      handleSearch,
      handlePageChange
    } = useGames()

    const filteredGamesCount = games.value.length

    return {
      searchQuery,
      games,
      isLoading,
      error,
      currentPage,
      totalPages,
      filteredGamesCount,
      handleSearch,
      handlePageChange
    }
  }
}
</script>

<style scoped>
.games-view {
  max-width: 1200px;
  margin: 0 auto;
}

.games-header {
  text-align: center;
  margin-bottom: 3rem;
}

.page-title {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  color: #ffffff;
}

.page-subtitle {
  color: #b8b8d0;
  font-size: 1.1rem;
}

.games-info {
  margin-bottom: 1rem;
  color: #b8b8d0;
  font-size: 0.9rem;
}

.error-message {
  background: rgba(220, 53, 69, 0.1);
  border: 1px solid rgba(220, 53, 69, 0.3);
  color: #dc3545;
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
  margin: 2rem 0;
}
</style>