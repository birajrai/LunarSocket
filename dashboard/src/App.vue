<template>
  <div>
    <Sidebar v-if="loggedIn" />
    <div id="content-container" v-if="loggedIn">
      <Header />
      <Content />
    </div>
    <Login v-else />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Login from './components/Login.vue';
import Sidebar from './components/Sidebar.vue';
import Header from './components/Header.vue';
import Content from './components/Content/Content.vue';
import { isKeyValid, wsPath } from './api';
import store from './store';
import { HOST } from './constants';
import { updateGraphs } from './components/Content/Main.vue';

export let checkKeyAndProceed: (key: string) => Promise<void>;

export default defineComponent({
  name: 'App',
  components: { Sidebar, Header, Content, Login },
  data: () => ({
    loggedIn: false,
  }),

  methods: {
    async checkKeyAndProceed(key: string): Promise<void> {
      const valid = await isKeyValid(key);

      if (valid) {
        localStorage.setItem('apiKey', key);
        store.commit('setApiKey', key);
        const connect = () => {
          const ws = new WebSocket(
            `${(HOST || window.location.origin).replace('http', 'ws')}${
              wsPath.startsWith('/') ? wsPath : `/${wsPath}`
            }?dashboard=true&apiKey=${store.state.apiKey}`
          );
          ws.onerror = (err) => console.error('[WebSocket]', err);
          ws.onclose = () => {
            console.log('[WebSocket]', 'Disconnected');
            connect();
          };
          ws.onopen = () => console.log('[WebSocket]', 'Connected');
          // skipcq: JS-0045 its fine stop crying
          ws.onmessage = (event) => {
            let msg: {
              type: string;
              data: any;
            } = {
              type: '',
              data: null,
            };
            try {
              msg = JSON.parse(event.data);
            } catch (err) {
              return console.error('[WebSocket]', 'Invalid Message', err);
            }
            const { type, data } = msg;
            switch (type) {
              case 'info':
                this.loggedIn = true;
                setTimeout(() => {
                  store.commit('setStats', data.stats);
                  store.commit('setPlayers', data.players);
                }, 150);
                break;
              case 'updateStats':
                store.state.stats.status = data;
                break;
              case 'updateGraphs':
                if (data.onlineGraph) {
                  if (data.onlineGraph.action === 'add') {
                    store.state.stats.onlineGraph[data.onlineGraph.key] =
                      data.onlineGraph.value;
                  } else if (data.onlineGraph.action === 'remove') {
                    delete store.state.stats.onlineGraph[data.onlineGraph.key];
                  }
                }
                if (data.rankRepartition)
                  store.state.stats.rankRepartition = data.rankRepartition;
                updateGraphs();
                break;
              case 'playerAdd': {
                let index = store.state.players.findIndex(
                  (player) => player.uuid === data.uuid
                );
                if (index < 0) {
                  index = store.state.players.length;
                  store.state.stats.onlinePlayers += 1;
                }
                store.state.players[index] = data;
                break;
              }
              case 'playerRemove':
                if (
                  store.state.players.find((player) => player.uuid === data)
                ) {
                  store.state.stats.onlinePlayers -= 1;
                  store.state.players.splice(
                    store.state.players.findIndex(
                      (player) => player.uuid === data
                    ),
                    1
                  );
                }
                break;
              case 'roleUpdate': {
                const index = store.state.players.findIndex(
                  (player) => player.uuid === data.player
                );
                if (index >= 0) store.state.players[index].role = data.role;
                break;
              }
              case 'updatePlayerServer': {
                const index = store.state.players.findIndex(
                  (player) => player.uuid === data.player
                );
                if (index >= 0) store.state.players[index].server = data.server;
                break;
              }
              case 'event':
                if (store.state.stats.events.length >= 75)
                  store.state.stats.events.pop();
                store.state.stats.events.splice(0, 0, data);
                break;
              default:
                console.error(`Recieved an Unknown Event: ${type}`, data);
                break;
            }
          };
          store.commit('setWebSocket', ws);
        };
        connect();
      } else {
        alert('Your key is invalid');
        localStorage.removeItem('apiKey');
      }
    },
  },

  async created() {
    checkKeyAndProceed = this.checkKeyAndProceed;
    // @ts-ignore
    if (!this.$store.state.apiKey) {
      const key = localStorage.getItem('apiKey');
      if (!key) return;
      await this.checkKeyAndProceed(key);
    }
  },
});
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap');

* {
  --background: #121417;
  --color-text: #f9f9f9;
  --color-border: #1d1f25;
  --color-box: #181b1f;
  --color-light-gray: #d4d6de;
  --color-slightly-light-gray: #b8babd;
  --color-gray: #8a8c8f;
  --color-gray-outline: #8a8c8f25;
  --color-gray-hover: #8a8c8f40;
  --color-purple: #5900fe;
  --color-purple-outline: #5900fe25;
  --color-purple-hover: #5900fe40;
  --color-blue: #00b6fe;
  --color-blue-outline: #00b7fe25;
  --color-blue-hover: #00b7fe40;
  --color-green: #54c877;
  --color-green-outline: #54c87725;
  --color-green-hover: #54c87740;
  --color-gold: #ffda75;
  --color-gold-outline: #ffda7425;
  --color-gold-hover: #ffda7440;
  --color-red: #ff4a4a;
  --color-red-outline: #ff4a4a25;
  --color-red-hover: #ff4a4a40;
  --shadow: rgb(0 0 0 / 15%);

  margin: 0;
  padding: 0;

  font-family: 'Inter', sans-serif;
  color: var(--color-black);
  font-size: 20px;
  line-height: 28px;
}

body {
  background-color: var(--background);
}

option {
  background-color: var(--background);
}

div#content-container {
  margin-left: 15%;
}
</style>
