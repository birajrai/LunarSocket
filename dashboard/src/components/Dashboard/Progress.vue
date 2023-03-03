<template>
  <div>
    <div class="header">
      <h2 class="title">{{ $props.text }}</h2>
      <h2 class="value">
        {{ $props.displayvalue ? $props.displayvalue : `${currentValue}%` }}
      </h2>
    </div>
    <div class="container">
      <div
        class="completed"
        :style="`background-color: rgb(${color}); width: ${currentValue}%`"
      ></div>
      <div
        class="total"
        :style="`background-color: rgba(${color}, 0.1);`"
      ></div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Progress',
  props: {
    text: String,
    displayvalue: String,
    value: Number,
    max: Number,
    color: String,
  },
  data: () => ({
    currentValue: 50,
  }),
  methods: {
    updateValue() {
      // @ts-ignore
      this.currentValue = (100 * this.$props.value) / this.$props.max;
    },
  },

  watch: {
    value() {
      this.updateValue();
    },
  },

  created() {
    this.updateValue();
  },
});
</script>

<style scoped>
div.header {
  display: flex;
  justify-content: space-between;
  padding: 0 40px;
}

h2 {
  font-size: 14px;
  line-height: 16px;
}

h2.title {
  color: var(--color-gray);
  text-transform: uppercase;
  font-size: 0.6rem;
  letter-spacing: 1px;
}

h2.value {
  color: var(--color-gray);
  text-transform: uppercase;
  font-size: 0.6rem;
  letter-spacing: 1px;
}

div.container {
  margin-top: 8px;
  padding: 0 40px;
}

div.completed {
  border-radius: 16px;
  height: 6px;
}

div.total {
  width: 100%;
  margin-top: -6px;
  border-radius: 16px;
  height: 6px;
}
</style>
