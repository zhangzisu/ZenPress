<template>
	<v-container fluid>
		<v-layout>
			<v-flex>
				<v-card>
					<v-card-title primary-title>
						<div>
							<div class="headline" v-text="$t('site_menu_edit')"/>
							<div class="subheading" v-text="$t('site_menu_edit_subtitle')"/>
						</div>
					</v-card-title>
					<v-card-text>
						<v-list two-line>
							<v-list-tile v-for="(item, id) in menu" :key="id" avatar>
								<v-list-tile-avatar>
									<v-icon>{{ item.icon }}</v-icon>
								</v-list-tile-avatar>
								<v-list-tile-title v-text="item.title"/>
								<v-list-tile-sub-title v-text="item.link"/>
								<v-list-tile-action>
									<v-menu offset-y>
										<v-btn slot="activator" icon>
											<v-icon>settings</v-icon>
										</v-btn>
										<v-list>
											<v-list-tile>
												<v-list-tile-title v-text="$t('delete')"/>
											</v-list-tile>
											<v-list-tile>
												<v-list-tile-title v-text="$t('move_up')"/>
											</v-list-tile>
											<v-list-tile>
												<v-list-tile-title v-text="$t('move_down')"/>
											</v-list-tile>
										</v-list>
									</v-menu>
								</v-list-tile-action>
							</v-list-tile>
						</v-list>
					</v-card-text>
					<v-card-actions>
						<v-dialog v-model="dialog" width="500">
							<v-btn slot="activator" depressed @click="newItem" v-text="$t('new_item')"/>
							<v-card>
								<v-card-title primary-title>
									<div class="headline" v-text="$t('new_item')"/>
								</v-card-title>
								<v-card-text>
									<v-form v-model="valid">
										<v-text-field v-model="form.icon" :label="$t('icon')"/>
										<v-text-field v-model="form.title" :rules="[noEmpty]" :label="$t('title')"/>
										<v-text-field v-model="form.link" :rules="[noEmpty]" :label="$t('link')"/>
									</v-form>
								</v-card-text>
								<v-card-actions>
									<v-spacer/>
									<v-btn flat @click="cancelNewItem" v-text="$t('cancel')"/>
									<v-btn :disabled="!valid" color="primary" flat @click="confirmNewItem" v-text="$t('ok')"/>
								</v-card-actions>
							</v-card>
						</v-dialog>
						<v-spacer/>
						<v-btn depressed color="secondary" @click="$router.go(-1)" v-text="$t('cancel')"/>
						<v-btn depressed color="primary" @click="submit" v-text="$t('submit')"/>
					</v-card-actions>
				</v-card>
			</v-flex>
		</v-layout>
	</v-container>
</template>

<script>
import axios from "axios";

export default {
  name: "site_menu_edit",
  data() {
    return {
      menu: [{ icon: "home", title: "Home", link: "/" }],
      dialog: false,
      form: {
        icon: "",
        title: "",
        link: ""
      },
      valid: false
    };
  },
  methods: {
    noEmpty(value) {
      return value.length > 0 || "Cannot be empty";
    },
    syncData() {
      this.menu = this.$store.state.site.menu;
    },
    newItem() {
      this.dialog = true;
    },
    cancelNewItem() {
      this.dialog = false;
      this.form.icon = "";
      this.form.title = "";
      this.form.link = "";
    },
    confirmNewItem() {
      this.dialog = false;
      this.menu.push(Object.assign({}, this.form));
      this.form.icon = "";
      this.form.title = "";
      this.form.link = "";
    },
    async submit() {
      try {
        this.$store.commit("querying", true);
        let result = await axios.put("/site/modify/menu", { menu: this.menu });
        if (result.status !== 200)
          throw new Error(`HTTP Error ${result.status}: ${result.data}`);
        this.$store.commit("querying", false);
        this.$store.dispatch("loadSite");
        this.$router.push("/");
      } catch (e) {
        this.$store.commit("querying", false);
        this.$store.commit("error_status", true);
        this.$store.commit("error_text", e.message);
      }
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.syncData();
    });
  },
  beforeRouteUpdate(to, from, next) {
    next();
    this.syncData();
  }
};
</script>
