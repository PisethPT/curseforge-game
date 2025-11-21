<template>
  <div class="home-view">
    <section class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">Discover Amazing Games</h1>
        <p class="hero-subtitle">
          Explore a vast collection of games from CurseForge. Find your next adventure today!
        </p>
        <router-link to="/games" class="cta-button">
          Browse All Games
        </router-link>
      </div>
    </section>

    <section class="featured-section">
      <h2 class="section-title">Featured Games</h2>
      <LoadingSpinner v-if="isLoading && featuredGames?.length === 0" />
      <GameGrid v-else :games="featuredGames" />
    </section>
  </div>
</template>

<script>
import { computed, onMounted } from 'vue'
import { useGameStore } from '@/stores/gameStore'
import GameGrid from '@/components/GameGrid.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

export default {
  name: 'HomeView',
  components: {
    GameGrid,
    LoadingSpinner
  },
  setup()
  {
    const store = useGameStore()

    const featuredGames = computed(() => store.featuredGames)
    const isLoading = computed(() => store.isLoading)

    onMounted(async () =>
    {
      if (store.featuredGames?.length === 0)
      {
        await store.fetchFeaturedGames()
      }
    })

    return {
      featuredGames,
      isLoading
    }
  }
}
</script>

<style scoped>
.home-view {
  max-width: 1200px;
  margin: 0 auto;
}

.hero-section {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
  border-radius: 20px;
  padding: 4rem 2rem;
  text-align: center;
  margin-bottom: 4rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.hero-title {
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 1.2rem;
  color: #b8b8d0;
  margin-bottom: 2rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.cta-button {
  display: inline-block;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  padding: 12px 30px;
  border-radius: 25px;
  text-decoration: none;
  font-weight: bold;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.cta-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
}

.featured-section {
  margin-bottom: 3rem;
}

.section-title {
  font-size: 2rem;
  margin-bottom: 2rem;
  text-align: center;
  color: #ffffff;
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
  }

  .hero-section {
    padding: 2rem 1rem;
  }
}
</style>