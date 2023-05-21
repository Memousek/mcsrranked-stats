<template>
  <div class="player-stats">
    <input
      type="text"
      v-model="username"
      placeholder="Enter username"
      @keyup.enter="fetchData"
    />
    <button @click="fetchData">Search</button>

    <div v-if="data" class="player-details">
      <div class="player-card">
        <img :src="getImageUrl" :alt="getImageAlt" class="player-avatar" />
        <ul class="player-stats-list">
          <li>Username: {{ data.data.nickname }}</li>
          <li>
            Elo: <span id="rank">{{ rankText }} ({{data.data.elo_rate}})</span>
          </li>
          <li>Total games: {{ data.data.total_played }}</li>
          
          <li>Highest win streak: {{ data.data.highest_winstreak }}</li>
          <li>Best time: {{ formatTime(data.data.best_record_time) }}</li>
          <li>Wins: {{ data.data.records[2].win }}</li>
          <li>Loses: {{ data.data.records[2].lose }}</li>
          <li>Draft: {{ data.data.records[2].draw }}</li>
          <li>Win Rate: {{ calculateWinRate(data.data.records[2].win, data.data.records[2].lose) }}%</li>
          <li>Last online: {{ formatRelativeTime(data.data.latest_time) }}</li>
        </ul>
      </div>

      <PlayerStatsMatchComponent
        :username="username"
        :uuid="data.data.uuid"
      ></PlayerStatsMatchComponent>
    </div>
    <div v-else>
      <p>No data available</p>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import PlayerStatsMatchComponent from "./PlayerStatsMatchComponent.vue";

export default {
  name: "PlayerStatsComponent",
  components: {
    PlayerStatsMatchComponent,
  },
  data() {
    return {
      data: null,
      uuid: "",
      error: null,
    };
  },
  computed: {
    rankText() {
      const elo = this.data?.elo_rate;
      return this.addRank(elo);
    },
    getImageUrl() {
      return `https://skins.danielraybone.com/v1/head/${this.username}?width=150`;
    },
    getImageAlt() {
      return `${this.username}'s head`;
    },
  },
  mounted() {
    const params = new URLSearchParams(window.location.search);
    if (params.has("username")) {
      this.username = params.get("username");
      this.fetchData();
    }
  },
  methods: {
    async fetchData() {
      if (!this.username) {
        this.data = null;
        this.error = null;
        return;
      }

      const apiUrl = `https://mcsrranked.com/api/users/${this.username}`;

      try {
        const response = await axios.get(apiUrl);
        this.data = response.data;
        this.error = null; // Reset error if data is successfully fetched
      } catch (error) {
        this.data = null; // Reset data if an error occurs
        this.error = error.message; // Set the error message
      }
    },
    addRank(elo) {
      const ranks = [
        [0, 199, "Coal I"],
        [200, 399, "Coal II"],
        [400, 599, "Coal III"],
        [600, 799, "Iron I"],
        [800, 999, "Iron II"],
        [1000, 1199, "Iron III"],
        [1200, 1399, "Gold I"],
        [1400, 1599, "Gold II"],
        [1600, 1799, "Gold III"],
        [1800, 1999, "Diamond I"],
        [2000, 2199, "Diamond II"],
        [2200, 2399, "Diamond III"],
      ];

      for (const [min, max, rank] of ranks) {
        if (elo > min && elo < max) {
          return rank;
        }
      }

      return "Unranked";
    },
    formatTime(timeInMs) {
      const minutes = Math.floor(timeInMs / 60000);
      const seconds = ((timeInMs % 60000) / 1000).toFixed(2);
      return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    },
    formatRelativeTime(timestamp) {
      const currentTime = Math.floor(Date.now() / 1000);
      const timeDifference = currentTime - timestamp;

      if (timeDifference < 60) {
        return `${timeDifference} seconds ago`;
      } else if (timeDifference < 3600) {
        const minutes = Math.floor(timeDifference / 60);
        return `${minutes} minutes ago`;
      } else if (timeDifference < 86400) {
        const hours = Math.floor(timeDifference / 3600);
        return `${hours} hours ago`;
      } else if (timeDifference < 604800) {
        const days = Math.floor(timeDifference / 86400);
        return `${days} days ago`;
      } else {
        const date = new Date(timestamp * 1000);
        return date.toDateString();
      }
    },
    calculateWinRate(wins, losses) {
        const totalGames = wins + losses;
        if (totalGames === 0) {
        return 0;
        }
        const winRate = (wins / totalGames) * 100;
        return winRate.toFixed(2); 
    },
  },
};
</script>

<style lang="scss" scoped>
.player-stats {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;

  input[type="text"],
  button {
    padding: 10px;
    font-size: 16px;
  }

  .player-details {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
  }

  .player-avatar {
    border-radius: 50%;
  }

  .player-stats-list {
    list-style: none;
    padding: 0;
    margin: 0;
    text-align: center;
  }

  .player-card {
    border: 1px solid;
    border-radius: 3px;
    display: flex;
    gap: 20px;
    padding: 20px;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
  }
}
</style>
