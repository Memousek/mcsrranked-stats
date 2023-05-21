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

    <div v-if="selectedMatch" class="modal" @keydown.esc="closeModal">
      <div class="modal-content">
        <span class="close" @click="closeModal">&times;</span>
        <h3>Match Details</h3>

        <b>{{ selectedMatch.members[0].nickname }}</b>
        vs
        <b>{{ selectedMatch.members[1].nickname }}</b>

        <p>Match ID: {{ selectedMatch.match_id }}</p>
        <p>Match Type: {{ getMatchTypeText(selectedMatch.match_type) }}</p>
        <p>Match Season: {{ selectedMatch.match_season }}</p>
        <p>Match Final time: {{ formatTime(selectedMatch.final_time) }}</p>
        <p>Seed Type: {{ selectedMatch.seed_type }}</p>
        <p>Winner: <b>{{ getNicknameByUUID(selectedMatch.winner) }}</b></p>
        <h4>Timeline</h4>
        <table class="matches-table">
          <thead>
            <tr>
              <td>Player</td>
              <td>Time</td>
              <td>Event</td>
            </tr>
          </thead>
          <tr v-for="timeline in selectedMatch.timelines" :key="timeline.time">
            <td>{{ getNicknameByUUID(timeline.uuid) }}</td>
            <td>{{ formatTime(timeline.time) }}</td>
            <td>{{ timeline.timeline }}</td>
          </tr>
        </table>
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
  computed: {
    getImageUrl() {
      return `https://skins.danielraybone.com/v1/head/${this.username}?width=150`;
    },
    getImageAlt() {
      return `${this.username}'s head`;
    },
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
        return "Event";
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
    async openModal(match) {
      this.selectedMatch = match;
      try {
        const response = await axios.get(
          `https://mcsrranked.com/api/matches/${match.match_id}`
        );
        const matchDetails = response.data.data;
        this.selectedMatch = { ...match, ...matchDetails };
      } catch (error) {
        console.error("Error fetching match details:", error);
      }
      document.body.classList.add('modal-open');
    },
    getNicknameByUUID(uuid) {
      const member = this.selectedMatch.members.find(member => member.uuid === uuid);
      return member ? member.nickname : '';
      
    },
    closeModal() {
      this.selectedMatch = null;
      document.body.classList.remove('modal-open');
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
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
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


.modal-open {
  overflow: hidden;
}
</style>