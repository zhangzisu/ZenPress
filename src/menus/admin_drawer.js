const admin_drawer_content = [
  {
    icon: "settings",
    title: "site_management",
    drawer: [
      {
        title: "actions",
        subs: [
          {
            title: "view_stats",
            link: "/admin/site"
          },
          {
            title: "logout",
            link: "/admin/logout"
          }
        ]
      },
      {
        title: "admin",
        subs: [
          {
            title: "edit_site_info",
            link: "/admin/site/info"
          },
          {
            title: "edit_site_menu",
            link: "/admin/site/menu"
          },
          {
            title: "edit_owner_info",
            link: "/admin/site/owner"
          },
          {
            title: "edit_password",
            link: "/admin/site/password"
          }
        ]
      }
    ]
  },
  {
    icon: "subject",
    title: "blog_management",
    drawer: [
      {
        title: "actions",
        subs: [
          {
            title: "new_post",
            link: "/admin/blog/new"
          },
          {
            title: "view_posts",
            link: "/blog"
          }
        ]
      },
      {
        title: "admin",
        subs: [
          {
            title: "manage_posts",
            link: "/admin/blog"
          }
        ]
      }
    ]
  }
];

export default admin_drawer_content;
