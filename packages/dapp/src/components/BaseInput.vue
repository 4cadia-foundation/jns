<template>
  <div :class="`field_content content--${inputType} ${isValid}`">
    <label :for="inputName" :class="labelClass">{{ inputLabel }}</label>
    <input
      :class="isValid"
      :type="inputType"
      :name="inputName"
      :minlength="minlength"
      :placeholder="placeholderTxt"
      :value="value"
      @input="$emit('input', $event.target.value)"
      v-on:keyup="handleKeyUp"
      class="field"
    />
    <div class="errors">
      <li v-for="(exception, index) in exceptions" :key="index">
        <p v-if="exception.show">{{ exception.message }}</p>
      </li>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'BaseInput',
  components: {},
  props: {
    placeholderTxt: {
      type: String,
      default: '',
    },
    inputType: {
      type: String,
      default: 'text',
    },
    inputName: {
      type: String,
      default: '',
    },
    inputLabel: {
      type: String,
      default: '',
    },
    maxlength: {
      type: [String, Number],
      default: undefined,
    },
    minlength: {
      type: [String, Number],
      default: undefined,
    },
    alphaNumeric: {
      type: Boolean,
    },
    required: {
      type: Boolean,
    },
    value: {
      type: String,
      required: true,
    },
    labelClass: {
      default: 'field_label',
      type: String,
    },
  },
  data() {
    return {
      exceptions: [],
    };
  },
  computed: {
    ...mapGetters('validation', ['getExceptionByType']),
    hasExceptions: function() {
      return (
        this.exceptions.filter(exception => exception.show === true).length > 0
      );
    },
    isValid: function() {
      return this.hasExceptions ? 'invalid' : '';
    },
  },
  mounted() {
    this.exceptions.push(
      {
        type: 'EmptyField',
        message: this.getExceptionByType('EmptyField'),
        show: false,
      },
      {
        type: 'InvalidField',
        message: this.getExceptionByType('InvalidField'),
        show: false,
      },
      {
        type: 'MaxLength',
        message: this.getExceptionByType('MaxLength').replace(
          '{ keyword }',
          this.maxlength
        ),
        show: false,
      },
      {
        type: 'MinLength',
        message: this.getExceptionByType('MinLength').replace(
          '{ keyword }',
          this.minlength
        ),
        show: false,
      }
    );
  },
  methods: {
    handleKeyUp: function(value) {
      if (this.required)
        this.fieldIsValid(this.isEmpty(this.value), 'EmptyField');
      if (this.alphaNumeric)
        this.fieldIsValid(!this.isAlphaNumeric(this.value), 'InvalidField');
      if (this.maxlength)
        this.fieldIsValid(this.isMaxLength(this.value), 'MaxLength');
      if (this.minlength)
        this.fieldIsValid(this.isMinLength(this.value), 'MinLength');
    },
    handleValidate: function(event) {
      this.handleKeyUp();
      return this.hasExceptions;
    },
    fieldIsValid: function(exception, type) {
      const exceptionType = this.filterExceptionByType(type);
      if (exception) {
        exceptionType['0'].show = true;
      } else {
        exceptionType['0'].show = false;
      }
    },
    filterExceptionByType: function(exceptionType) {
      return this.exceptions.filter(
        exception => exception.type === exceptionType
      );
    },
    isEmpty: function(value) {
      return value === '' || value == null;
    },
    isAlphaNumeric: function(value) {
      var re = /^[a-zA-Z0-9]+$/;
      return value ? re.test(value) : true;
    },
    isMaxLength: function(value) {
      return value.length > this.maxlength;
    },
    isMinLength: function(value) {
      return value.length < this.minlength;
    },
  },
};
</script>

<style scoped>
.field_content {
  position: relative;
  text-align: left;
  margin: 20px auto;
}
.field_label {
  color: var(--color-white);
  margin-bottom: 10px;
  display: block;
}
.field {
  padding-top: 0px;
  padding-bottom: 0px;
  padding-left: 16px;
  padding-right: 16px;
  color: var(--color-gray);
  background-color: rgb(255, 255, 255);
  height: 3rem;
  width: 100%;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 4px;
  font-size: 1rem;
  border-width: 1px;
  border-style: solid;
  border-image: initial;
  border-color: var(--color-gray-lighter);
  border-radius: 4px;
  box-sizing: border-box;
}
.field:hover {
  box-shadow: rgba(0, 0, 0, 0.3) 0px 2px 6px;
}
.field:focus {
  outline: none;
  border-color: var(--color-primary);
}
.field.invalid {
  color: var(--color-red);
  border-color: var(--color-red);
  border-left-width: 5px;
}
.content--file .field {
  opacity: 0; /* invisible but it's there! */
  width: 100%;
  height: 100px;
  position: absolute;
  cursor: pointer;
  top: 0%;
  right: 0%;
  padding: 0;
}

.field:-webkit-autofill,
.field:-webkit-autofill:hover,
.field:-webkit-autofill:focus,
.field:-webkit-autofill:active {
  -webkit-box-shadow: 0 0 0 30px white inset !important;
  -webkit-text-fill-color: black !important;
}
</style>
