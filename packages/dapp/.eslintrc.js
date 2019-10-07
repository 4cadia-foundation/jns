module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint'
  },
  env: {
    browser: true
  },
  extends: ['plugin:vue/essential', 'standard'],
  plugins: ['vue'],
  rules: {
    'generator-star-spacing': 'off'
  }
}
