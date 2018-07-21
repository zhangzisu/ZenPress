<template>
	<v-app>
		<!-- Main drawer -->
		<v-navigation-drawer v-model="common_drawer" temporary fixed enable-resize-watcher app>
			<v-list>
				<v-list-tile  v-for="(item, i) in main_drawer_content" :key="i" :to="item.link">
					<v-list-tile-action>
						<v-icon v-html="item.icon"/>
					</v-list-tile-action>
					<v-list-tile-content>
						<v-list-tile-title v-text="$t(item.title)"/>
					</v-list-tile-content>
				</v-list-tile>
			</v-list>
		</v-navigation-drawer>

		<!-- Admin drawer -->
		<v-navigation-drawer v-model="admin_drawer" temporary fixed app right>
			<v-toolbar flat>
				<v-list class="pa-0">
					<v-list-tile avatar>
						<v-list-tile-avatar>
							<v-gravatar :email="useremail"/>
						</v-list-tile-avatar>
						<v-list-tile-content>
							<v-list-tile-title>
								{{ username }}
							</v-list-tile-title>
							<v-list-tile-sub-title>
								{{ userrole }}
							</v-list-tile-sub-title>
						</v-list-tile-content>
					</v-list-tile>
				</v-list>
			</v-toolbar>
			<v-divider/>
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
		<v-toolbar app>
			<v-toolbar-side-icon @click.stop="common_drawer = !common_drawer"/>
			<v-toolbar-title v-text="title"/>
			<v-spacer/>
			<v-btn flat @click.stop="admin_drawer = !admin_drawer">
				{{ $t("toggle_admin_panel") }}
			</v-btn>
		</v-toolbar>
		<v-content>
			<router-view/>
		</v-content>
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
      username: "admin",
      useremail: "admin@zhangzisu.cn",
      userrole: "Administrator",
      main_drawer_content: [
        {
          icon: "home",
          title: "home_link",
          link: "/"
        },
        {
          icon: "subject",
          title: "blog_link",
          link: "/blog"
        },
        {
          icon: "help",
          title: "about_link",
          link: "/about"
        }
      ],
      admin_drawer_content: [
        {
          icon: "account_circle",
          title: "user_profile",
          drawer: [
            {
              title: "actions",
              subs: [
                {
                  title: "user_profile_edit",
                  link: "/"
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
                  link: "/"
                }
              ]
            },
            {
              title: "admin",
              subs: [
                {
                  title: "new_post",
                  link: "/"
                }
              ]
            }
          ]
        }
      ]
    };
  }
};
</script>
