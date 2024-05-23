<template>
  <b-container
    fluid
    :style="{
      // '--cursor-x': cursorX + 'px',
      // '--cursor-y': cursorY + 'px',
    }"
  >
    <b-row>
      <b-col
        sm="auto"
        md="auto"
        lg="auto"
        xl="auto"
        v-for="(timer, index) in timers"
        :key="timer.id"
      >
        <b-card>
          <b-card-title class="timerTitle">
            Секундомер{{ index + 1 }}
          </b-card-title>
          <div>
            <b-card-text class="timer d-inline"
              >{{ formatTime(timer.time) }}
            </b-card-text>
            <!-- <b-card-text class="timerLower d-inline">{{
              millisecondsTime(timer.time)
            }}</b-card-text> -->
          </div>
          <div class="p-4">
            <b-button
              @click="startStop(index)"
              :variant="timer.running ? 'danger' : 'success'"
              ><b-icon
                :icon="timer.running ? 'stop-fill' : 'play-fill'"
              ></b-icon>
              {{ timer.running ? "Стоп" : "Старт" }}
            </b-button>
            <b-button
              class="b-button"
              variant="outline-primary"
              @click="reset(index)"
              :disabled="!timer.time"
            >
              <b-icon
                icon="arrow-clockwise"
                class="rotate-on-hoverRes"
              ></b-icon>
              Сброс
            </b-button>
            <b-button
              class="b-button"
              variant="danger"
              @click="removeTimer(index)"
            >
              <b-icon icon="x" class="rotate-on-hoverX large-icon"></b-icon
              >Удалить
            </b-button>
          </div>
        </b-card>
      </b-col>
    </b-row>
    <b-button class="b-button" variant="success" @click="addTimer"
      ><b-icon icon="plus" class="rotate-on-hoverX large-icon"></b-icon>
      Добавить секундомер</b-button
    >
  </b-container>
</template>

<script>
export default {
  data() {
    return {
      timers: [],
      isAnimating: false,
      // cursorX: 0,
      // cursorY: 0,
    };
  },

  methods: {
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
      return `${this.pad(hours)}:${this.pad(minutes)}:${this.pad(
        seconds
      )}:${this.padMilliseconds(milliseconds)}`;
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
    //cursor
    // updateCursorPosition(event) {
    //   this.cursorX = event.clientX;
    //   this.cursorY = event.clientY;
    // },
    //cursor
    animateIcon() {
      this.isAnimating = true;
      setTimeout(() => {
        this.isAnimating = false;
      }, 1000); // Время анимации совпадает с её длительностью в CSS
    },
  },
  mounted() {
    //cursor
    // document.addEventListener("mousemove", this.updateCursorPosition);
    //cursor
    this.loadTimers();
    this.timers.forEach((timer) => {
      timer.running = false; // Установка running в false для каждого таймера
    });
    window.addEventListener("beforeunload", this.saveTimers);
  },
  beforeDestroy() {
    //cursor
    // document.removeEventListener("mousemove", this.updateCursorPosition);
    //cursor
    this.timers.forEach((timer) => clearInterval(timer.intervalId));
    window.removeEventListener("beforeunload", this.saveTimers); // Удаление обработчика события
  },
};
</script>
<style>
/* .container-fluid {
  text-align: center;

  padding: 2rem;
  position: relative;
  width: 100%;
  height: 100%;
  background-color: rgba(63, 62, 62);
  transition: backdrop-filter 0.1s ease; 
}
.container-fluid::before {
  content: "";
  position: absolute;
  left: var(--cursor-x);
  top: var(--cursor-y);
  width: 25rem;
  height: 25rem;
  border-radius: 50%;
  pointer-events: none;
  background: radial-gradient(
    circle,
    rgb(248, 243, 243) 0%,
    rgba(242, 237, 237, 0.805) 50px,
    rgba(232, 226, 226, 0.636) 100px
  );
  transform: translate(-50%, -50%);
  transition: left 0.1s ease-out, top 0.1s ease-out; 
  filter: blur(1rem); 
} */
.container-fluid {
  padding: 2rem;
  height: 100vh;
  background: linear-gradient(to right, #ebfb58, #ef68ac, #9564f0);
  background-size: 200% 200%;
  animation: gradientAnimation 15s ease infinite;
}
.col {
  padding: 0px;
}
.card {
  border-radius: 0.5rem;
  width: auto;
  margin: 1rem 0rem 1rem 0rem;
  text-align: center;
}
.timerTitle {
  color: #333;
}

.timer,
.timerLower {
  font-family: "Roboto";
  font-weight: 100;
}
.timer {
  font-size: 4.5rem;
}
.timerLower {
  font-size: 4.5rem;
}
@media (max-width: 576px) {
  .container-fluid {
    padding: 0.5rem;
  }
  .card {
    width: 100%;
    height: auto;
    border-radius: 0.5rem;
  }
}
@keyframes rotateX {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(180deg);
  }
}
@keyframes rotateRes {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
@keyframes gradientAnimation {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.b-button:hover .rotate-on-hoverX {
  animation: rotateX 0.2s linear;
}
.b-button:hover .rotate-on-hoverRes {
  animation: rotateRes 0.2s linear;
}
</style>
