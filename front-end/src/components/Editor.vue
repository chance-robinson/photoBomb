<template>
<transition v-if="show" name="modal">
  <div class="modal-mask">
    <div class="modal-container">
      <form class="pure-form" @submit.prevent="upload">
        <legend>Edit your picture {{photo}}</legend>
        <fieldset>
          <input v-model="title" placeholder="Title">
        </fieldset>
        <fieldset>
          <textarea v-model="description" placeholder="Description"></textarea>
        </fieldset>
        <div class="uploadPhoto">
            <div class="currentImage">
                <p>Current Image</p>
                <img :src="this.photo.path" />
            </div>
            <div class="newImage">
                <p>New Image</p>
                <img v-if="url" :src="url" />
                <input class="fileInput" ref="fileInput" type="file" @input="fileChanged">
            </div>
        </div>
        <fieldset>
          <div class="imageInput" @click="chooseImage">
            <div class="placeholder">
              Add new Image
            </div>
          </div>
          <p v-if="error" class="error">{{error}}</p>
        </fieldset>
        <fieldset class="buttons">
          <button type="button" @click="close" class="pure-button">Close</button>
          <button type="submit" class="pure-button pure-button-primary right">Upload</button>
        </fieldset>
      </form>
    </div>
  </div>
</transition>
</template>

<script>
import axios from 'axios';
export default {
  name: 'EditPhoto',
  props: {
    show: Boolean,
    photo: Object
  },
  data() {
    return {
      title: this.photo.title,
      description: this.photo.description,
      path: '',
      url: '',
      file: null,
      error: '',
    }
  },
  methods: {
    fileChanged(event) {
        this.file = event.target.files[0];
        this.url = URL.createObjectURL(this.file);
    },
    close() {
        this.$emit('close');
    },
    chooseImage() {
        this.$refs.fileInput.click()
    },
    async upload() {
        try {
            const formData = new FormData();
            console.log(this.file);
            if (this.file === null) {
                console.log('photo not added');
                formData.append('photo', this.photo.path);
            }
            else {
                console.log('photo added')
                formData.append('photo', this.file, this.file.name);
            }
            formData.append('title', this.title);
            formData.append('description', this.description);
            await axios.put("/api/photos/"+this.photo._id, formData);
            this.file = null;
            this.url = "";
            this.title = "";
            this.description = "";
            this.path = "";
            this.$emit('uploadEdit');
        } catch (error) {
            this.error = "Error: " + error.response.data.message;
        }
    },
}
}
</script>

<style scoped>
/* Modals */
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .3);
  transition: opacity 0.5s ease;
  display: flex;
  transition: background 0.2s ease-in-out, height 1s ease-in-out;
  transition: height 0.2s ease-in-out, width 0.2s ease-in-out;
  justify-content: center;
  transition-timing-function: cubic-bezier(0.64, 0.57, 0.67, 1.53);
}

.modal-container {
  width: 50%;
  height: max-content;
  margin-top: 80px;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
  transition: all 0.5s ease;
}

/*
* The following styles are auto-applied to elements with
* transition="modal" when their visibility is toggled
* by Vue.js.
*
* You can easily play with the modal transition by editing
* these styles.
*/
.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}

/* Form */

form {
  font-size: 11pt;
}

input {
  width: 100%;
}

textarea {
  width: 100%;
  height: 100px;
}

.placeholder {
  background: #F0F0F0;
  width: 200px;
  height: 3rem;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #333;
  font-size: 14px;
  cursor: pointer;
}

.placeholder:hover {
  background: #E0E0E0;
}

.fileInput {
  display: none;
}

img {
  width: 200px;
}

.buttons {
  display: flex;
  justify-content: space-between;
}

.uploadPhoto {
    display: flex;
    border: 1px solid red;
    width: 100%;
}

.currentImage {
    border: 1px solid black;
    width: 50%;
    display: inline-block;
}

.newImage {
    border: 1px solid blue;
    width: 50%;
    display: inline-block;
}
</style>