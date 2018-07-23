<template>
	<v-container>
		<v-layout>
			<v-flex>
				<v-form v-model="valid">
					<v-card>
						<v-card-title>
							<div>
								<div class="headline" v-text="$t('edit')"/>
								<div class="subheading" v-text="post._id"/>
							</div>
						</v-card-title>
						<v-card-text>
							<v-text-field v-model="post.title" :rules="[noEmpty]" :label="$t('title')" required />
							<v-text-field v-model="post.subtitle" :rules="[noEmpty]" :label="$t('subtitle')" required />
							<v-text-field v-model="post.header_media" :rules="[]" :label="$t('header_media')" />
							<v-divider/>
							<v-combobox v-model="post.tags" hide-selected label="Tags" multiple chips clearable/>
							<v-combobox v-model="post.keywords" :items="post.content.split(' ')" hide-selected label="Keywords" multiple chips clearable/>
							<v-divider/>
							<v-textarea v-model="post.summary" :rules="[]" :label="$t('summary')" />
							<v-textarea v-model="post.content" :rules="[]" :label="$t('content')" height="500px" />
						</v-card-text>
						<v-card-actions>
							{{ formatDate(post.published) }}
							<v-btn flat v-text="$t('modify')"/>
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
  name: "blog_edit",
  props: {
    post_id: String
  },
  data() {
    return {
      post: {
        _id: "",
        site_id: "",
        title: "",
        subtitle: "",
        summary: "",
        header_media: "",
        content: "",
        tags: [],
        keywords: [],
        published: Number.MAX_SAFE_INTEGER,
        topmost: false
      },
      valid: false,
      date: null,
      time: null
    };
  },
  computed: {},
  methods: {
    noEmpty(value) {
      return value.length > 0 || "Cannot be empty";
    },
    async fetch() {
      try {
        this.$store.commit("querying", true);
        let result = await axios.get(`/blog/post/${this.post_id}`);
        if (result.status !== 200)
          throw new Error(`HTTP Error ${result.status}: ${result.data}`);
        this.post = result.data;
        this.$store.commit("querying", false);
      } catch (e) {
        this.$store.commit("querying", false);
        this.$store.commit("error_status", true);
        this.$store.commit("error_text", e.message);
      }
    },
    async submit() {
      try {
        this.$store.commit("querying", true);
        if (this.post_id) {
          let result = await axios.put(`/blog/post/${this.post_id}`, this.post);
          if (result.status !== 200)
            throw new Error(`HTTP Error ${result.status}: ${result.data}`);
          this.$store.commit("querying", false);
          this.fetch();
        } else {
          let result = await axios.post("/blog/new", this.post);
          if (result.status !== 200)
            throw new Error(`HTTP Error ${result.status}: ${result.data}`);
          this.$store.commit("querying", false);
          this.$router.push(`/admin/blog/edit/${result.data}`);
        }
      } catch (e) {
        this.$store.commit("querying", false);
        this.$store.commit("error_status", true);
        this.$store.commit("error_text", e.message);
      }
    },
    formatDate(date) {
      if (date === Number.MAX_SAFE_INTEGER) return this.$t("unpublished");
      return this.$t("published_at") + ": " + new Date(date).toLocaleString();
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (vm.post_id) {
        vm.fetch();
      }
    });
  }
};
</script>
