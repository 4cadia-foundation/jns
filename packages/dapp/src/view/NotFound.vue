<template>
    <div class="background">
      <div id="notfound">
          <div class="notfound">
              <div class="notfound-404">
                  <h1>404</h1>
              </div>
              <h2>Page not found</h2>
              <p>The page you are looking for, might have been removed, had its name changed or is temporarily unavailable.</p>
              <router-link to="/">Go back to JNS</router-link>
          </div>
      </div>
    </div>
</template>

<script>
export default {
  name: 'NotFound',
  data () {
    return {
    }
  },
  components: {
  },
  props: {
    message: {
      type: String,
      required: false
    }
  }
}
</script>
<style scoped>

.background {
    background-color: #f8f9fa;
}

#notfound {
    position: relative;
    height: 80vh;
}

#notfound .notfound {
    position: absolute;
    left: 50%;
    top: 50%;
    -webkit-transform: translate(-50%, -50%);
    -ms-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
}

.notfound .notfound-404 {
    height: 280px;
    position: relative;
    z-index: -1; 
}

.notfound .notfound-404 h1 {
    font-family: 'Montserrat', sans-serif;
    font-size: 230px;
    margin: 0px;
    font-weight: 900;
    position: absolute;
    left: 50%;
    -webkit-transform: translateX(-50%);
    -ms-transform: translateX(-50%);
    transform: translateX(-50%);
    background: url('../assets/images/hero.jpg') repeat;
    background-color: #442ab0;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-size: cover;
    background-position: center;
}

.notfound h2 {
    font-family: 'Montserrat', sans-serif;
    color: #000;
    font-size: 24px;
    font-weight: 700;
    text-transform: uppercase;
    margin-top: 0;
}

.notfound p {
    font-family: 'Montserrat', sans-serif;
    color: #000;
    font-size: 14px;
    font-weight: 400;
    margin-bottom: 20px;
    margin-top: 0px;
}

.notfound a {
    font-family: 'Montserrat', sans-serif;
    font-size: 14px;
    text-decoration: none;
    background: #442ab0;
    display: inline-block;
    padding: 15px 30px;
    border-radius: 5px;
    color: #f8f9fa;
    font-weight: 700;
    -webkit-box-shadow: 0px 4px 15px -5px #442ab0;
    box-shadow: 0px 4px 15px -5px #442ab0;
}

.notfound a:hover {
    color: #f8f9fa;
    text-decoration: none;
    background: #7757f9;
}

@media only screen and (max-width: 767px) {
    .notfound .notfound-404 {
        height: 142px;
        background-color: #f8f9fa;
    }
    .notfound .notfound-404 h1 {
        font-size: 112px;
    }
}
</style>
