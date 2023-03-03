<template>
  <div id="container" :style="`height: ${containerHeight}px`">
    <div id="header">
      <h3>Log Entries: {{ $store.state.stats.events.length }}</h3>
      <div>
        <label for="limit">Show </label>
        <select name="limit" id="limit" @change="updateList()" v-model="limit">
          <option v-for="option in limitOptions" :key="option" :value="option">
            {{ option }} entries
          </option>
        </select>
      </div>
    </div>
    <div id="content" :style="`height: ${containerHeight - 85}px`">
      <EventComponent
        v-for="event of events"
        :key="event.value"
        :type="event.type"
        :value="event.value"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/runtime-core';
import EventComponent from '../Dashboard/Event.vue';

export default defineComponent({
  name: 'Logs',
  components: { EventComponent },
  data: () => ({
    limit: 25,
    limitOptions: [25, 50, 75, 100, 150, 200, 300, 500, 1000],
    events: [] as { type: string; value: any }[],
    containerHeight: 500,
  }),

  methods: {
    updateContainerHeight() {
      this.containerHeight = window.innerHeight - 90 - 68 - 25;
    },
    updateList() {
      // @ts-ignore
      this.events = [...this.$store.state.stats.events];
      this.events.length = this.limit;
      this.events = this.events.filter((p) => p);
    },
  },

  created() {
    this.updateContainerHeight();
    window.addEventListener('resize', this.updateContainerHeight);
    this.updateList();
  },
});
</script>

<style scoped>
div#container {
  background-color: var(--color-box);
  border-radius: 0.5rem;
  border: 1px solid var(--color-border);
  box-shadow: 0 0 5px 0 var(--shadow);
  margin: 50px 0 0 60px;
  width: 1200px;
}

div#header {
  padding: 25px;
  display: flex;
  justify-content: space-between;
  color: var(--color-gray);
}

select {
  border-radius: 10px;
}

div#content {
  height: 80%;
  overflow-y: scroll;
  margin-left: 5%;
}

div.event-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-left: 80px;
  width: 80%;
  margin-bottom: 10px;
}

div#content::-webkit-scrollbar {
  display: none;
}

#limit {
  background-color: var(--color-gray-outline);
  color: var(--color-light-gray);
  font-size: 0.8em;
  border: solid 1px var(--color-light-gray);
  padding: 3px 5px;
}
</style>
