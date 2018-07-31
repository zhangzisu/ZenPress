<template>
	<v-app>
		<!-- Main drawer -->
		<v-navigation-drawer v-model="common_drawer" temporary fixed enable-resize-watcher app>
			<v-toolbar flat>
				<v-list class="pa-0">
					<v-list-tile avatar>
						<v-list-tile-avatar>
							<v-gravatar :email="site.owner.email"/>
						</v-list-tile-avatar>
						<v-list-tile-content>
							<v-list-tile-title v-text="site.owner.name"/>
							<v-list-tile-sub-title v-text="site.owner.bio"/>
						</v-list-tile-content>
					</v-list-tile>
				</v-list>
			</v-toolbar>
			<v-divider/>
			<v-list>
				<v-list-tile  v-for="(item, i) in site.menu" :key="i" :to="item.link">
					<v-list-tile-action>
						<v-icon v-html="item.icon"/>
					</v-list-tile-action>
					<v-list-tile-content>
						<v-list-tile-title v-text="item.title"/>
					</v-list-tile-content>
				</v-list-tile>
			</v-list>
		</v-navigation-drawer>

		<!-- Admin drawer -->
		<v-navigation-drawer v-if="authenticated" v-model="admin_drawer" temporary fixed app right>
			<v-list>
				<v-list-group v-for="item in admin_drawer_content" v-if="!item.disallowed" :key="item.title" :prepend-icon="item.icon">
					<v-list-tile slot="activator">
						<v-list-tile-content>
							<v-list-tile-title v-text="$t(item.title)"/>
						</v-list-tile-content>
					</v-list-tile>
					<v-list-group v-for="drawer in item.drawer" v-if="!drawer.disallowed" :key="drawer.title" no-action sub-group>
						<v-list-tile slot="activator">
							<v-list-tile-content>
								<v-list-tile-title v-text="$t(drawer.title)"/>
							</v-list-tile-content>
						</v-list-tile>
						<v-list-tile v-for="sub in drawer.subs" v-if="!sub.disallowed" :key="sub.title" :to="sub.link">
							<v-list-tile-content>
								<v-list-tile-title v-text="$t(sub.title)"/>
							</v-list-tile-content>
						</v-list-tile>
					</v-list-group>
				</v-list-group>
			</v-list>
		</v-navigation-drawer>

		<!-- Main toolbar -->
		<v-toolbar app>
			<v-toolbar-side-icon @click.stop="common_drawer = !common_drawer"/>
			<v-toolbar-title v-text="site.title"/>
			<v-spacer/>
			<v-btn flat @click.stop="toggle_admin">
				{{ $t("toggle_admin_panel") }}
			</v-btn>
		</v-toolbar>
		<v-content>
			<router-view/>

			<!-- Querying -->
			<v-dialog v-model="querying" hide-overlay persistent width="300">
				<v-card>
					<v-card-text>
						{{ $t("wait_text") }}
						<v-progress-linear indeterminate query/>
					</v-card-text>
				</v-card>
			</v-dialog>
			<!-- Error -->
			<v-snackbar v-model="error_status" :timeout="3000" bottom right>
				{{ $t("info") }}: {{ error_text }}
			</v-snackbar>
		</v-content>

		<v-footer class="pa-3">
			<div><a href="https://github.com/ZhangZisu/ZenPress" target="_blank">ZenPress</a> version.{{ version }}</div>
			<v-spacer/>
			<div>&copy; {{ new Date().getFullYear() }}</div>
		</v-footer>
	</v-app>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      common_drawer: false,
      title: "ZenPress",
      admin_drawer: false,
      admin_drawer_content: [
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
      ],
      version: "0.1.6"
    };
  },
  computed: {
    error_status: {
      get: function() {
        return this.$store.state.error_status;
      },
      set: function(value) {
        this.$store.commit("error_status", value);
      }
    },
    error_text: function() {
      return this.$store.state.error_text;
    },
    querying: {
      get: function() {
        return this.$store.state.querying;
      },
      set: function(value) {
        this.$store.commit("querying", value);
      }
    },
    site: function() {
      return this.$store.state.site;
    },
    authenticated: function() {
      return !!this.$store.state.authentication;
    }
  },
  created() {
    this.$store.dispatch("loadSite");
  },
  methods: {
    toggle_admin() {
      if (this.authenticated) {
        this.admin_drawer = !this.admin_drawer;
      } else {
        this.$router.push("/login");
      }
    }
  }
};
</script>
