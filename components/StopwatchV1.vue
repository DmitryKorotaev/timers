<template>
  <b-container fluid>
    <b-row>
      <b-col>
        <b-card>
          <b-card-title> stopWatch </b-card-title>
          <b-card-text>{{ watchTime }} </b-card-text>
          <b-button @click="startStop"
            >{{ running ? "Stop" : "Start" }}
          </b-button>
          <b-button @click="reset" :disabled="!time"> Reset</b-button>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  data() {
    return {
      time: 0,
      running: false,
      intervalId: null,
      lastUpdateTime: 0,
    };
  },

  computed: {
    watchTime() {
      //   const milliseconds = this.time % 1000
      const seconds = Math.floor(this.time / 1000) % 60;
      const minutes = Math.floor(this.time / 60000) % 60;
      const hours = Math.floor(this.time / 3600000);
      return `${this.pad(hours)}:${this.pad(minutes)}:${this.pad(seconds)}`;
    },
  },

  methods: {
    pad(value, length = 2) {
      return String(value).padStart(length, "0");
    },
    startStop() {
      if (this.running) {
        clearInterval(this.intervalId);
        this.running = false;
      } else {
        this.intervalId = setInterval(this.updateTime, 10);
        this.running = true;
      }
    },
    updateTime() {
      this.time += 10;
    },
    reset() {
      clearInterval(this.intervalId);
      this.running = false;
      this.time = 0;
      localStorage.removeItem("timerTime");
    },
    saveTime() {
      localStorage.setItem(`timerTime-${this._uid}`, this.time);
    },
    loadTime() {
      const savedTime = localStorage.getItem(`timerTime-${this._uid}`);
      if (savedTime !== null) {
        this.time = parseInt(savedTime, 10);
      }
    },
  },
  mounted() {
    console.log(this.time, "time");
    console.log(this.updateTime(), "updateTime");
    console.log(this._uid, "_uid");
    this.loadTime();
    window.addEventListener("beforeunload", this.saveTime);
  },
  beforeDestroy() {
    clearInterval(this.intervalId);
    this.saveTime();
    window.removeEventListener("beforeunload", this.saveTime);
  },
};
</script>
