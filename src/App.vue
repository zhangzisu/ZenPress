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
				<v-list-tile  v-for="(item, i) in site.menu" :key="`sm_${i}`" :to="item.link">
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
				<v-list-group v-for="item in admin_drawer_content" v-if="!item.disallowed" :key="`adc${item.title}`" :prepend-icon="item.icon">
					<v-list-tile slot="activator">
						<v-list-tile-content>
							<v-list-tile-title v-text="$t(item.title)"/>
						</v-list-tile-content>
					</v-list-tile>
					<v-list-group v-for="drawer in item.drawer" v-if="!drawer.disallowed" :key="`id${drawer.title}`" no-action sub-group>
						<v-list-tile slot="activator">
							<v-list-tile-content>
								<v-list-tile-title v-text="$t(drawer.title)"/>
							</v-list-tile-content>
						</v-list-tile>
						<v-list-tile v-for="sub in drawer.subs" v-if="!sub.disallowed" :key="`ds${sub.title}`" :to="sub.link">
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
			<v-menu offset-y>
				<v-btn slot="activator" icon flat>
					<v-icon>language</v-icon>
				</v-btn>
				<v-list>
					<v-list-tile v-for="(lang, i) in languages" :key="`lang${i}`" ripple @click="changeLang(lang.name)">
						<v-list-tile-title v-text="lang.display_name"/>
					</v-list-tile>
				</v-list>
			</v-menu>
			<v-btn icon flat @click.stop="toggle_admin">
				<v-icon>settings</v-icon>
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
			<div><a href="https://github.com/ZhangZisu/ZenPress" target="_blank">ZenPress</a>&nbsp;{{ version }}&nbsp;</div>
			<a @click="clearTagCache" v-text="$t('clear_tag_cache')"/>
			<v-spacer/>
			<div>&copy;&nbsp;{{ site.owner.name }}&nbsp;{{ new Date().getFullYear() }}</div>
		</v-footer>
	</v-app>
</template>

<script>
import admin_drawer_content from "./menus/admin_drawer";

export default {
  name: "App",
  data() {
    return {
      common_drawer: false,
      title: "ZenPress",
      admin_drawer: false,
      admin_drawer_content: admin_drawer_content,
      languages: [
        {
          name: "en",
          display_name: "English"
        },
        {
          name: "zh",
          display_name: "中文"
        }
      ],
      version: "0.3.3"
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
    this.$store.commit("init");
    this.$store.dispatch("loadSite");
  },
  methods: {
    toggle_admin() {
      if (this.authenticated) {
        this.admin_drawer = !this.admin_drawer;
      } else {
        this.$router.push("/login");
      }
    },
    changeLang(lang) {
      this.$i18n.locale = lang;
    },
    clearTagCache() {
      this.$store.commit("purgeTags");
      this.$store.commit("error_status", true);
      this.$store.commit("error_text", "success");
    }
  }
};
</script>
