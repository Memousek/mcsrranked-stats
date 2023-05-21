<template>
  <div>
    <table class="matches-table">
      <thead>
        <tr>
          <th>Opponent</th>
          <th>Result</th>
          <th>Final Time</th>
          <th>Date</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="_ in matches" :key="_.match_id">
          <td><a :href=getOpponentHref(_)>{{ getOpponentsName(_) }}</a></td>
          <td :class="getMatchResultClass(_)">{{ getWinner(_) }}</td>
          <td>{{ getFinalTime(_) }}</td>
          <td>{{ formatTimestamp(_.match_date) }}</td>
          <td>
            <button @click="openModal(_)">More</button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="selectedMatch" class="modal">
      <div class="modal-content">
        <span class="close" @click="closeModal">&times;</span>
        <h3>Match Details</h3>
        <p>Match ID: {{ selectedMatch.match_id }}</p>
        <p>Match Type: {{ getMatchTypeText(selectedMatch.match_type) }}</p>
        <p>Match Season: {{ selectedMatch.match_season }}</p>
        <h4>Members:</h4>
        <ul>
          <li v-for="member in selectedMatch.members" :key="member.uuid">
            <p>Nickname: {{ member.nickname }}</p>
            <p>Badge: {{ member.badge }}</p>
            <p>Elo Rate: {{ member.elo_rate }}</p>
            <p>Elo Rank: {{ member.elo_rank }}</p>
          </li>
        </ul>
        <h4>Score Changes:</h4>
        <ul>
          <li v-for="change in selectedMatch.score_changes" :key="change.uuid">
            <p>UUID: {{ change.uuid }}</p>
            <p>Change: {{ change.change }}</p>
            <p>Score: {{ change.score }}</p>
          </li>
        </ul>
        <p v-if="selectedMatch.forfeit">Forfeit</p>
        <p v-if="selectedMatch.is_decay">Is Decay</p>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";

export default {
  name: "PlayerStatsMatchComponent",
  props: {
    username: {
      type: String,
      required: true,
    },
    uuid: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      matches: [],
      match: null,
      selectedMatch: null,
    };
  },
  mounted() {
    this.fetchMatches();
  },
  methods: {
    async fetchMatches() {
      try {
        const response = await axios.get(
          `https://mcsrranked.com/api/users/${this.username}/matches`
        );
        this.matches = response.data.data;
      } catch (error) {
        console.error("Error fetching match data:", error);
      }
    },
    getMatchTypeText(type) {
      if (type === 1) {
        return "Casual";
      } else if (type === 2) {
        return "Ranked";
      } else if (type === 3) {
        return "Private";
      } else {
        return "";
      }
    },
    formatTimestamp(timestamp) {
      const date = new Date(timestamp * 1000);
      return date.toLocaleString();
    },
    getFinalTime(match) {
      if (match.forfeit) {
        return "Forfeit";
      } else if (match.is_decay) {
        return "Is Decay";
      } else {
        return this.formatTime(match.final_time);
      }
    },
    getOpponentsName(match) {
    let opponentName = '';
      match.members.forEach(member => {
        if (member.uuid !== this.uuid) {
          opponentName = member.nickname;
          return;
        }
      });
      return opponentName;
    },
    getOpponentHref(match) {
      const opponentName = this.getOpponentsName(match);
      return `/?username=${opponentName}`;
    },
    getWinner(match) {
      return match.winner === this.uuid ? 'Win' : 'Lose';
    },
    getMatchResultClass(match) {
      return match.winner === this.uuid ? 'green' : 'red';
    },
    openModal(match) {
      this.selectedMatch = match;
    },
    closeModal() {
      this.selectedMatch = null;
    },
    formatTime(timeInMs) {
      const minutes = Math.floor(timeInMs / 60000);
      const seconds = ((timeInMs % 60000) / 1000).toFixed(2);
      return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    },
  },
};
</script>

<style>
.matches-table {
  border-collapse: collapse;
  width: 100%;
}

.matches-table th,
.matches-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

.matches-table th {
  background-color: #f2f2f2;
}

.matches-table tr:nth-child(even) {
  background-color: #f9f9f9;
}

.modal {
  display: block;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.4);
}

.modal-content {
  background-color: #fefefe;
  margin: 10% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
}

.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
  cursor: pointer;
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}

.red {
  color: #ff0055;
}

.green {
  color: #55ff00;
}
</style>
