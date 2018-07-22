import Vue from "vue";
import Vuex from "vuex";

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
    }
  },
  actions: {
    async loadSite(context) {
      context.commit("querying", true);
      setTimeout(() => {
        context.commit("querying", false);
        context.commit("site", {
          _id: 666,
          title: "ZenPress ZhangZisu",
          menu: [
            { icon: "home", title: "home", link: "/" },
            { icon: "subject", title: "blog", link: "/blog" }
          ],
          owner: {
            name: "ZhangZisu",
            email: "admin@zhangzisu.cn",
            bio: "Bio"
          }
        });
      }, 2000);
    }
  }
});
