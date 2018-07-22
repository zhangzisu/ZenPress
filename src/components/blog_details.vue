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
					</v-card-actions>
				</v-card>
			</v-flex>
		</v-layout>
	</v-container>
</template>

<script>
import marked from "marked";
import DOMPurify from "dompurify";
import user_banner from "./user_banner";
export default {
  name: "blog_details",
  components: {
    "v-user": user_banner
  },
  props: {
    post_id: String
  },
  data() {
    return {
      post: {
        _id: "666",
        title: "Test post",
        subtitle: "Sub Title",
        summary: "Summary",
        content: "# Content\n\n`ddd`\n\n> 123",
        tags: ["A", "B", "C"],
        keywords: ["a", "b", "c"]
      }
    };
  },
  methods: {
    render(markdown) {
      return DOMPurify.sanitize(marked(markdown));
    }
  }
};
</script>
