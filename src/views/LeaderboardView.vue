<template>
  <div>
    <div class="button-group">
      <button @click="setActiveLeaderboard('LeaderboardComponent')" :class="{ active: activeLeaderboard === 'LeaderboardComponent' }">Leaderboard</button>
      <button @click="setActiveLeaderboard('LeaderboardPBComponent')" :class="{ active: activeLeaderboard === 'LeaderboardPBComponent' }">Record Leaderboard</button>
    </div>

    <component :is="activeLeaderboard" />
  </div>
</template>

<script>
import LeaderboardComponent from "@/components/LeaderboardComponent.vue";
import LeaderboardPBComponent from "@/components/LeaderboardPBComponent.vue";

export default {
  components: {
    LeaderboardComponent,
    LeaderboardPBComponent,
  },
  data() {
    return {
      activeLeaderboard: localStorage.getItem('activeLeaderboard') || 'LeaderboardComponent',
    };
  },
  methods: {
    setActiveLeaderboard(leaderboard) {
      this.activeLeaderboard = leaderboard;
      localStorage.setItem('activeLeaderboard', leaderboard);
    },
  },
};
</script>

<style>
.button-group {
  margin-bottom: 1rem;
  display: flex;
  justify-content: center;
  gap: 10px;
}

.button-group button {
  padding: 0.5rem 1rem;
  font-size: 1rem;
  background-color: #4a4a4a;
  color: #ffffff;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
}

.button-group button.active {
  background-color: #2196f3;
}

.component-container {
  margin-top: 1rem;
}
</style>
