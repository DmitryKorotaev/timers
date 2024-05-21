export const state = () => ({
  stopwatch: [],
});
export const mutations = {
  setStopW(state, stopwatch) {
    state.stopwatch = stopwatch;
  },
  addStopW(state, stopwatch) {
    state.stopwatch.push(stopwatch);
  },
  removeStopW(state, index) {
    state.stopwatch.splice(index, 1);
  },
};
export const action = {
  actionStopwatch({ commit }, stopwatch) {
    commit("updateStopWatch", stopwatch);
  },
};
