<template>
  <form class="form form--hero" @submit.prevent="handleSubmit">
    <div class="form_content form_content--body">
      <slot></slot>
    </div>
    <div class="form_content form_content--actions">
      <button class="btn" type="submit">{{ action.title }}</button>
    </div>
  </form>
</template>

<script>
import BaseInput from '@/components/BaseInput'

export default {
  name: 'FormHero',
  components: {
    'v-input': BaseInput
  },
  data () {
    return {
    }
  },
  props: {
    action: {
      type: Object
    }
  },
  computed: {
  },
  methods: {
    handleSubmit: function (event) {
      this.$emit(this.action.handler, { 'action': this.action, 'event': event })
    }
  },
  mounted () {
  }
}
</script>

<style>
.form--hero {
  display: flex;
  justify-content: space-between;
  padding: 30px;
  background: white;
}
.form--hero .form_content {
  display: inline-block;
  position: relative;
}
.form--hero .form_content .field_content {
  margin: 0;
}
.form--hero .form_content .field_content .field_label {
  color: black;
}
.form--hero .form_content--body {
  flex-grow: 1;
}
.form--hero .form_content--actions {
  padding: 36px 0 0 20px;
  text-align: right;
}
.form--hero .form_content--actions .btn {
  height: 54px;
}
.form--hero .errors p {
  margin-bottom: 0;
}
</style>
