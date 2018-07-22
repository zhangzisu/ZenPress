<template>
	<v-tooltip v-if="loaded" bottom>
		<v-avatar slot="activator"><v-gravatar :email="user.email"/></v-avatar>
		<span v-text="user.username"/>
	</v-tooltip>
	<div v-else v-text="$t('loading_user_profile')"/>
</template>

<script>
export default {
  name: "user_banner",
  props: {
    id: String
  },
  data() {
    return {
      user: {
        _id: "666",
        username: "ZhangZisu",
        email: "admin@zhangzisu.cn"
      },
      loaded: false
    };
  },
  created() {
    setTimeout(() => {
      this.loaded = true;
    }, 500);
  }
};
</script>
