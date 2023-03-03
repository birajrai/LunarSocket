<template>
  <div id="container">
    <div id="login">
      <img class="label" src="https://i.imgur.com/NQtjjqv.png" />
      <input
        v-model="apiKey"
        type="password"
        placeholder="Please enter the API key"
      />
      <hr />
      <button @click="go()">
        <i class="fa-solid fa-rocket" style="color: var(--color-blue)"></i>
        Go
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { checkKeyAndProceed } from '../App.vue';

let go: () => Promise<void>;

export default defineComponent({
  name: 'Login',
  data: () => ({
    apiKey: '',
    keyListener: (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        go();
      }
    },
  }),

  methods: {
    async go() {
      if (!this.apiKey) return;
      await checkKeyAndProceed(this.apiKey);
    },
  },

  mounted() {
    go = this.go;
    window.addEventListener('keydown', this.keyListener);
  },

  unmounted() {
    window.removeEventListener('keydown', this.keyListener);
  },
});
</script>

<style scoped>
div#container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: var(--color-background);
}

div#login {
  position: absolute;
  top: 50%;
  left: 50%;
  padding: 25px;
  transform: translate(-50%, -50%);
  width: 400px;
  background-color: var(--color-box);
  border-radius: 25px;
  box-shadow: 0 0 5px 0 var(--shadow);
  animation: fadeIn 0.5s;
  text-align: center;
}

h1 {
  color: var(--color-blue);
  padding: 25px;
  font-size: 36px;
}

h2 {
  color: var(--color-gray);
  font-weight: normal;
}

img.label {
  image-rendering: crisp-edges;
  margin: 25px 0;
  width: 250px;
  filter: brightness(0.9);
}

input {
  display: flex;
  align-items: center;
  justify-content: center;
  outline: none;
  border: none;
  text-transform: uppercase;
  font-weight: 600;
  font-size: 0.65rem;
  color: var(--color-blue);
  background-color: var(--color-blue-outline);
  height: 45px;
  width: 100%;
  border-radius: 0.5rem;
  margin-top: 25px;
  text-align: center;
}

input::placeholder {
  color: var(--color-blue);
}

hr {
  margin: 15px 0;
  border: 1px solid var(--color-border);
  border-radius: 5rem;
}

button {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 45px;
  width: 100%;
  border-radius: 0.5rem;
  outline: none;
  border: none;
  text-transform: uppercase;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  color: var(--color-blue);
  background-color: var(--color-blue-outline);
  transition: background-color 0.25s ease-in-out;
  margin-bottom: 25px;
}

button:hover {
  background-color: var(--color-blue-hover);
}

button > i {
  margin-right: 6px;
}

button.disabled {
  cursor: not-allowed;
}

@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
