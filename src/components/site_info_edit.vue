<template>
	<v-container fluid>
		<v-layout>
			<v-flex>
				<v-form v-model="valid">
					<v-card>
						<v-card-title primary-title>
							<div>
								<div class="headline" v-text="$t('modify_site_info')"/>
								<div class="subheading" v-text="$t('modify_site_info_subtitle')"/>
							</div>
						</v-card-title>
						<v-card-text>
							<v-text-field v-model="info.title" :rules="[notEmpty]" :label="$t('site_title')"/>
						</v-card-text>
						<v-card-actions>
							<v-spacer/>
							<v-btn depressed color="secondary" @click="$router.go(-1)" v-text="$t('cancel')"/>
							<v-btn depressed color="primary" @click="submit" v-text="$t('submit')"/>
						</v-card-actions>
					</v-card>
				</v-form>
			</v-flex>
		</v-layout>
	</v-container>
</template>

<script>
import axios from "axios";

export default {
  name: "site_info_edit",
  data() {
    return {
      info: {
        title: ""
      },
      valid: false
    };
  },
  methods: {
    notEmpty(str) {
      return (str && str.length >= 0) || "Cannot be empty";
    },
    syncData() {
      this.info.title = this.$store.state.site.title;
    },
    async submit() {
      try {
        this.$store.commit("querying", true);
        let result = await axios.put("/site/modify/info", this.info);
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
