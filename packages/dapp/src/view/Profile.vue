<template>
  <div class="profile-main">
    <div class="card-profile">
      <svg
        class="icon-account"
        title="Account"
        viewBox="0 0 24 24"
        width="90"
        height="90"
        fill="var(--color-gray-lighter)"
      >
        <path
          d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"
        ></path>
        <path d="M0 0h24v24H0z" fill="none"></path>
      </svg>
      <ul>
        <li v-for="(item, index) in data" :key="index" class="data-list">
          <p>{{ item.value }}</p>
        </li>
      </ul>
      <v-account-profile :profile-data="data" class="score"></v-account-profile>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import IdentityProfile from '../components/IdentityProfile';

export default {
  name: 'Profile',
  components: {
    'v-account-profile': IdentityProfile,
  },
  data() {
    return {};
  },
  computed: {
    ...mapState({
      userID: state => state.profile.userID,
      data: state => state.profile.data,
    }),
  },
  methods: {},
};
</script>

<style scoped>
.profile-main {
  display: flex;
  justify-content: center;
}
.card-profile {
  min-width: 300px;
  min-height: 25vh;
  margin: 5%;
  padding: 1%;
  border: dashed 2px var(--color-white);
  border-radius: 2%;
  color: var(--color-white);
}
.data-list {
  display: flex;
  justify-content: center;
  padding: 1%;
}
</style>
