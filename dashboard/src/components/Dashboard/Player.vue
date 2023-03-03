<template>
  <div class="container">
    <img class="avatar" :src="`https://cravatar.eu/avatar/${uuid}`" />
    <div class="infos">
      <h4>{{ name }}</h4>
      <p>{{ uuid }}</p>
      <h6>{{ version.substring(1).replace(/_/g, '.') }}</h6>
      <span>{{ server || 'In Menus' }}</span>
      <h5>{{ role }}</h5>
    </div>
    <div class="actions">
      <div
        class="player-action"
        style="background-color: rgba(84, 200, 119, 0.1)"
        @click="sendMessage()"
      >
        <i class="fa-solid fa-message" style="color: rgb(84, 200, 119)"></i>
      </div>
      <div
        class="player-action"
        style="background-color: rgba(59, 161, 219, 0.2)"
        @click="setRole()"
      >
        <i class="fa-solid fa-user-gear" style="color: rgb(59, 161, 219)"></i>
      </div>
      <div
        class="player-action"
        style="background-color: rgba(249, 59, 104, 0.2)"
        @click="kick()"
      >
        <i
          class="fa-solid fa-arrow-right-from-bracket"
          style="color: rgb(255, 59, 104)"
        ></i>
      </div>
      <div
        class="player-action"
        style="background-color: rgba(255, 218, 117, 0.2)"
        @click="crash()"
      >
        <i class="fa-solid fa-skull" style="color: rgb(255, 218, 117)"></i>
      </div>
    </div>
  </div>
</template>

<script alng="ts">
import { defineComponent } from '@vue/runtime-core';
import { crash, kick, sendMessage, setRole } from '../../api';

export default defineComponent({
  name: 'Player',
  props: {
    name: String,
    uuid: String,
    role: String,
    version: String,
    server: String,
  },

  methods: {
    async sendMessage() {
      const message = prompt(
        `What message do you want to send to ${this.$props.name}?`
      );
      await sendMessage(this.$props.uuid, message);
    },
    async setRole() {
      const role = prompt(
        `What role do you want to set for ${this.$props.name}?`
      );
      await setRole(this.$props.uuid, role);
    },
    async kick() {
      const confirmed = confirm(
        `Are you sure you want to kick ${this.$props.name} from the WebSocket?\n\n(They will reconnect pretty soon)`
      );
      if (confirmed) await kick(this.$props.uuid);
    },
    async crash() {
      const confirmed = confirm(
        `Are you sure you want to crash ${this.$props.name}?`
      );
      if (confirmed) await crash(this.$props.uuid);
    },
  },
});
</script>

<style scoped>
div.container {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 15px;
  height: 60px;
  border-radius: 15px;
  margin: 5px 20px;
  display: flex;
  padding-left: 10px;
  justify-content: center;
}

div.infos {
  display: flex;
}

div.infos > *,
div.actions > * {
  margin: auto 0 auto 0;
  text-align: center;
  color: var(--color-light-gray);
}

div.infos > h4 {
  font-weight: 600;
  text-align: left;
  width: 200px;
  color: var(--color-light-gray);
}

div.infos > p {
  font-size: 16px;
  width: 350px;
  color: var(--color-gray);
}

div.infos > h6 {
  font-size: 16px;
  width: 100px;
  color: var(--color-gray);
  font-weight: normal;
}

div.infos > span {
  font-size: 12px;
  width: 100px;
  color: var(--color-gray);
}

div.infos > h5 {
  font-weight: normal;
  width: 150px;
}

div.actions {
  display: flex;
  align-items: center;
  justify-content: center;
}

div.player-action {
  cursor: pointer;
  width: 50px;
  height: 50px;
  border-radius: 16px;
  margin-right: 15px;
}

div.player-action > i {
  margin-top: 16px;
}

img.avatar {
  image-rendering: pixelated;
  width: 45px;
  height: 45px;
  border-radius: 5px;
}
</style>
