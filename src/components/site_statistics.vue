<template>
	<v-container fluid grid-list-md>
		<v-layout align-start justify-start row fill-height wrap>
			<v-flex md8>
				<v-card>
					<v-card-title primary-title>
						<div>
							<div class="headline" v-text="$t('api_calls')"/>
						</div>
					</v-card-title>
					<v-card-text/>
					<v-card-actions/>
				</v-card>
			</v-flex>
			<v-flex md4>
				<v-card>
					<v-card-title primary-title>
						<div>
							<div class="headline" v-text="$t('visitors')"/>
						</div>
					</v-card-title>
					<v-card-text/>
					<v-card-actions/>
				</v-card>
			</v-flex>
		</v-layout>
	</v-container>
</template>

<script>
export default {
  name: "site_statistics"
};
</script>
