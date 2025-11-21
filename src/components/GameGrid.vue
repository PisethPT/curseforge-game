<template>
  <div class="game-grid">
    <div 
      v-for="game in games" 
      :key="game.id" 
      class="game-grid-item"
    >
      <GameCard :game="game" />
    </div>
  </div>
</template>

<script>
import GameCard from './GameCard.vue'

export default {
  name: 'GameGrid',
  components: {
    GameCard
  },
  props: {
    games: {
      type: Array,
      required: true
    }
  }
}
</script>

<style scoped>
.game-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  padding: 1rem 0;
}

@media (max-width: 768px) {
  .game-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1rem;
  }
}
</style>