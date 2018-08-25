// Async part
const admin_home = () =>
  import(/* webpackChunkName: "group-admin" */ "./admin_home.vue");
const blog_edit = () =>
  import(/* webpackChunkName: "group-admin" */ "./blog_edit.vue");
const site_info_edit = () =>
  import(/* webpackChunkName: "group-admin" */ "./site_info_edit.vue");
const site_menu_edit = () =>
  import(/* webpackChunkName: "group-admin" */ "./site_menu_edit.vue");
const site_owner_edit = () =>
  import(/* webpackChunkName: "group-admin" */ "./site_owner_edit.vue");
const site_password_edit = () =>
  import(/* webpackChunkName: "group-admin" */ "./site_password_edit.vue");
const site_statistics = () =>
  import(/* webpackChunkName: "group-admin" */ "./site_statistics.vue");

// Sync part
import blog_details from "./blog_details.vue";
import blog_home from "./blog_home.vue";
import blog_list from "./blog_list.vue";
import logout from "./logout.vue";

export {
  admin_home,
  blog_details,
  blog_edit,
  blog_home,
  blog_list,
  logout,
  site_info_edit,
  site_menu_edit,
  site_owner_edit,
  site_password_edit,
  site_statistics
};
