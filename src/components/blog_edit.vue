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
							<v-btn v-if="post.published === Number.MAX_SAFE_INTERGER" flat color="primary" v-text="$t('publish')"/>
							<v-btn v-else flat>{{$t('published_at')}}: {{(new Date(post.published)).toLocaleString()}}</v-btn>
							<v-spacer/>
							<v-btn depressed color="secondary" v-text="$t('cancel')"/>
							<v-btn depressed color="primary" v-text="$t('submit')"/>
						</v-card-actions>
					</v-card>
				</v-form>
			</v-flex>
		</v-layout>
	</v-container>
</template>

<script>
export default {
  name: "blog_edit",
  data() {
    return {
      post: {
        _id: "",
        title: "",
        subtitle: "",
        summary: "",
        header_media: "",
        content: "",
        tags: ["123", "456", "789"],
        keywords: [],
        published: "2018-07-16"
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
    }
  }
};
</script>
