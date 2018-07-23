<template>
	<v-container fluid>
		<v-layout fill-height>
			<v-flex>
				<div>
					<v-data-table
						:headers="headers"
						:items="posts"
						hide-actions
						class="elevation-1"
					>
						<template slot="items" slot-scope="props">
							<td>{{ props.item._id.substr(0, 5) }}</td>
							<td>{{ props.item.title }}</td>
							<td>{{ formatDate(props.item.published) }}</td>
							<td>{{ props.item.tags.join(',') }}</td>
							<td class="justify-end layout px-0">
								<v-btn icon @click="$router.push(`/admin/blog/edit/${props.item._id}`)">
									<v-icon>edit</v-icon>
								</v-btn>
								<v-btn icon @click="deletePost(props.item._id)">
									<v-icon>delete</v-icon>
								</v-btn>
							</td>
						</template>
						<template slot="no-data">
							No data found.
						</template>
					</v-data-table>
				</div>
			</v-flex>
		</v-layout>
	</v-container>
</template>

<script>
import axios from "axios";
export default {
  name: "blog_list",
  data() {
    return {
      headers: [
        { text: "ID", value: "_id", width: "64px" },
        { text: "Title", value: "title" },
        { text: "Published", value: "published" },
        { text: "Tags", value: "tags" },
        { text: "Actions", sortable: false, align: "right", width: "128px" }
      ],
      posts: []
    };
  },
  methods: {
    async fetchPost() {
      try {
        this.$store.commit("querying", true);
        let result = await axios.get("/blog/list");
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
      return new Date(date).toLocaleString();
    },
    async deletePost(id) {
      try {
        if (confirm(`Delete post ${id}`)) {
          this.$store.commit("querying", true);
          let result = await axios.delete(`/blog/post/${this.post_id}`);
          if (result.status !== 200)
            throw new Error(`HTTP Error ${result.status}: ${result.data}`);
          this.$store.commit("querying", false);
          this.fetchPost();
        }
      } catch (e) {
        this.$store.commit("querying", false);
        this.$store.commit("error_status", true);
        this.$store.commit("error_text", e.message);
      }
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => vm.fetchPost());
  }
};
</script>
