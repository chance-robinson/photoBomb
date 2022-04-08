<template>
<div>
  <section class="image-gallery">
    <div class="image" v-for="(photo,index) in photos" v-bind:key="photo._id">
      <router-link :to="{ name: 'photo', params: { id: photo._id, userid: photo.user._id}}"><img :src="photo.path" /></router-link>
      <div class="photoInfo">
        <p class="photoTitle">{{photo.title}}</p>
        <p class="photoName">{{photo.user.firstName}} {{photo.user.lastName}}</p>
      </div>
      <p class="photoDate">{{formatDate(photo.created)}}</p>
      <div class="buttons">
        <button @click="toggleEdit" v-if="routeid === 'dashboard'">Edit</button>
        <editor :photo="photo" :show="show" @close="close" @uploadEdit="uploadEdit"/>
        <button @click="deleteItem(photo._id,index)" v-if="routeid === 'dashboard'">Delete</button>
      </div>
    </div>
  </section>
</div>
</template>

<script>
import axios from 'axios';
import moment from 'moment';
import Editor from './Editor.vue';

export default {
  name: 'ImageGallery',
  components: {
    Editor,
  },
  props: {
    photos: Array
  },
  data() {
    return {
      routeid: this.$route.name,
      show: false,
    }
  },
  methods: {
    formatDate(date) {
      if (moment(date).diff(Date.now(), 'days') < 15)
        return moment(date).fromNow();
      else
        return moment(date).format('d MMMM YYYY');
    },
    async deleteItem(photo,index) {
              try {
                  await axios.delete("/api/photos/"+photo);
                  document.getElementsByClassName('image')[index].innerHTML = 'Image deleted';
                  return true;
              } catch (error) {
                  //console.log(error);
              }
    },
    close() {
      this.show = false;
    },
    toggleEdit() {
      this.show = true;
    },
    async uploadEdit() {
      this.show = false;
    },
  },
}
</script>

<style scoped>
.photoInfo {
  display: flex;
  justify-content: space-between;
  font-size: 0.8em;
}

.photoInfo p {
  margin: 0px;
}

.photoDate {
  font-size: 0.7em;
  font-weight: normal;
}

p {
  margin: 0px;
}

/* Masonry */
*,
*:before,
*:after {
  box-sizing: inherit;
}

.image-gallery {
  border: 1px solid black;
  column-gap: 1em;
}

.image {
  margin: 0 0 1.5em;
  display: inline-block;
  width: 100%;
  border: 1px solid black
}

.image img {
  width: 100%;
}

/* Masonry on large screens */
@media only screen and (min-width: 1024px) {
  .image-gallery {
    column-count: 4;
  }
}

/* Masonry on medium-sized screens */
@media only screen and (max-width: 1023px) and (min-width: 768px) {
  .image-gallery {
    column-count: 3;
  }
}

/* Masonry on small screens */
@media only screen and (max-width: 767px) and (min-width: 540px) {
  .image-gallery {
    column-count: 2;
  }
}
</style>