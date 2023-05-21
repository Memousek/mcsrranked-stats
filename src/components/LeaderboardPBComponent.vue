<template>
  <div>
    <div v-if="status === 'success'">
      <table class="matches-table">
        <thead>
          <tr style="font-weight: bold">
            <td>#</td>
            <td>Nickname</td>
            <td>Elo</td>
            <td>Time</td>
            <td>Date</td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(data, index) in data" :key="data.UUID" class="">
            <td>{{ index + 1}}</td>
            <td>{{ data.user.nickname }}</td>
            <td>{{ data.user.elo_rate }}</td>
            <td>{{ formatTime(data.final_time)}}</td>
            <td>{{ formatRelativeTime(data.match_date)}}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else>Loading...</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      status: "",
      data: [],
    };
  },
  methods: {
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
  },
  mounted() {
    fetch("https://mcsrranked.com/api/record-leaderboard")
      .then((response) => response.json())
      .then((data) => {
        this.status = data.status;
        this.data = data.data;
        console.log(this.data);
      })
      .catch((error) => {
        console.error(error);
        this.status = "error";
      });
  },
};
</script>
