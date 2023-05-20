
  new Vue({
    el: '#app',
    data: {
      data: null,
      username: 'freezelol',
    },
    computed: {
      rankText() {
        const elo = this.data?.data?.elo_rate;
        return this.addRank(elo);
      },
    },
    mounted() {
        const apiUrl = `https://mcsrranked.com/api/users/freezelol`;
        fetch(apiUrl)
          .then(response => response.json())
          .then(data => {
            this.data = data;
          })
          .catch(error => {
            console.error('Error:', error);
          });
    },
    methods: {
      fetchData() {
        const apiUrl = `https://mcsrranked.com/api/users/${this.username}`;
        fetch(apiUrl)
          .then(response => response.json())
          .then(data => {
            this.data = data;
          })
          .catch(error => {
            console.error('Error:', error);
          });
      },
      addRank(elo) {
        return elo > 0 && elo < 199
            ? "Coal I"
            : elo > 200 && elo < 399
            ? "Coal II"
            : elo > 400 && elo < 599
            ? "Coal III"
            : elo > 600 && elo < 799
            ? "Iron I"
            : elo > 800 && elo < 999
            ? "Iron II"
            : elo > 1000 && elo < 1199
            ? "Iron III"
            : elo > 1200 && elo < 1399
            ? "Gold I"
            : elo > 1400 && elo < 1599
            ? "Gold II"
            : elo > 1600 && elo < 1799
            ? "Gold III"
            : elo > 1800 && elo < 1999
            ? "Diamond I"
            : elo > 2000 && elo < 2199
            ? "Diamond II"
            : elo > 2200 && elo < 2399
            ? "Diamond III"
            : "Unranked";
    },
    formatTime(timeInMs) {
        const minutes = Math.floor(timeInMs / 60000);
        const seconds = ((timeInMs % 60000) / 1000).toFixed(2);
        return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
      },
    },
  });