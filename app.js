
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
          ? "coal I"
          : elo > 200 && elo < 399
          ? "coal II"
          : elo > 400 && elo < 599
          ? "coal III"
          : elo > 600 && elo < 799
          ? "iron I"
          : elo > 800 && elo < 999
          ? "iron II"
          : elo > 1000 && elo < 1199
          ? "iron III"
          : elo > 1200 && elo < 1399
          ? "gold I"
          : elo > 1400 && elo < 1599
          ? "gold II"
          : elo > 1600 && elo < 1799
          ? "gold III"
          : elo > 1800 && elo < 1999
          ? "diamond I"
          : (elo > 2000) & (elo < 2199)
          ? "diamond II"
          : elo > 2200 && elo < 2399
          ? "diamond III"
          : "";
    },
    formatTime(timeInMs) {
        const minutes = Math.floor(timeInMs / 60000);
        const seconds = ((timeInMs % 60000) / 1000).toFixed(2);
        return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
      },
    },
  });