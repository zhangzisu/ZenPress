import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    site: {
      _id: "",
      title: "ZenPress",
      menu: [{ icon: "home", title: "Home", link: "/" }],
      owner: {
        name: "",
        email: "",
        bio: "administrator"
      }
    },
    authentication: null,
    querying: false,
    error_status: false,
    error_text: ""
  },
  mutations: {
    site(state, payload) {
      state.site = payload;
    },
    error_status(state, value) {
      state.error_status = value;
    },
    error_text(state, value) {
      state.error_text = value;
    },
    querying(state, value) {
      state.querying = value;
    },
    authenticate(state, value) {
      state.authentication = value;
    }
  },
  actions: {
    async loadSite(context) {
      try {
        context.commit("querying", true);
        let result = await axios.get("/info");
        if (result.status !== 200)
          throw new Error(`HTTP Error ${result.status}: ${result.data}`);
        context.commit("site", result.data);
        context.commit("querying", false);
      } catch (e) {
        context.commit("querying", false);
        context.commit("error_status", true);
        context.commit("error_text", e.message);
      }
    },
    async login(context, password) {
      try {
        context.commit("querying", true);
        let result = await axios.post("/login", { password });
        if (result.status !== 200)
          throw new Error(`HTTP Error ${result.status}: ${result.data}`);
        axios.defaults.headers.auth = result.data;
        context.commit("authenticate", result.data);
        context.commit("querying", false);
      } catch (e) {
        context.commit("querying", false);
        context.commit("error_status", true);
        context.commit("error_text", e.message);
      }
    },
    async logout(context) {
      try {
        context.commit("authenticate", null);
        delete axios.defaults.headers.auth;
      } catch (e) {
        context.commit("querying", false);
        context.commit("error_status", true);
        context.commit("error_text", e.message);
      }
    }
  },
  plugins: [createPersistedState()]
});
