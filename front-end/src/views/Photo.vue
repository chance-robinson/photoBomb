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
            <div id="commentSection">
                <div id="addComment" v-if="currentUser">
                    <form class="pure-form" @submit.prevent="upload">
                        <legend>Add a comment!</legend>
                        <fieldset>
                            <textarea v-model="description" placeholder="Comment"></textarea>
                        </fieldset>
                        <fieldset class="buttons">
                            <button type="submit">Submit</button>
                        </fieldset>
                    </form>
                </div>
                <div id="comments">
                    <legend>Comments</legend>
                    <div class="singleComment" v-for="comment in comments" v-bind:key="comment._id">
                        <p>{{comment.description}}</p>
                        <p>--{{comment.user.firstName}} {{comment.user.lastName}}</p>
                        <p>{{formatDate(comment.created)}}</p>
                    </div>
                </div>
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
            description: '',
            error: '',
            comments: Array,
            photoid: this.$route.params.id,
            userid: this.$route.params.userid,
        }
    },
    created() {
        this.getPhoto();
        this.getUser();
        this.getComments();
        this.currentUser();
    },
    computed: {
        currentUser() {
            return this.$root.$data.user;
        }
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
        async getComments() {
            try {
                let response = await axios.get("/api/comments/"+this.photoid);
                this.comments = response.data;
            } catch (error) {
                this.error = error.response.data.message;
            }
        },
        async upload() {
            try {
                await axios.post("/api/comments", {
                    description: this.description,
                    photo: this.photoid,
                });
                this.description = "";
                this.$emit('uploadFinished');
            } catch (error) {
                this.error = "Error: " + error.response.data.message;
            }
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

#commentSection {
    width: 100%;
}

#comments {
    display: inline-block;
    width: 50%;
}

#addComment {
    display: inline-block;
    width: 50%;
}

.singleComment {
    border: 1px solid cyan;
}

p {
  margin: 0px;
}
</style>