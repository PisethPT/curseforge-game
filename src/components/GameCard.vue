<template>
  <div class="game-card" @click="navigateToGame">
    <div class="game-card-image">
      <img 
        :src="game.cover?.url || game.logo?.url || '/placeholder-game.jpg'" 
        :alt="game.name"
        @error="handleImageError"
      />
      <div class="game-card-overlay">
        <button class="view-details-btn">View Details</button>
      </div>
    </div>
    <div class="game-card-content">
      <div class="game-header">
        <img 
          :src="game.logo?.url || '/placeholder-game.jpg'" 
          :alt="game.name + ' logo'"
          class="game-logo"
          @error="handleLogoError"
        />
        <h3 class="game-title">{{ game.name }}</h3>
      </div>
      <p class="game-description">{{ truncatedDescription }}</p>
      <div class="game-meta">
        <span class="game-category">{{ game.category }}</span>
        <span class="game-date">{{ formattedDate }}</span>
      </div>
      <div class="game-status" v-if="game.status">
        <span :class="['status-badge', getStatusClass(game.status)]">
          {{ getStatusText(game.status) }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'GameCard',
  props: {
    game: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const router = useRouter()

    const truncatedDescription = computed(() => {
      const desc = props.game.summary || 'No description available'
      return desc.length > 120 ? desc.substring(0, 120) + '...' : desc
    })

    const formattedDate = computed(() => {
      if (!props.game.dateCreated) return 'Unknown date'
      return new Date(props.game.dateCreated).toLocaleDateString()
    })

    const getStatusClass = (status) => {
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

    const getStatusText = (status) => {
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

    const navigateToGame = () => {
      router.push(`/game/${props.game.id}`)
    }

    const handleImageError = (event) => {
      event.target.src = '/placeholder-game.jpg'
    }

    const handleLogoError = (event) => {
      event.target.src = '/placeholder-game.jpg'
    }

    return {
      truncatedDescription,
      formattedDate,
      navigateToGame,
      handleImageError,
      handleLogoError,
      getStatusClass,
      getStatusText
    }
  }
}
</script>

<style scoped>
.game-card {
  background: linear-gradient(145deg, #1e1e3f, #2d2b55);
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(0,0,0,0.3);
  height: 100%;
  display: flex;
  flex-direction: column;
}

.game-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
}

.game-card-image {
  position: relative;
  width: 100%;
  height: 180px;
  overflow: hidden;
}

.game-card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.game-card:hover .game-card-image img {
  transform: scale(1.1);
}

.game-card-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.game-card:hover .game-card-overlay {
  opacity: 1;
}

.view-details-btn {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 25px;
  cursor: pointer;
  font-weight: bold;
  transition: transform 0.2s ease;
}

.view-details-btn:hover {
  transform: scale(1.05);
}

.game-card-content {
  padding: 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.game-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.game-logo {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  object-fit: cover;
  flex-shrink: 0;
}

.game-title {
  font-size: 1.2rem;
  font-weight: bold;
  margin: 0;
  color: #ffffff;
  line-height: 1.2;
}

.game-description {
  color: #b8b8d0;
  font-size: 0.9rem;
  line-height: 1.4;
  margin-bottom: 1rem;
  flex: 1;
}

.game-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
  margin-bottom: 0.5rem;
}

.game-category {
  background: rgba(102, 126, 234, 0.2);
  color: #667eea;
  padding: 4px 8px;
  border-radius: 12px;
}

.game-date {
  color: #8888aa;
}

.game-status {
  margin-top: auto;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: bold;
  text-transform: uppercase;
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
</style>