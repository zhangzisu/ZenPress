<template>
	<v-container fluid>
		<v-layout fill-height>
			<v-flex>
				<v-card v-for="(post, i) in posts" :key="i">
					<v-card-media v-if="post.header_media" :src="post.header_media" height="200px"/>
					<v-card-title>
						<div>
							<div class="headline" v-text="post.title"/>
							<div class="subheading" v-text="post.subtitle"/>
						</div>
					</v-card-title>
					<v-card-text v-text="post.summary"/>
					<v-card-actions>
						<v-spacer/>
						<v-btn depressed @click="$router.push(`/blog/${post._id}`)" v-text="$t('read_more')" />
					</v-card-actions>
				</v-card>
			</v-flex>
		</v-layout>
	</v-container>
</template>

<script>
export default {
  name: "blog_home",
  data() {
    return {
      posts: [
        {
          _id: 666,
          title: "Title",
          subtitle: "Subtitle",
          summary: "Summary",
          header_media: "https://i.loli.net/2018/07/15/5b4ab2458aa04.png"
        }
      ]
    };
  },
  computed: {
    //
  },
  methods: {
    fetchPost() {
      //
    }
  }
};
</script>
