<template>
	<v-container fluid>
		<v-layout fill-height>
			<v-flex>
				<router-view/>
				<v-card v-if="replaceBlogBar">
					<v-card-title primary-title>
						<div>
							<div class="headline">
								Blog
							</div>
						</div>
					</v-card-title>
					<v-card-text>
						<v-form v-model="valid">
							<v-text-field :label="$t('search')" v-model="form.search" :rules="[]"/>
							<v-combobox v-model="form.tags" :label="$t('tags')" hide-selected multiple chips clearable/>
						</v-form>
					</v-card-text>
					<v-card-actions>
						<v-spacer/>
						<v-btn depressed @click.stop="doClear" v-text="$t('reset')"/>
						<v-btn :disabled="!valid" depressed color="primary" @click.stop="doSearch" v-text="$t('search')"/>
					</v-card-actions>
				</v-card>
			</v-flex>
			<v-flex v-if="!replaceBlogBar" lg3>
				<v-card>
					<v-card-title primary-title>
						<div>
							<div class="headline">
								Blog
							</div>
						</div>
					</v-card-title>
					<v-card-text>
						<v-form v-model="valid">
							<v-text-field :label="$t('search')" v-model="form.search" :rules="[]"/>
							<v-combobox v-model="form.tags" :label="$t('tags')" :items="tag_items" hide-selected multiple chips clearable/>
						</v-form>
					</v-card-text>
					<v-card-actions>
						<v-spacer/>
						<v-btn depressed @click.stop="doClear" v-text="$t('reset')"/>
						<v-btn :disabled="!valid" depressed color="primary" @click.stop="doSearch" v-text="$t('search')"/>
					</v-card-actions>
				</v-card>
			</v-flex>
		</v-layout>
	</v-container>
</template>

<script>
export default {
  name: "blog",
  data() {
    return {
      form: {
        search: "",
        tags: []
      },
      valid: false
    };
  },
  computed: {
    tag_items() {
      return this.$store.state.post_tags;
    },
    replaceBlogBar() {
      switch (this.$vuetify.breakpoint.name) {
        case "xs":
          return true;
        case "sm":
          return true;
        case "md":
          return false;
        case "lg":
          return false;
        case "xl":
          return false;
      }
    }
  },
  methods: {
    doClear() {
      this.form.search = "";
      this.form.tags = [];
      this.$router.push({ name: "blog" });
    },
    notEmpty(str) {
      return (str && str.length >= 1) || "Cannot be empty";
    },
    doSearch() {
      if (this.form.search.length || this.form.tags.length) {
        this.$router.push({
          name: "blog",
          query: { q: encodeURIComponent(JSON.stringify(this.form)) }
        });
      } else {
        this.doClear();
      }
    }
  }
};
</script>
