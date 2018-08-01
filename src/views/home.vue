<template>
	<v-container fluid>
		<v-slide-y-transition>
			<v-layout>
				<v-flex>
					<v-card v-for="(post, i) in posts" :key="i">
						<v-card-media v-if="post.header_media" :src="post.header_media" height="100px"/>
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
							<v-btn depressed @click.stop="$router.push(`/blog/${post._id}`)" v-text="$t('read_more')" />
						</v-card-actions>
					</v-card>
				</v-flex>
			</v-layout>
		</v-slide-y-transition>
	</v-container>
</template>

<script>
import katex from "katex";
import marked, { Renderer } from "marked-katex";
import highlightjs from "highlight.js";
import axios from "axios";
import copy from "copy-to-clipboard";
import "katex/dist/katex.css";

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
  name: "home",
  data() {
    return {
      posts: []
    };
  },
  methods: {
    async fetchPost() {
      try {
        this.$store.commit("querying", true);
        let result = await axios.get("/blog/featured");
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
    render(markdown) {
      return marked(markdown);
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => vm.fetchPost());
  },
  beforeRouteUpdate(to, from, next) {
    next();
    this.fetchPost();
  }
};
</script>
