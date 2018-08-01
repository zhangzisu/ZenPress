<template>
	<v-container fluid>
		<v-layout fill-height align-center>
			<v-flex>
				<v-card>
					<v-card-title primary-title>
						<div>
							<div class="headline" v-text="$t(type)"/>
							<div class="subheading" v-text="$t(summary)"/>
						</div>
					</v-card-title>
					<v-card-text v-text="details"/>
					<v-card-actions>
						<v-spacer/>
						<v-btn depressed color="primary" @click.stop="$router.push('/')" v-text="$t('goto_home')"/>
					</v-card-actions>
				</v-card>
			</v-flex>
		</v-layout>
	</v-container>
</template>

<script>
export default {
  name: "error",
  props: {
    type: String,
    summary: String,
    details: String
  }
};
</script>
