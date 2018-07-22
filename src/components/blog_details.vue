<template>
	<v-container fluid>
		<v-layout fill-height>
			<v-flex>
				<v-card>
					<v-card-title>
						<div>
							<div class="headline">{{ post.title }}</div>
							<div class="subheading">{{ post.subtitle }}</div>
						</div>
					</v-card-title>
					<v-card-text>
						<blockquote v-text="post.summary" />
					</v-card-text>
					<v-divider/>
					<v-card-text>
						<article class="markdown-body" v-html="render(post.content)"/>
					</v-card-text>
					<v-divider/>
					<v-card-text>
						<div>
							<v-chip v-for="(tag, i) in post.tags" :key="`tag${i}`" label>
								<v-icon left>label</v-icon>
								{{ tag }}
							</v-chip>
						</div>
						<div>
							<v-chip v-for="(keyword, i) in post.keywords" :key="`keyword${i}`" label>
								<v-icon left>search</v-icon>
								{{ keyword }}
							</v-chip>
						</div>
					</v-card-text>
					<v-card-actions>
						<v-spacer/>
						<v-btn v-if="authenticated" depressed @click="$router.push(`/admin/blog/edit/${post._id}`)" v-text="$t('edit')"/>
					</v-card-actions>
				</v-card>
			</v-flex>
		</v-layout>
	</v-container>
</template>

<script>
import marked from "marked";
import DOMPurify from "dompurify";
import axios from "axios";

export default {
  name: "blog_details",
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
        content: "",
        tags: [],
        keywords: []
      }
    };
  },
  computed: {
    authenticated: function() {
      return !!this.$store.state.authentication;
    }
  },
  methods: {
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
    render(markdown) {
      return DOMPurify.sanitize(marked(markdown));
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => vm.fetch());
  }
};
</script>
