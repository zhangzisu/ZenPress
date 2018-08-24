<template>
	<v-container>
		<v-layout>
			<v-flex>
				<v-form v-model="valid">
					<v-card>
						<v-card-title primary-title>
							<div>
								<div class="headline" v-text="$t('edit')"/>
								<div class="subheading" v-text="post._id"/>
							</div>
						</v-card-title>
						<v-card-text>
							<v-text-field v-model="post.title" :rules="[noEmpty]" :label="$t('title')" required />
							<v-text-field v-model="post.subtitle" :rules="[]" :label="$t('subtitle')" required />
							<v-text-field v-model="post.header_media" :rules="[]" :label="$t('header_media')" />
							<v-divider/>
							<v-combobox v-model="post.tags" :label="$t('tags')" :items="tag_items" hide-selected multiple chips clearable/>
							<v-divider/>
							<div class="title" v-text="$t('summary')"/>
							<editor v-model="post.summary" lang="markdown" theme="solarized_light" height="200" @init="editorInit"/>
							<div class="title" v-text="$t('content')"/>
							<editor v-model="post.content" lang="markdown" theme="solarized_light" height="500" @init="editorInit"/>
							<v-divider/>
							<v-switch v-model="post.topmost" :label="$t('topmost')"/>
							<v-switch v-model="post.featured" :label="$t('featured')"/>
						</v-card-text>
						<v-card-actions>
							{{ formatDate(post.published) }}
							<v-dialog v-model="dialog" width="500">
								<v-btn slot="activator" flat v-text="$t('modify')"/>
								<v-card>
									<v-card-title class="headline" primary-title>
										{{ $t('modify_published_time') }}
									</v-card-title>

									<v-card-text>
										<v-text-field v-model="time" :label="$t('published_time_input_label')" :placeholder="$t('published_time_input_placeholder')"/>
									</v-card-text>

									<v-card-actions>
										<v-btn flat @click.stop="time = (new Date()).toLocaleString()" v-text="$t('now')"/>
										<v-spacer/>
										<v-btn flat @click.stop="dialog = false" v-text="$t('cancel')"/>
										<v-btn color="primary" flat @click.stop="setPublished" v-text="$t('ok')"/>
									</v-card-actions>
								</v-card>
							</v-dialog>
							<v-spacer/>
							<v-btn v-if="post_id" depressed @click.stop="$router.push(`/blog/${post._id}`)" v-text="$t('view')"/>
							<v-btn color="secondary" depressed @click.stop="showPreview = true" v-text="$t('preview')"/>
							<v-btn depressed color="warning" @click.stop="$router.go(-1)" v-text="$t('cancel')"/>
							<v-btn depressed color="primary" @click.stop="submit" v-text="$t('submit')"/>
						</v-card-actions>
					</v-card>
				</v-form>
			</v-flex>
		</v-layout>
		<v-dialog v-model="showPreview" fullscreen hide-overlay transition="dialog-bottom-transition">
			<v-card>
				<v-toolbar dark color="primary">
					<v-btn icon dark @click.native="showPreview = false">
						<v-icon>close</v-icon>
					</v-btn>
					<v-toolbar-title>Preview</v-toolbar-title>
				</v-toolbar>
				<v-card>
					<v-card-media v-if="post.header_media" :src="post.header_media" height="200px"/>
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
			</v-card>
		</v-dialog>
	</v-container>
</template>

<script>
import axios from "axios";
import Editor from "vue2-ace-editor";
import render from "../markdown";

export default {
  name: "blog_edit",
  components: {
    editor: Editor
  },
  data() {
    return {
      post_id: "",
      post: {
        _id: "",
        site_id: "",
        title: "",
        subtitle: "",
        summary: "",
        header_media: "",
        content: "",
        tags: [],
        published: Number.MAX_SAFE_INTEGER,
        topmost: false,
        featured: false
      },
      valid: false,
      dialog: false,
      showPreview: false,
      time: null
    };
  },
  computed: {
    tag_items() {
      return this.$store.state.post_tags;
    }
  },
  watch: {
    dialog(val) {
      if (val) {
        this.time = new Date(this.post.published).toString();
      }
    },
    $route(to) {
      this.resetPost();
      if ((this.post_id = to.params.id)) {
        this.fetch();
      }
    }
  },
  methods: {
    noEmpty(value) {
      return value.length > 0 || "Cannot be empty";
    },
    async fetch() {
      try {
        this.$store.commit("querying", true);
        let result = await axios.get(`/blog/post/${this.post_id}`);
        this.post = result.data;
        this.$store.commit("addTags", this.post.tags);
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
          await axios.put(`/blog/post/${this.post_id}`, this.post);
          this.$store.commit("querying", false);
          this.fetch();
        } else {
          let result = await axios.post("/blog/new", this.post);
          this.$store.commit("querying", false);
          this.$router.push({ name: "edit_blog", params: { id: result.data } });
        }
      } catch (e) {
        this.$store.commit("querying", false);
        this.$store.commit("error_status", true);
        this.$store.commit("error_text", e.message);
      }
    },
    render: render,
    formatDate(date) {
      if (date === Number.MAX_SAFE_INTEGER) return this.$t("unpublished");
      return this.$t("published_at") + ": " + new Date(date).toLocaleString();
    },
    setPublished() {
      this.dialog = false;
      let x = +new Date(this.time);
      if (isNaN(x)) x = Number.MAX_SAFE_INTEGER;
      this.post.published = x;
    },
    editorInit() {
      require("brace/ext/language_tools");
      require("brace/ext/beautify");
      require("brace/ext/searchbox");
      require("brace/mode/html");
      require("brace/mode/javascript");
      require("brace/mode/markdown");
      require("brace/theme/solarized_light");
      require("brace/snippets/javascript");
    },
    resetPost() {
      this.post = {
        _id: "",
        site_id: "",
        title: "",
        subtitle: "",
        summary: "",
        header_media: "",
        content: "",
        tags: [],
        published: Number.MAX_SAFE_INTEGER,
        topmost: false,
        featured: false
      };
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.resetPost();
      if ((vm.post_id = to.params.id)) {
        vm.fetch();
      }
    });
  }
};
</script>

<style lang="stylus">
.ace_gutter
  z-index: 1 !important;
.ace_scrollbar
  z-index: 1 !important;
.ace_cursor
  z-index: 1 !important;

.markdown-body
  box-shadow: none
  overflow-x: auto
  overflow-y: hidden
pre, code
  margin: 0
  box-shadow: none
  background: transparent
  font-family: 'Inconsolata', 'consolas', monospace
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
#idc-container
  margin-left: auto !important;
  margin-right: auto !important;
</style>
