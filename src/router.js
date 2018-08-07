import Vue from "vue";
import Router from "vue-router";
import store from "./store";
import * as views from "./views";
import * as components from "./components";

Vue.use(Router);

let router = new Router({
  routes: [
    {
      path: "/",
      name: "home",
      component: views.home
    },
    {
      path: "/blog",
      component: views.blog,
      children: [
        {
          path: "",
          name: "blog",
          component: components.blog_home
        },
        {
          path: ":id",
          component: components.blog_details,
          props: function(route) {
            return { post_id: route.params.id };
          }
        }
      ]
    },
    {
      path: "/login",
      name: "login",
      component: views.login,
      beforeEnter: (to, from, next) => {
        if (store.state.authentication) {
          next("/");
        } else {
          next();
        }
      },
      meta: { title: "Login" }
    },
    {
      path: "/admin",
      component: views.admin,
      beforeEnter: (to, from, next) => {
        if (store.state.authentication) {
          next();
        } else {
          next("/login");
        }
      },
      children: [
        {
          path: "",
          name: "admin",
          component: components.admin_home
        },
        {
          path: "logout",
          component: components.logout
        },
        {
          path: "site",
          component: components.site_statistics
        },
        {
          path: "site/info",
          component: components.site_info_edit
        },
        {
          path: "site/menu",
          component: components.site_menu_edit
        },
        {
          path: "site/owner",
          component: components.site_owner_edit
        },
        {
          path: "site/password",
          component: components.site_password_edit
        },
        {
          path: "blog",
          component: components.blog_list
        },
        {
          path: "blog/new",
          name: "new_blog",
          component: components.blog_edit
        },
        {
          path: "blog/edit/:id",
          name: "edit_blog",
          component: components.blog_edit
        }
      ],
      meta: { title: "Administration" }
    },
    {
      path: "*",
      name: "error404",
      component: views.error,
      props: {
        type: "404",
        summary: "http_error_404",
        details: "The requested path cannot be found."
      }
    }
  ]
});

router.beforeEach((to, from, next) => {
  if (to.meta && to.meta.title) {
    document.title = to.meta.title;
  } else {
    document.title = store.state.site.title;
  }
  next();
});

export default router;
