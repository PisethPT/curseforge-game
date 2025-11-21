<template>
  <div class="game-detail-view">
    <button class="back-button" @click="$router.back()">
      ← Back to Games
    </button>

    <div v-if="error" class="error-message">
      {{ error }}
    </div>

    <LoadingSpinner v-else-if="isLoading" message="Loading game details..." />

    <div v-else-if="game" class="game-detail">
      <div class="game-header">
        <div class="game-cover">
          <img :src="game.cover?.url || game.logo?.url || '/placeholder-game.jpg'" :alt="game.name"
            @error="handleImageError" />
        </div>
        <div class="game-info">
          <div class="game-title-section">
            <img :src="game.logo?.url || '/placeholder-game.jpg'" :alt="game.name + ' logo'" class="game-logo-large"
              @error="handleLogoError" />
            <div>
              <h1 class="game-title">{{ game.name }}</h1>
              <p class="game-slug">{{ game.slug }}</p>
            </div>
          </div>

          <p class="game-summary">{{ game.summary || 'No description available.' }}</p>

          <div class="game-meta-grid">
            <div class="meta-item">
              <span class="meta-label">Category</span>
              <span class="meta-value">{{ game.category }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Last Updated</span>
              <span class="meta-value">{{ formattedDate }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Game ID</span>
              <span class="meta-value">{{ game.id }}</span>
            </div>
            <div class="meta-item" v-if="game.status">
              <span class="meta-label">Status</span>
              <span :class="['meta-value', 'status-badge', getStatusClass(game.status)]">
                {{ getStatusText(game.status) }}
              </span>
            </div>
          </div>

          <div class="game-actions">
            <a :href="game.websiteUrl" target="_blank" class="action-button primary">
              View on CurseForge ↗
            </a>
            <button class="action-button secondary" @click="copyGameLink">
              Copy Link
            </button>
          </div>
        </div>
      </div>

      <div class="game-assets" v-if="hasAssets">
        <h3>Game Assets</h3>
        <div class="assets-grid">
          <div class="asset-item" v-if="game.logo?.url">
            <img :src="game.logo.url" alt="Game Logo" />
            <span>Logo</span>
          </div>
          <div class="asset-item" v-if="game.cover?.url">
            <img :src="game.cover.url" alt="Game Cover" />
            <span>Cover</span>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="not-found">
      <h2>Game not found</h2>
      <p>The game you're looking for doesn't exist or has been removed.</p>
      <router-link to="/games" class="back-link">
        Browse All Games
      </router-link>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, onUnmounted } from 'vue'
import { useGameStore } from '@/stores/gameStore'

export default {
  name: 'GameDetailView',
  props: {
    id: {
      type: String,
      required: true
    }
  },
  setup(props)
  {
    const store = useGameStore()

    const game = computed(() => store.currentGame)
    const isLoading = computed(() => store.isLoading)
    const error = computed(() => store.error)

    const formattedDate = computed(() =>
    {
      if (!game.value?.dateCreated) return 'Unknown'
      return new Date(game.value.dateCreated).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    })

    const hasAssets = computed(() =>
    {
      return game.value?.logo?.url || game.value?.cover?.url
    })

    const getStatusClass = (status) =>
    {
      const statusMap = {
        1: 'status-draft',
        2: 'status-test',
        3: 'status-pending',
        4: 'status-private',
        5: 'status-public',
        6: 'status-live'
      }
      return statusMap[status] || 'status-unknown'
    }

    const getStatusText = (status) =>
    {
      const statusMap = {
        1: 'Draft',
        2: 'Test',
        3: 'Pending',
        4: 'Private',
        5: 'Public',
        6: 'Live'
      }
      return statusMap[status] || 'Unknown'
    }

    const handleImageError = (event) =>
    {
      event.target.src = '/placeholder-game.jpg'
    }

    const handleLogoError = (event) =>
    {
      event.target.src = '/placeholder-game.jpg'
    }

    const copyGameLink = async () =>
    {
      const url = window.location.href
      try
      {
        await navigator.clipboard.writeText(url)
        alert('Game link copied to clipboard!')
      } catch (err)
      {
        console.error('Failed to copy link:', err)
      }
    }

    onMounted(async () =>
    {
      await store.fetchGameById(props.id)
    })

    onUnmounted(() =>
    {
      store.clearCurrentGame()
    })

    return {
      game,
      isLoading,
      error,
      formattedDate,
      hasAssets,
      handleImageError,
      handleLogoError,
      getStatusClass,
      getStatusText,
      copyGameLink
    }
  }
}
</script>

<style scoped>
.game-detail-view {
  max-width: 1000px;
  margin: 0 auto;
}

.back-button {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  margin-bottom: 2rem;
  transition: all 0.3s ease;
}

.back-button:hover {
  background: rgba(102, 126, 234, 0.3);
  border-color: #667eea;
}

.game-detail {
  background: linear-gradient(145deg, #1e1e3f, #2d2b55);
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
}

.game-header {
  display: grid;
  grid-template-columns: 400px 1fr;
  gap: 2rem;
  padding: 2rem;
}

.game-cover img {
  width: 100%;
  height: 500px;
  object-fit: cover;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

.game-info {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.game-title-section {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.game-logo-large {
  width: 80px;
  height: 80px;
  border-radius: 12px;
  object-fit: cover;
  flex-shrink: 0;
}

.game-title {
  font-size: 2.5rem;
  font-weight: bold;
  color: #ffffff;
  margin: 0;
  line-height: 1.1;
}

.game-slug {
  color: #667eea;
  font-size: 1.1rem;
  margin: 0;
  font-family: monospace;
}

.game-summary {
  font-size: 1.1rem;
  line-height: 1.6;
  color: #b8b8d0;
  margin: 0;
}

.game-meta-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.meta-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.meta-label {
  font-size: 0.9rem;
  color: #8888aa;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.meta-value {
  font-size: 1rem;
  color: #ffffff;
  font-weight: 500;
}

.game-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.action-button {
  padding: 12px 24px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: bold;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
  text-align: center;
}

.action-button.primary {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
}

.action-button.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.action-button.secondary {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
}

.action-button.secondary:hover {
  background: rgba(255, 255, 255, 0.2);
}

.game-assets {
  padding: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.game-assets h3 {
  margin-bottom: 1rem;
  color: #ffffff;
}

.assets-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.asset-item {
  text-align: center;
}

.asset-item img {
  width: 100%;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 0.5rem;
}

.asset-item span {
  color: #b8b8d0;
  font-size: 0.9rem;
}

.status-badge {
  padding: 4px 15px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: bold;
  text-transform: uppercase;
  width: fit-content;
}

.status-live {
  background: rgba(76, 175, 80, 0.2);
  color: #4CAF50;
}

.status-public {
  background: rgba(33, 150, 243, 0.2);
  color: #2196F3;
}

.status-private {
  background: rgba(158, 158, 158, 0.2);
  color: #9E9E9E;
}

.status-pending {
  background: rgba(255, 152, 0, 0.2);
  color: #FF9800;
}

.status-draft {
  background: rgba(244, 67, 54, 0.2);
  color: #F44336;
}

.status-unknown {
  background: rgba(158, 158, 158, 0.2);
  color: #9E9E9E;
}

.not-found {
  text-align: center;
  padding: 4rem 2rem;
}

.not-found h2 {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #ffffff;
}

.not-found p {
  color: #b8b8d0;
  margin-bottom: 2rem;
}

.back-link {
  color: #667eea;
  text-decoration: none;
  font-weight: bold;
}

.back-link:hover {
  text-decoration: underline;
}

@media (max-width: 768px) {
  .game-header {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .game-cover img {
    height: 300px;
  }

  .game-title {
    font-size: 2rem;
  }

  .game-title-section {
    flex-direction: column;
    text-align: center;
  }

  .game-actions {
    flex-direction: column;
  }
}
</style>