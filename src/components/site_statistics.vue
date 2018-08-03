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
					<v-card-text>
						<v-progress-circular :size="256" :width="32" :value="api_call_rate" color="teal">
							{{ $t('api_calls') }}<br>
							{{ api_calls.al }}&nbsp;/&nbsp;{{ max_api_call }}
						</v-progress-circular>
						&nbsp;
						<v-progress-circular :size="256" :width="32" :value="rw_api_call_rate" color="blue">
							{{ $t('rw_api_calls') }}<br>
							{{ api_calls.rw }}&nbsp;/&nbsp;{{ max_rw_api_call }}
						</v-progress-circular>
					</v-card-text>
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
import axios from "axios";

export default {
  name: "site_statistics",
  data() {
    return {
      api_calls: {
        rw: 0,
        al: 0
      }
    };
  },
  computed: {
    max_api_call() {
      return this.$store.state.site.restrictions.max_api_call_perday;
    },
    max_rw_api_call() {
      return this.$store.state.site.restrictions.max_rw_api_call_perday;
    },
    api_call_rate() {
      return (100 * this.api_calls.al) / this.max_api_call;
    },
    rw_api_call_rate() {
      return (100 * this.api_calls.rw) / this.max_rw_api_call;
    }
  },
  methods: {
    async fetchData() {
      try {
        this.$store.commit("querying", true);

        let result = await axios.get("/site/stat");
        this.api_calls = result.data;

        this.$store.commit("querying", false);
      } catch (e) {
        this.$store.commit("querying", false);
        this.$store.commit("error_status", true);
        this.$store.commit("error_text", e.message);
      }
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => vm.fetchData());
  },
  beforeRouteUpdate(to, from, next) {
    next();
    this.fetchData();
  }
};
</script>
