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
							<td>{{ props.item._id }}</td>
							<td>{{ props.item.title }}</td>
							<td>{{ props.item.published }}</td>
							<td>{{ props.item.tags.join(',') }}</td>
							<td class="justify-end layout px-0">
								<v-btn icon>
									<v-icon>edit</v-icon>
								</v-btn>
								<v-btn icon>
									<v-icon>delete</v-icon>
								</v-btn>
							</td>
						</template>
						<template slot="no-data">
							<v-btn color="primary" @click="initialize">Reset</v-btn>
						</template>
					</v-data-table>
				</div>
			</v-flex>
		</v-layout>
	</v-container>
</template>

<script>
export default {
  name: "blog_list",
  data() {
    return {
      headers: [
        { text: "ID", value: "_id" },
        { text: "Title", value: "title" },
        { text: "Published", value: "published" },
        { text: "Tags", value: "tags" },
        { text: "Actions", sortable: false, align: "right", width: "128px" }
      ],
      posts: [
        {
          _id: "123456",
          title: "Title",
          published: 123456,
          tags: ["a", "b", "c"]
        }
      ]
    };
  },
  methods: {
    fetchData() {
      //
    }
  }
};
</script>
