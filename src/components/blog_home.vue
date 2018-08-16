<template>
	<v-container fluid>
		<v-layout fill-height>
			<v-flex>
				<v-card v-for="(post, i) in posts" :key="i">
					<v-card-media v-if="post.header_media" :src="post.header_media" height="200px"/>
					<v-card-title primary-title>
						<div>
							<div class="headline" v-text="post.title"/>
							<div class="subheading" v-text="post.subtitle"/>
						</div>
					</v-card-title>
					<v-card-text>
						<div class="markdown-body" v-html="render(post.summary)"/>
					</v-card-text>
					<v-card-text>
						<div>
							<v-chip v-for="(tag, i) in post.tags" :key="`tag${i}`" label @click.stop="copyText(tag)">
								<v-icon left>label</v-icon>
								{{ tag }}
							</v-chip>
						</div>
					</v-card-text>
					<v-card-actions>
						{{ formatDate(post.published) }}
						<v-spacer/>
						<v-btn v-if="authenticated" depressed @click.stop="$router.push(`/admin/blog/edit/${post._id}`)" v-text="$t('edit')"/>
						<v-btn depressed color="primary" @click.stop="$router.push(`/blog/${post._id}`)" v-text="$t('read_more')" />
					</v-card-actions>
				</v-card>
				<v-card flat style="background: transparent">
					<v-card-actions>
						{{ $t('query_result', [resultCount]) }}
						<v-spacer/>
						<v-btn :disabled="posts.length >= resultCount" depressed color="primary" @click.stop="loadMore" v-text="$t('load_more')"/>
						<v-spacer/>
						{{ $t('display_count', [posts.length]) }}
					</v-card-actions>
				</v-card>
			</v-flex>
		</v-layout>
	</v-container>
</template>

<script>
import axios from "axios";
import copy from "copy-to-clipboard";
import render from "../markdown";

export default {
  name: "blog_home",
  props: {
    search: String,
    tags: Array,
    start: Number,
    end: Number
  },
  data() {
    return {
      posts: [],
      resultCount: 0
    };
  },
  computed: {
    authenticated: function() {
      return !!this.$store.state.authentication;
    }
  },
  created() {
    this.fetchPost();
  },
  methods: {
    async fetchPost() {
      try {
        this.posts = [];
        this.resultCount = 0;
        this.$store.commit("querying", true);

        let requestObject = {};
        if (this.search && this.search.length)
          requestObject.search = this.search;
        if (this.tags && this.tags.length) requestObject.tags = this.tags;

        if (this.start && parseInt(this.start)) {
          requestObject.start = parseInt(this.start);
        }

        if (this.end && parseInt(this.end)) {
          requestObject.end = parseInt(this.end);
        } else {
          requestObject.end = +new Date();
        }

        let count = await axios.post("/blog/count", requestObject);
        this.resultCount = count.data.count;

        let result = await axios.post("/blog", requestObject);
        result.data.forEach(x => this.$store.commit("addTags", x.tags));
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
        result.data.forEach(x => this.$store.commit("addTags", x.tags));
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
    },
    copyText(str) {
      if (copy(str)) {
        this.$store.commit("error_status", true);
        this.$store.commit("error_text", this.$t("copied", [str]));
      } else {
        this.$store.commit("error_status", true);
        this.$store.commit("error_text", this.$t("copy_failed_text"));
      }
    },
    render: render
  }
};
</script>
