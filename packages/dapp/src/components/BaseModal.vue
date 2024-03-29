<template>
  <div class="v-modal">
    <transition v-if="showModal" name="modal">
      <div class="modal-mask">
        <div class="modal-wrapper">
          <div class="modal-container">
            <div class="modal-header">
              <slot name="header"></slot>
              <button @click="closeModal" class="btn--icon btn--close"></button>
            </div>

            <div class="modal-body">
              <slot name="body"></slot>
              <loader v-if="isLoading"></loader>
            </div>

            <div class="modal-footer">
              <slot name="footer"></slot>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import BaseLoader from '@/components/BaseLoader';

export default {
  name: 'BaseModal',
  components: {
    loader: BaseLoader,
  },
  props: {},
  data() {
    return {
      showModal: false,
      isLoading: false,
    };
  },
  computed: {},
  mounted: function() {
    this.$root.$on('openModal', () => {
      this.openModal();
    });
  },
  methods: {
    closeModal: function() {
      this.showModal = false;
    },
    openModal: function() {
      this.showModal = true;
    },
  },
};
</script>

<style>
.modal-mask {
  position: fixed;
  z-index: 10;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  width: 20vw;
  min-width: 300px;
  margin: 0 auto;
  padding: 2% 2% 4% 2%;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 30px;
}

.modal-header h3 {
  margin: 0;
  color: #5436d6;
}

.modal-body {
  margin-bottom: 25px;
}

.modal-body p {
  margin: 20px 0;
  display: flex;
  text-align: left;
}

.modal-default-button {
  border: 0;
  background: none;
  box-shadow: none;
  border: none;
  padding: 0 5px 0 5px;
  cursor: pointer;
}

.modal-button {
  width: 220px;
  height: 44px;
  font-family: 'Montserrat', Helvetica, Arial, sans-serif;
  font-size: 12pt;
  font-weight: 700;
  color: #ffffff;
  border-radius: 33px;
  border: 0;
  border: none;
  padding: 0 5px 0 25px;
  cursor: pointer;
  margin-top: 5%;
}

.modal-close-button {
  border: 0;
  background: none;
  box-shadow: none;
  border: none;
  padding: 0 8px 0;
  cursor: pointer;
  font-weight: 800;
}

.modal-footer {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 12px;
}

.modal-error-message {
  text-align: center;
  padding-top: 20px;
  color: var(--color-red);
}

.button-disabled {
  cursor: not-allowed;
  opacity: 0.2;
}

/* Media Mobile */
@media (max-width: 768px) {
  .modal-container {
    width: 100%;
    height: 100vh;
    margin: 0 auto;
    padding: 70px;
    box-sizing: border-box;
  }
}
</style>
