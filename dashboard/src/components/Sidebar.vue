<template>
  <div id="container">
    <div class="header">
      <img class="label" src="https://i.imgur.com/NQtjjqv.png" />
      <h3 id="subtitle">DASHBOARD</h3>
    </div>
    <div id="buttons">
      <i
        id="tab-indicator"
        :style="`top:${
          135 + dashboardButtons.findIndex((i) => i.selected) * 70
        }px`"
      ></i>
      <div
        class="button"
        v-for="button in dashboardButtons"
        :class="button.selected ? 'selected' : 'not-selected'"
        v-bind:key="button"
        @click="toggleSelect(button.text)"
      >
        <i :class="button.icon"></i>
        <p>{{ button.text }}</p>
      </div>
      <div
        class="button logout"
        v-for="button in adminButtons"
        v-bind:key="button"
        @click="adminAction(button.action)"
      >
        <i :class="button.icon"></i>{{ button.text }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

let toggleSelect: (newButton: string) => void;
export { toggleSelect };

export default defineComponent({
  name: 'Sidebar',
  data: () => ({
    dashboardButtons: [
      {
        icon: 'fa-solid fa-compass',
        text: 'Overview',
        tab: 'Main',
        selected: false,
      },
      {
        icon: 'fa-solid fa-user',
        text: 'Online',
        tab: 'Players',
        selected: false,
      },
      {
        icon: 'fa-solid fa-terminal',
        text: 'Logs',
        tab: 'Logs',
        selected: false,
      },
    ],
    adminButtons: [
      {
        icon: '',
        text: 'Logout',
        action: 'logout',
      },
    ],
  }),

  methods: {
    toggleSelect(newButton: string): void {
      for (const button of this.dashboardButtons) {
        button.selected = button.text === newButton;
        if (button.selected)
          // @ts-ignore
          this.$store.commit('setActiveTab', button.tab);
      }
    },
    adminAction(action: 'logout') {
      switch (action) {
        case 'logout':
          if (!confirm('Are you sure you wanna logout?')) return;
          localStorage.removeItem('apiKey');
          window.location.reload();
          break;

        default:
          break;
      }
    },
  },

  created() {
    toggleSelect = this.toggleSelect;
    this.toggleSelect(this.dashboardButtons[0].text);
  },
});
</script>

<style scoped>
div#container {
  position: fixed;
  top: 0;
  left: 0;
  width: 275px;
  height: 100vh;
  background-color: var(--color-box);
  display: flex;
  padding: 0 0;
  box-shadow: 0 0 5px 0 var(--shadow);
  flex-direction: column;
  align-items: center;
  justify-content: top;
  text-align: center;
}

div.header {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: left;
  width: 100%;
  height: 100px;
}

img.label {
  image-rendering: optimizeQuality;
  image-rendering: crisp-edges;
  filter: drop-shadow(0 2.5px 0 var(--shadow));
  margin: 5px 0;
  width: 175px;
}

h3#subtitle {
  position: absolute;
  transform: translate(12px, -17px);
  font-style: italic;
  letter-spacing: 2px;
  font-size: 10px;
  line-height: 28px;
  color: var(--color-blue);
}

div#buttons {
  display: flex;
  flex-direction: column;
  gap: 25px;
  margin: 25px auto 0 auto;
}

div.button {
  display: flex;
  gap: 15px;
  align-items: center;
  justify-content: center;
  color: var(--color-gray);
  cursor: pointer;
  width: 250px;
  height: 45px;
  font-size: 0.85rem;
  letter-spacing: -0.25px;
  font-weight: 600;
  text-align: center;
  border-radius: 0.25rem;
  transition: background-color 0.15s ease-in-out;
}

div.button:hover {
  background-color: var(--color-gray-outline);
}

div.button > i {
  position: absolute;
  left: 35px;
  font-size: 0.95rem;
  color: var(--color-gray);
  transition: color 0.15s ease-in-out;
}

div.button > p {
  margin: 0;
  padding: 0;
  position: absolute;
  left: 75px;
  font-size: 0.8rem;
  transition: color 0.15s ease-in-out;
}

div.button:hover > i {
  color: var(--color-light-gray);
}

div.button.selected {
  background-color: var(--color-blue-outline);
  color: var(--color-blue);
}

div.button.selected > i {
  color: var(--color-blue);
}

div.button.logout {
  position: absolute;
  bottom: 50px;
  background-color: var(--color-red-outline);
  color: var(--color-red);
}

div.button:hover.logout {
  background-color: var(--color-red-hover);
}

div.button.logout > i {
  visibility: hidden;
  color: var(--color-red);
}

i#tab-indicator {
  position: fixed;
  width: 5px;
  height: 25px;
  border-radius: 5rem;
  background: var(--color-blue);
  left: -1.5px;
  transition: top 0.25s ease-out;
}
</style>
