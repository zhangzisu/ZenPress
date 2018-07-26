<template>
	<v-container>
		<v-layout justify-center>
			<v-flex md4>
				<v-form v-model="valid" @submit="login">
					<v-card>
						<v-card-title primary-title>
							<div>
								<div class="headline" v-text="$t('login')"/>
								<div class="subheading" v-text="title"/>
							</div>
						</v-card-title>
						<v-card-text>
							<v-text-field v-model="password" :rules="[noEmpty]" label="Password" type="password"/>
						</v-card-text>
						<v-card-actions>
							<v-spacer/>
							<v-btn :disabled="!valid" depressed color="primary" @click="login" v-text="$t('login')"/>
						</v-card-actions>
					</v-card>
				</v-form>
			</v-flex>
		</v-layout>
	</v-container>
</template>

<script>
export default {
  name: "login",
  data() {
    return {
      password: null,
      valid: false
    };
  },
  computed: {
    title: function() {
      return this.$store.state.site.title;
    }
  },
  methods: {
    noEmpty(value) {
      return (value && value.length > 0) || "Cannot be empty";
    },
    login() {
      if (this.valid) {
        this.$store.dispatch("login", this.password);
        this.$router.push("/");
      }
    }
  }
};
</script>
