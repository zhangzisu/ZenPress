<template>
	<v-container fluid>
		<v-layout fill-height>
			<v-flex>
				<v-card v-for="(post, i) in posts" :key="i">
					<v-card-media v-if="post.header_media" :src="post.header_media" height="100px"/>
					<v-card-title primary-title>
						<div>
							<div class="headline" v-text="post.title"/>
							<div class="subheading" v-text="post.subtitle"/>
						</div>
					</v-card-title>
					<v-card-text v-text="post.summary"/>
					<v-card-actions>
						{{ formatDate(post.published) }}
						<v-spacer/>
						<v-btn depressed @click="$router.push(`/blog/${post._id}`)" v-text="$t('read_more')" />
					</v-card-actions>
				</v-card>
				<v-card flat>
					<v-card-actions>
						<v-spacer/>
						<v-btn depressed color="primary" @click="loadMore" v-text="$t('load_more')"/>
						<v-spacer/>
					</v-card-actions>
				</v-card>
			</v-flex>
		</v-layout>
	</v-container>
</template>

<script>
import axios from "axios";

export default {
  name: "blog_home",
  data() {
    return {
      posts: [],
      search: "",
      tags: []
    };
  },
  computed: {
    //
  },
  methods: {
    async fetchPost() {
      try {
        this.posts = [];
        this.$store.commit("querying", true);

        let requestObject = {};
        if (this.search && this.search.length)
          requestObject.search = this.search;
        if (this.tags && this.tags.length) requestObject.tags = this.tags;

        let result = await axios.post("/blog", requestObject);
        if (result.status !== 200)
          throw new Error(`HTTP Error ${result.status}: ${result.data}`);
        this.posts = result.data;
        this.$store.commit("querying", false);
      } catch (e) {
        this.$store.commit("querying", false);
        this.$store.commit("error_status", true);
        this.$store.commit("error_text", e.message);
      }
    },
    async loadMore() {
      try {
        this.$store.commit("querying", true);

        let requestObject = {};
        if (this.search && this.search.length)
          requestObject.search = this.search;
        if (this.tags && this.tags.length) requestObject.tags = this.tags;
        requestObject.skip = this.posts.length;

        let result = await axios.post("/blog", requestObject);
        if (result.status !== 200)
          throw new Error(`HTTP Error ${result.status}: ${result.data}`);
        this.posts = this.posts.concat(result.data);
        this.$store.commit("querying", false);
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
      vm.search = "";
      vm.tags = [];
      if (to.query.q) {
        let parsed = JSON.parse(decodeURIComponent(to.query.q));
        vm.search = parsed.search;
        vm.tags = parsed.tags;
      }
      vm.fetchPost();
    });
  },
  beforeRouteUpdate(to, from, next) {
    next();
    this.search = "";
    this.tags = [];
    if (to.query.q) {
      let parsed = JSON.parse(decodeURIComponent(to.query.q));
      this.search = parsed.search;
      this.tags = parsed.tags;
    }
    this.fetchPost();
  }
};
</script>
