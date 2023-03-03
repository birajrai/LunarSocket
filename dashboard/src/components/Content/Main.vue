<template>
  <div id="container" :style="`height: ${containerHeight}px`">
    <div id="numbers" class="card">
      <Number
        icon="fa-solid fa-earth-americas"
        name="Online"
        :value="String($store.state.stats.onlinePlayers)"
        color="84, 200, 119"
      />
      <Number
        icon="fa-solid fa-fingerprint"
        name="Unique"
        :value="String($store.state.stats.uniquePlayers)"
        color="219, 168, 59"
      />
      <Number
        icon="fa-solid fa-stopwatch"
        name="Latency"
        :value="`${$store.state.stats.lunarLatency}ms`"
        color="59, 161, 219"
      />
      <Number
        icon="fa-solid fa-gauge-simple"
        name="Average"
        :value="String($store.state.stats.averageConnected)"
        color="219, 59, 104"
      />
    </div>
    <div id="events" class="card">
      <div class="card-header">
        <h2>Events</h2>
        <i
          class="fa-solid fa-square-up-right"
          @click="showLogsPage()"
          style="color: var(--color-gray)"
        ></i>
      </div>
      <div id="events-content">
        <Event
          v-for="event in [...$store.state.stats.events].slice(0, 75)"
          :key="event"
          :type="event.type"
          :value="event.value"
        />
        <p>Only showing the first 75 events<br />for your browser's sake</p>
      </div>
    </div>
    <div id="online" class="card">
      <div class="card-header">
        <h2>Online Graph</h2>
      </div>
      <canvas class="graph" ref="onlineGraph"></canvas>
    </div>
    <div id="rank" class="card">
      <div class="card-header">
        <h2>Rank Repartition</h2>
      </div>
      <p>The default role is hidden</p>
      <canvas class="graph" ref="rankGraph"></canvas>
    </div>
    <div id="status" class="card">
      <div class="card-header">
        <h2>Status</h2>
      </div>
      <Number
        id="uptime"
        icon="fa-solid fa-clock"
        name="Up for"
        :value="uptime"
        color="59, 161, 219"
        :disablefixedwidth="true"
      />
      <Progress
        class="progress"
        text="RAM Usage"
        :displayvalue="`${$store.state.stats.status.ramUsage.used} / ${$store.state.stats.status.ramUsage.max} MB`"
        :value="$store.state.stats.status.ramUsage.used"
        :max="$store.state.stats.status.ramUsage.max"
        color="145, 96, 235"
      />
      <Progress
        class="progress"
        text="CPU Usage"
        :value="$store.state.stats.status.cpuUsage.used"
        :max="$store.state.stats.status.cpuUsage.max"
        color="219, 59, 104"
      />
      <Progress
        :displayvalue="`${$store.state.stats.status.diskSpace.used} / ${$store.state.stats.status.diskSpace.max} GB`"
        class="progress"
        text="Disk Space"
        :value="$store.state.stats.status.diskSpace.used"
        :max="$store.state.stats.status.diskSpace.max"
        color="84, 200, 119"
      />
    </div>
    <div id="actions" class="card">
      <div class="card-header">
        <h2>Actions</h2>
      </div>
      <button
        @click="action('update')"
        class="action"
        style="
          color: rgb(84, 200, 119);
          background-color: rgba(84, 200, 119, 0.2);
        "
      >
        <i class="fa-solid fa-wrench" style="color: rgb(84, 200, 119)"></i
        >Update
      </button>
      <button
        @click="action('restart')"
        class="action"
        style="
          color: rgb(59, 161, 219);
          background-color: rgba(59, 161, 219, 0.2);
        "
      >
        <i
          class="fa-solid fa-arrow-rotate-left"
          style="color: rgb(59, 161, 219)"
        ></i
        >Restart
      </button>
      <button
        @click="action('stop')"
        class="action"
        style="
          color: rgb(219, 168, 59);
          background-color: rgba(219, 168, 59, 0.2);
        "
      >
        <i class="fa-solid fa-power-off" style="color: rgb(219, 168, 59)"></i
        >Stop
      </button>
      <button
        @click="action('kill')"
        class="action"
        style="
          color: rgb(219, 59, 104);
          background-color: rgba(219, 59, 104, 0.2);
        "
      >
        <i class="fa-solid fa-skull" style="color: rgb(219, 59, 104)"></i>Kill
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Number from '../Dashboard/Number.vue';
import Event from '../Dashboard/Event.vue';
import Progress from '../Dashboard/Progress.vue';
import { toggleSelect } from '../Sidebar.vue';
import Chart from 'chart.js/auto';
import { sendAction } from '../../api';

export const charts = [];
export let updateGraphs: () => void;

export default defineComponent({
  name: 'Main',
  components: { Number, Event, Progress },

  data: () => ({
    containerHeight: 500,
    uptime: 'Loading...',
  }),

  methods: {
    updateContainerHeight() {
      this.containerHeight = window.innerHeight - 90 - 68 - 25;
    },
    showLogsPage() {
      toggleSelect('Logs');
    },
    async action(action: 'restart' | 'stop' | 'kill') {
      if (confirm(`Are you sure you want to ${action} the remote server?`)) {
        await sendAction(action);
      }
    },
    secondsToHms(d: number) {
      const h = Math.floor(d / 3600);
      const m = Math.floor((d % 3600) / 60);
      const s = Math.floor((d % 3600) % 60);

      const hDisplay = h > 0 ? h + (h == 1 ? ' h ' : ' hrs ') : '';
      const mDisplay = m > 0 ? m + (m == 1 ? ' m ' : ' mins ') : '';
      const sDisplay = s > 0 ? s + (s == 1 ? ' s' : ' s') : '';
      return hDisplay + mDisplay + sDisplay;
    },
    renderOnlineGraph() {
      // @ts-ignore
      const context = this.$refs.onlineGraph.getContext('2d');
      const chart = new Chart(context, {
        type: 'line',
        data: {
          // @ts-ignore
          labels: Object.keys(this.$store.state.stats.onlineGraph),
          datasets: [
            {
              // @ts-ignore
              data: Object.values(this.$store.state.stats.onlineGraph),
              borderColor: '#54c877',
              backgroundColor: '#54c87725',
              tension: 0.2,
            },
          ],
        },
        options: {
          plugins: {
            legend: {
              display: false,
            },
          },
          elements: {
            point: {
              radius: 0,
            },
          },
        },
      });
      // @ts-ignore
      charts.push(chart);
    },
    renderRankGraph() {
      // @ts-ignore
      const context = this.$refs.rankGraph.getContext('2d');
      const chart = new Chart(context, {
        type: 'doughnut',
        data: {
          // @ts-ignore
          labels: Object.keys(this.$store.state.stats.rankRepartition),
          datasets: [
            {
              // @ts-ignore
              data: Object.values(this.$store.state.stats.rankRepartition).map(
                (i: any) => i.amount
              ),
              backgroundColor: Object.values(
                // @ts-ignore
                this.$store.state.stats.rankRepartition
              ).map((i: any) => i.color),
            },
          ],
        },
      });
      // @ts-ignore
      charts.push(chart);
    },
    updateGraphs() {
      for (const chart of charts) {
        // @ts-ignore
        chart.destroy();
      }
      this.renderOnlineGraph();
      this.renderRankGraph();
    },
    updateUptime(uptime: any) {
      console.log(`Uptime changed to ${uptime}`);
      this.uptime = this.secondsToHms(uptime);
      setInterval(
        () =>
          (this.uptime = this.secondsToHms(
            Math.floor(Date.now() / 1000) - uptime
          ))
      );
    },
  },

  created() {
    this.updateContainerHeight();
    window.addEventListener('resize', this.updateContainerHeight);
  },

  mounted() {
    updateGraphs = this.updateGraphs;
    this.renderOnlineGraph();
    this.renderRankGraph();
    // @ts-ignore
    if (this.$store.state.stats.uptime == 0) {
      // @ts-ignore
      const unwatch = this.$store.watch(
        (state: any) => state.stats.uptime,
        (uptime: any) => {
          unwatch();
          this.updateUptime(uptime);
        }
      );
    }
    // @ts-ignore
    else this.updateUptime(this.$store.state.stats.uptime);
  },

  unmounted() {
    charts.length = 0;
    updateGraphs = () => {};
  },
});
</script>

<style scoped>
div#container {
  width: 1400px;
  height: 50px;
  margin: 50px 0 0 60px;
  display: grid;
  grid-template-columns: repeat(6, 180px);
  grid-template-rows: repeat(6, 150px);
  grid-column-gap: 60px;
  grid-row-gap: 35px;
  overflow-y: scroll;
}

div#container::-webkit-scrollbar {
  width: 10px;
  border-radius: 5rem;
  background: transparent;
}

div#container::-webkit-scrollbar-thumb {
  border-radius: 5rem;
  background: var(--color-gray-outline);
}

div#container::-webkit-scrollbar-thumb:hover {
  border-radius: 5rem;
  background: var(--color-gray-hover);
}

div.card {
  background-color: var(--color-box);
  border-radius: 0.5rem;
  border: 1px solid var(--color-border);
  box-shadow: 0 0 5px 0 var(--shadow);
}

div#numbers {
  grid-column: span 4;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
}

div#events {
  grid-column: span 2;
  grid-row: span 5;
  padding: 20px 0;
}

div.card-header {
  padding: 0 25px;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
}

div.card-header > h2 {
  color: var(--color-gray);
  font-size: 1rem;
  font-weight: 600;
  line-height: 28px;
}

div.card-header > i {
  color: var(--color-gray-outline);
  cursor: pointer;
  transition: 0.25s ease-in-out;
}

div.card-header > i:hover {
  color: var(--color-gray);
}

div#events-content {
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  align-items: center;
  height: 95%;
  text-align: center;
}

div#events-content > p {
  color: var(--color-gray);
  margin-top: 15px;
  font-size: 14px;
  line-height: 16px;
}

div#events-content::-webkit-scrollbar {
  display: none;
}

div#online {
  grid-column: span 4;
  grid-row: span 3;
  padding: 20px 0;
}

canvas.graph {
  padding: 20px;
}

div#rank {
  grid-column: span 2;
  grid-row: span 3;
  padding: 20px 0;
  height: 500px;
}

div#rank > p {
  font-size: 14px;
  line-height: 18px;
  color: var(--color-gray);
  margin: -15px 0 0 25px;
}

div#rank > canvas {
  margin-top: 20px;
}

div#status {
  grid-column: span 2;
  grid-row: span 3;
  padding: 20px 0;
  height: 500px;
}

div#uptime {
  margin: 30px 40px;
}

div.progress {
  margin-bottom: 27px;
}

div#actions {
  display: flex;
  flex-direction: column;
  grid-column: span 2;
  grid-row: span 2;
  padding: 20px 0px;
  text-align: center;
  height: 315px;
}

button.action {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  width: 85%;
  border-radius: 0.35rem;
  outline: none;
  border: none;
  margin: 5px 30px;
  cursor: pointer;
  transition: filter 0.2s ease-in-out;
}

button.action:hover {
  filter: brightness(1.5);
}

button.action > i {
  margin-right: 6px;
}
</style>
