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
							<v-combobox v-model="post.tags" :label="$t('tags')" hide-selected multiple chips clearable/>
							<v-divider/>
							<v-textarea v-model="post.summary" :rules="[]" :label="$t('summary')"/>
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
										<v-btn flat @click="time = (new Date()).toLocaleString()" v-text="$t('now')"/>
										<v-spacer/>
										<v-btn flat @click="dialog = false" v-text="$t('cancel')"/>
										<v-btn color="primary" flat @click="setPublished" v-text="$t('ok')"/>
									</v-card-actions>
								</v-card>
							</v-dialog>
							<v-spacer/>
							<v-btn v-if="post_id" depressed @click="$router.push(`/blog/${post._id}`)" v-text="$t('view')"/>
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
import Editor from "vue2-ace-editor";

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
      time: null
    };
  },
  computed: {},
  watch: {
    dialog: function(val) {
      if (val) {
        this.time = new Date(this.post.published).toLocaleString();
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
          this.$router.push({ name: "edit_blog", params: { id: result.data } });
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
    },
    setPublished() {
      this.dialog = false;
      let x = +new Date(this.time);
      if (isNaN(x)) x = Number.MAX_SAFE_INTEGER;
      this.post.published = x;
    },
    editorInit() {
      require("brace/ext/language_tools");
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

<style>
.ace_gutter {
  z-index: 1 !important;
}
.ace_scrollbar {
  z-index: 1 !important;
}
</style>
