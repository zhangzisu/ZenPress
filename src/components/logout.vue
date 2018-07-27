<template>
	<v-container/>
</template>

<script>
export default {
  name: "logout",
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.$store.dispatch("logout");
      vm.$router.push("/");
    });
  },
  beforeRouteUpdate(to, from, next) {
    next();
    this.$store.dispatch("logout");
    this.$router.push("/");
  }
};
</script>
