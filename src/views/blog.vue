<template>
	<v-container fluid>
		<v-layout fill-height>
			<v-flex :md9="!replaceBlogBar">
				<router-view :key="$route.fullPath"/>
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
			<v-flex v-if="!replaceBlogBar" md3>
				<v-card>
					<v-card-title primary-title>
						<div>
							<div class="headline" v-text="$t('blog')"/>
						</div>
					</v-card-title>
					<v-card-text>
						<v-form v-model="valid">
							<v-text-field :label="$t('search')" v-model="form.search" :rules="[]"/>
							<v-combobox v-model="form.tags" :label="$t('tags')" :items="tag_items" hide-selected multiple chips clearable/>
							<v-switch v-model="form.SpecifyDate" :label="$t('specify_date')"/>
							<v-menu v-if="form.SpecifyDate" ref="menuStart" :close-on-content-click="false" v-model="menuStart" :nudge-right="40" :return-value.sync="form.start" lazy transition="scale-transition" offset-y full-width>
								<v-text-field slot="activator" v-model="form.start" :label="$t('date_start')" prepend-icon="event" readonly/>
								<v-date-picker v-model="form.start" @input="$refs.menuStart.save(form.start)"/>
							</v-menu>
							<v-menu v-if="form.SpecifyDate" ref="menuEnd" :close-on-content-click="false" v-model="menuEnd" :nudge-right="40" :return-value.sync="form.end" lazy transition="scale-transition" offset-y full-width>
								<v-text-field slot="activator" v-model="form.end" :label="$t('date_end')" prepend-icon="event" readonly/>
								<v-date-picker v-model="form.end" @input="$refs.menuEnd.save(form.end)"/>
							</v-menu>
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
        tags: [],
        SpecifyDate: false,
        start: null,
        end: null
      },
      valid: false,
      menuStart: false,
      menuEnd: false
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
  watch: {
    "form.SpecifyDate": function(value) {
      if (!value) {
        this.form.start = this.form.end = null;
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
    isEmpty() {
      return !(
        this.form.search.length ||
        this.form.tags.length ||
        this.form.start ||
        this.form.end
      );
    },
    generateSearchObject() {
      let so = {};
      if (this.form.search.length) so.search = this.form.search;
      if (this.form.tags.length) so.tags = this.form.tags;
      if (this.form.start) so.start = +new Date(this.form.start + " 0:0:0");
      if (this.form.end)
        so.end = +new Date(this.form.end + " 0:0:0") + 86400000;
      return so;
    },
    doSearch() {
      if (this.isEmpty()) {
        this.$router.push({ name: "blog" });
      } else {
        this.$router.push({
          name: "blog",
          query: {
            q: encodeURIComponent(JSON.stringify(this.generateSearchObject()))
          }
        });
      }
    }
  }
};
</script>
