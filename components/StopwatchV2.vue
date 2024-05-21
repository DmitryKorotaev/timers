<template>
  <b-container fluid>
    <b-row>
      <b-col v-for="(timer, index) in timers" :key="index.id">
        <b-card>
          <b-card-title> stopWatch{{ index + 1 }} </b-card-title>
          <b-card-text>{{ formatTime(timer.time) }} </b-card-text>
          <b-button
            @click="startStop(index)"
            :variant="timer.running ? 'danger' : 'success'"
            >{{ timer.running ? "Stop" : "Start" }}
          </b-button>
          <b-button
            variant="outline-primary"
            @click="reset(index)"
            :disabled="!timer.time"
            >Reset</b-button
          >
          <b-button variant="danger" @click="removeTimer(index)"
            >Remove
          </b-button>
        </b-card>
      </b-col>
    </b-row>
    <b-button variant="success" @click="addTimer">Add Timer</b-button>
  </b-container>
</template>

<script>
export default {
  data() {
    return {
      timers: [],
    };
  },
  methods: {
    pad(value, length = 2) {
      return String(value).padStart(length, "0");
    },
    formatTime(time) {
      const seconds = Math.floor(time / 1000) % 60;
      const minutes = Math.floor(time / 60000) % 60;
      const hours = Math.floor(time / 3600000);
      return `${this.pad(hours)}:${this.pad(minutes)}:${this.pad(seconds)}`;
    },
    addTimer() {
      const newTimer = {
        id: Date.now(),
        time: 0,
        running: false,
        indervalId: null,
      };
      this.timers.push(newTimer);
    },
    startStop(index) {
      const timer = this.timers[index];
      if (timer.running) {
        clearInterval(timer.intervalId);
        timer.running = false;
      } else {
        timer.intervalId = setInterval(() => {
          timer.time += 10;
          this.saveTimers();
        }, 10);
        timer.running = true;
      }
    },
    reset(index) {
      const timer = this.timers[index];
      clearInterval(timer.indervalId);
      timer.runnimg = false;
      timer.time = 0;
      this.saveTimers();
    },
    removeTimer(index) {
      clearInterval(this.timers[index].intervalId);
      this.timers.splice(index, 1);
      this.saveTimers();
    },
    saveTimers() {
      localStorage.setItem("timers", JSON.stringify(this.timers));
    },
    loadTimers() {
      const savedTimers = JSON.parse(localStorage.getItem("timers"));
      // Проверяем, были ли сохраненные данные
      if (savedTimers != false) {
        // Если данные были найдены (и не являются пустыми или null),
        // мы присваиваем их переменной this.timers, чтобы обновить состояние
        // массива таймеров в компоненте
        this.timers = savedTimers;
      } else {
        for (let i = 0; i < 3; i++) {
          this.addTimer();
        }
      }
    },
  },
  mounted() {
    this.loadTimers();
    window.addEventListener("beforeunload", this.saveTimers);
  },
  beforeDestroy() {
    this.saveTimers();
    window.removeEventListener("beforeunload", this.saveTimers); // Удаление обработчика события
  },
};
</script>
