<template>
  <div>
    <div v-if="status === 'success'">
      <table class="matches-table">
        <thead>
          <tr style="font-weight: bold">
            <td>#</td>
            <td>Nickname</td>
            <td>Elo</td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(user, index) in users" :key="user.UUID" class="">
            <td> {{ index + 1}}</td>
            <td>{{ user.nickname }}</td>
            <td>{{ user.elo_rate }}</td>
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
      users: [],
    };
  },
  mounted() {
    fetch("https://mcsrranked.com/api/leaderboard")
      .then((response) => response.json())
      .then((data) => {
        this.status = data.status;
        this.users = data.data.users;
      })
      .catch((error) => {
        console.error(error);
        this.status = "error";
      });
  },
};
</script>
