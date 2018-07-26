<template>
	<v-container fluid>
		<v-layout fill-height>
			<v-flex>
				<router-view/>
			</v-flex>
			<v-flex lg3>
				<v-card>
					<v-card-title primary-title>
						<div>
							<div class="headline">
								Blog
							</div>
						</div>
					</v-card-title>
					<v-card-text>
						<v-text-field label="Search"/>
					</v-card-text>
				</v-card>
			</v-flex>
		</v-layout>
	</v-container>
</template>
