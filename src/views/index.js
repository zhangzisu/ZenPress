// Async part
const admin = () => import(/* webpackChunkName: "group-admin" */ "./admin.vue");
// Sync part
import about from "./about.vue";
import blog from "./blog.vue";
import error from "./error.vue";
import home from "./home.vue";
import login from "./login.vue";

export { about, admin, blog, error, home, login };
