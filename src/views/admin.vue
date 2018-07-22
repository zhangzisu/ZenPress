<template>
	<v-container fluid>
		<v-layout fill-height>
			<v-flex>
				<v-card>
					<v-toolbar/>
					<v-card-text>
						<router-view/>
					</v-card-text>
				</v-card>
			</v-flex>
		</v-layout>
	</v-container>
</template>
