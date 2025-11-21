<template>
  <div class="search-bar">
    <div class="search-input-container">
      <input
        v-model="localQuery"
        type="text"
        placeholder="Search games..."
        class="search-input"
        @input="handleInput"
        @keyup.enter="handleSearch"
      />
      <button class="search-button" @click="handleSearch">
        Search
      </button>
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue'

export default {
  name: 'SearchBar',
  props: {
    modelValue: {
      type: String,
      default: ''
    }
  },
  emits: ['update:modelValue', 'search'],
  setup(props, { emit }) {
    const localQuery = ref(props.modelValue)

    watch(() => props.modelValue, (newValue) => {
      localQuery.value = newValue
    })

    const handleInput = () => {
      emit('update:modelValue', localQuery.value)
    }

    const handleSearch = () => {
      emit('search', localQuery.value)
    }

    return {
      localQuery,
      handleInput,
      handleSearch
    }
  }
}
</script>

<style scoped>
.search-bar {
  margin-bottom: 2rem;
}

.search-input-container {
  position: relative;
  max-width: 500px;
  margin: 0 auto;
}

.search-input {
  width: 100%;
  padding: 12px 50px 12px 20px;
  border: none;
  border-radius: 25px;
  background: rgba(255,255,255,0.1);
  color: white;
  font-size: 1rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.2);
}

.search-input::placeholder {
  color: #b8b8d0;
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.3);
}

.search-button {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #b8b8d0;
  cursor: pointer;
  font-size: 1.2rem;
  padding: 5px;
  transition: color 0.3s ease;
}

.search-button:hover {
  color: #667eea;
}
</style>