<template>
	<v-container fluid>
		<v-layout fill-height>
			<v-flex>
				<v-card>
					<v-card-media v-if="post.header_media" :src="post.header_media" height="100px"/>
					<v-card-title primary-title>
						<div>
							<div class="headline">{{ post.title }}</div>
							<div class="subheading">{{ post.subtitle }}</div>
						</div>
					</v-card-title>
					<v-card-text>
						<div class="markdown-body" v-html="render(post.summary)"/>
					</v-card-text>
					<v-divider/>
					<v-card-text>
						<article class="markdown-body" v-html="render(post.content)"/>
					</v-card-text>
					<v-divider/>
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
						<v-btn depressed color="primary" @click.stop="share" v-text="$t('share')"/>
						<v-btn v-if="authenticated" depressed @click.stop="$router.push(`/admin/blog/edit/${post._id}`)" v-text="$t('edit')"/>
					</v-card-actions>
				</v-card>
				<br>
				<v-card>
					<v-card-title primary-title>
						<div>
							<div class="headline" v-text="$t('comment')"/>
							<div class="subheading" v-text="$t('comment_subheader')"/>
						</div>
					</v-card-title>
					<v-card-text>
						<vue-intense-debate :account="config.intensedebate.account" :pid="unique_id"/>
					</v-card-text>
				</v-card>
			</v-flex>
		</v-layout>
	</v-container>
</template>

<script>
import katex from "katex";
import marked, { Renderer } from "marked-katex";
import highlightjs from "highlight.js";
import axios from "axios";
import copy from "copy-to-clipboard";
import "katex/dist/katex.css";
import getPostPermalink from "../permalink";
import config from "../../zenpress.config";
import VueIntenseDebate from "vue-intense-debate/VueIntenseDebate";

const renderer = new Renderer();
renderer.code = (code, language) => {
  const validLang = !!(language && highlightjs.getLanguage(language));
  const highlighted = validLang
    ? highlightjs.highlight(language, code).value
    : code;
  return `<pre><code class="hljs ${language}">${highlighted}</code></pre>`;
};

marked.setOptions({ renderer: renderer, kaTex: katex });

export default {
  name: "blog_details",
  components: {
    "vue-intense-debate": VueIntenseDebate
  },
  props: {
    post_id: String
  },
  data() {
    return {
      post: {
        _id: "",
        title: "",
        subtitle: "",
        summary: "",
        header_media: "",
        content: "",
        tags: [],
        published: null
      },
      config: config
    };
  },
  computed: {
    authenticated: function() {
      return !!this.$store.state.authentication;
    },
    unique_id: function() {
      return this.post_id;
    }
  },
  created() {
    this.fetch();
  },
  methods: {
    async fetch() {
      try {
        this.$store.commit("querying", true);
        let result = await axios.get(`/blog/post/${this.post_id}`);
        this.post = result.data;
        this.$store.commit("querying", false);
      } catch (e) {
        this.$store.commit("querying", false);
        this.$store.commit("error_status", true);
        this.$store.commit("error_text", e.message);
      }
    },
    render(markdown) {
      try {
        let result = marked(markdown);
        return result;
      } catch (e) {
        return `<pre><code>${e.message}\nSource:\n${markdown}</code></pre>`;
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
    share() {
      if (copy(getPostPermalink(this.post_id))) {
        this.$store.commit("error_status", true);
        this.$store.commit("error_text", this.$t("copied", ["permalink"]));
      } else {
        this.$store.commit("error_status", true);
        this.$store.commit("error_text", this.$t("copy_failed_text"));
      }
    }
  }
};
</script>

<style lang="stylus">
.markdown-body
  box-shadow: none
  overflow-x: auto
  overflow-y: hidden
pre, code
  margin: 0
  box-shadow: none
  background: transparent
  font-family: 'Inconsolata', monospace
  font-weight: 300
  font-size: 15px
  line-height: 1.55
code
  position: relative
  box-shadow: none
  overflow-x: auto
  overflow-y: hidden
  word-break: break-word
  flex-wrap: wrap
  align-items: center
  vertical-align: middle
  white-space: pre-wrap
  &:before
    display: none
</style>
