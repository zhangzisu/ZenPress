<template>
	<v-container fluid>
		<v-layout>
			<v-flex>
				<v-form v-model="valid">
					<v-card>
						<v-card-title primary-title>
							<div>
								<div class="headline" v-text="$t('modify_site_owner')"/>
								<div class="subheading" v-text="$t('modify_site_owner_subtitle')"/>
							</div>
						</v-card-title>
						<v-card-text>
							<v-text-field v-model="owner.name" :rules="[notEmpty]" :label="$t('user_name')"/>
							<v-text-field v-model="owner.email" :rules="[notEmpty]" :label="$t('user_email')"/>
							<v-text-field v-model="owner.bio" :rules="[]" :label="$t('user_bio')"/>
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
  name: "site_owner_edit",
  data() {
    return {
      owner: {
        name: "",
        email: "",
        bio: ""
      },
      valid: false
    };
  },
  methods: {
    notEmpty(str) {
      return (str && str.length >= 0) || "Cannot be empty";
    },
    syncData() {
      this.owner = this.$store.state.site.owner;
    },
    async submit() {
      try {
        this.$store.commit("querying", true);
        let result = await axios.put("/site/modify/owner", {
          owner: this.owner
        });
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
