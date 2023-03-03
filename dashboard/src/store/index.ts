import { createStore } from 'vuex';
// @ts-ignore
import { updateGraphs } from '../components/Content/Main.vue';

export default createStore({
  state: {
    activeTab: '',
    apiKey: '',
    stats: {
      uptime: 0,
      onlinePlayers: 'Loading' as unknown as number,
      uniquePlayers: 'Loading',
      lunarLatency: 'Loading',
      averageConnected: 'Loading',
      events: [] as { type: string; value: any }[],
      onlineGraph: {} as { [key: string]: number },
      rankRepartition: {},
      status: {
        ramUsage: {
          used: 3400,
          max: 8192,
        },
        cpuUsage: {
          used: 69,
          max: 100,
        },
        diskSpace: {
          used: 123,
          max: 1000,
        },
      },
      wsPath: '/',
    },
    players: [] as Player[],
    websocket: null as unknown as WebSocket,
  },
  mutations: {
    setActiveTab(state, tab) {
      state.activeTab = tab;
    },
    setApiKey(state, apiKey) {
      state.apiKey = apiKey;
    },
    setStats(state, stats) {
      state.stats = stats;
      updateGraphs();
      state.stats.uptime = Math.floor(Date.now() / 1000) - state.stats.uptime;
    },
    setPlayers(state, players: Player[]) {
      state.players = players;
    },
    setWebSocket(state, websocket: WebSocket) {
      state.websocket = websocket;
    },
  },
});

export interface Player {
  uuid: string;
  username: string;
  role: string;
  server: string;
  version: string;
}
