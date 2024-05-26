<template>
  <b-container fluid>
    <h1>Секундомер онлайн</h1>
    <b-row>
      <b-col
        sm="12"
        md="6"
        lg="4"
        v-for="(timer, index) in timers"
        :key="timer.id"
      >
        <b-card class="transparent-card">
          <div class="remove-button-container">
            <button class="b-button transparent" @click="removeTimer(index)">
              <b-icon icon="x-lg" class="rotate-on-hoverX color"></b-icon>
            </button>
          </div>
          <!-- <b-card-title class="timerTitle">
            Секундомер{{ index + 1 }}
          </b-card-title> -->
          <!-- <div> -->
          <b-card-text class="timer d-inline"
            >{{ formatTime(timer.time) }}
          </b-card-text>
          <!-- <b-card-text class="timerLower d-inline">{{
              millisecondsTime(timer.time)
            }}</b-card-text> -->
          <!-- </div> -->
          <div class="transparent-button">
            <b-button @click="startStop(index)"
              ><b-icon
                :icon="timer.running ? 'stop-fill' : 'play-fill'"
              ></b-icon>
              {{ timer.running ? "Стоп" : "Старт" }}
            </b-button>
            <b-button class="b-button" @click="reset(index)">
              <b-icon
                icon="arrow-clockwise"
                class="rotate-on-hoverRes"
              ></b-icon>
              Сброс
            </b-button>
          </div>
        </b-card>
      </b-col>
    </b-row>
    <div class="addButton">
      <b-button class="b-button btn-white" @click="addTimer"
        ><b-icon icon="plus" class="rotate-on-hoverX large-icon"></b-icon>
        Добавить секундомер</b-button
      >
    </div>
  </b-container>
</template>

<script>
export default {
  data() {
    return {
      timers: [],
      isAnimating: false,
    };
  },

  methods: {
    animateIcon() {
      this.isAnimating = true;
      setTimeout(() => {
        this.isAnimating = false;
      }, 1000); // Время анимации совпадает с её длительностью в CSS
    },

    pad(num) {
      return num.toString().padStart(2, "0");
    },

    padMilliseconds(num) {
      return num.toString().padStart(3, "0");
    },

    formatTime(time) {
      const milliseconds = time % 1000;
      const seconds = Math.floor(time / 1000) % 60;
      const minutes = Math.floor(time / 60000) % 60;
      const hours = Math.floor(time / 3600000);
      return `${this.pad(hours)}:${this.pad(minutes)}:${this.pad(seconds)}`;
    },
    // millisecondsTime(time) {
    //   const milliseconds = time % 1000;
    //   return `:${this.padMilliseconds(milliseconds)}`;
    // },

    addTimer() {
      const randomString = Math.random().toString(36).substring(2, 11);
      const newTimer = {
        id: Date.now() + randomString,
        time: 0,
        running: false,
        intervalId: null,
      };
      this.timers.push(newTimer);
      this.saveTimers();
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
      this.saveTimers();
    },

    reset(index) {
      const timer = this.timers[index];
      clearInterval(timer.intervalId);
      timer.running = false;
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
      if (savedTimers && Array.isArray(savedTimers) && savedTimers.length > 0) {
        // Если данные были найдены (и не являются пустыми или null),
        // мы присваиваем их переменной this.timers, чтобы обновить состояние
        // массива таймеров в компоненте
        this.timers = savedTimers;
      } else {
        this.timers = [];
        for (let i = 0; i < 3; i++) {
          this.addTimer();
        }
      }
    },

    stopAllTimers() {
      this.timers.forEach((timer) => {
        if (timer.running) {
          clearInterval(timer.intervalId);
          timer.running = false;
        }
      });
      this.saveTimers();
    },
  },

  mounted() {
    this.loadTimers();
    window.addEventListener("beforeunload", this.stopAllTimers);
  },

  beforeDestroy() {
    this.stopAllTimers();
    window.removeEventListener("beforeunload", this.stopAllTimers); // Удаление обработчика события
  },
};
</script>
