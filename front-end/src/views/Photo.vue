<template>
    <div>
            <div id="image">
                <div class="photoInfo">
                    <p class="photoTitle">{{photo.title}}</p>
                    <p class="photoName">{{user.firstName}} {{user.lastName}} </p>
                </div>
                <p class="photoDescription">{{photo.description}}</p>
                <p class="photoDate">{{formatDate(photo.created)}}</p>
                <img :src="photo.path" />
            </div>
    </div>
</template>

<script>
import axios from 'axios';
import moment from 'moment';

export default {
    name: 'Photo',
    data() {
        return {
            photo: '',
            user: '',
            photoid: this.$route.params.id,
            userid: this.$route.params.userid,
        }
    },
    created() {
        this.getPhoto();
        this.getUser();
    },
    methods: {
        async getPhoto() {
            try {
                let response = await axios.get("/api/photos/"+this.photoid);
                this.photo = response.data;
            } catch (error) {
                this.error = error.response.data.message;
            }
        },
        async getUser() {
            try {
                let response = await axios.get("/api/users/"+this.userid);
                console.log(response);
                this.user = response.data;
            } catch (error) {
                this.error = error.response.data.message;
            }
        },
        formatDate(date) {
            if (moment(date).diff(Date.now(), 'days') < 15)
                return moment(date).fromNow();
            else
                return moment(date).format('d MMMM YYYY');
        },
    },
}
</script>

<style scoped>
#image {
    padding-top: 8rem;
    text-align: center;
    width: 100%;
}

#image img {
    max-width:70%;
    height: 50%;
}

.photoInfo {
  display: flex;
  justify-content: center;
  font-size: 0.8em;
}

.photoTitle {
    margin-right:10%;
    font-size: 2em;
}

.photoDescription {
    font-size: 1.5em;
}

.photoName {
    margin-left: 10%;
    font-size: 2em;
}

.photoDate {
  font-size: 0.7em;
  font-weight: normal;
}

p {
  margin: 0px;
}
</style>