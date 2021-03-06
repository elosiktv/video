import React, { Component } from 'react';
import Video from '../Video/video';
import { Helmet } from 'react-helmet';
import firebase from '../../config/firebase';
import './liked.css';

class Preloader extends Component {
    constructor() {
        super();
        this.state = {
            videos: null
        };
    }
    componentDidMount() {
        firebase.auth().onAuthStateChanged((user) => {
            firebase.database().ref('users').orderByChild('email').equalTo(user.email).on('value', (snapshot) => {
                let newState = [];
                snapshot.forEach((childSnap) => {
                    let userLikedVideos = childSnap.val().likes;
                    for (let i = 0; i < userLikedVideos.length; i++) {
                        firebase.database().ref('videos').orderByChild('id').equalTo(userLikedVideos[i]).on('value', (snapshot) => {
                            let videos = snapshot.val();
                            for (let item in videos) {
                                newState.push({
                                    title: videos[item].title,
                                    miniature: videos[item].miniature,
                                    duration: videos[item].duration,
                                    id: videos[item].id,
                                    author: videos[item].author.split("@")[0],
                                    views: videos[item].views,
                                    uploadDate: videos[item].uploadDate
                                });
                            }
                            this.setState({
                                videos: newState
                            });
                        });
                    }
                });
            });
        });
    }
    render() {
        return (
            <div className="head">
                <Helmet>
                    <title>Liked videos - Video site</title>
                </Helmet>
                <div className="wrapper">
                    {
                        this.state.videos ? (
                            this.state.videos.map((item) => {
                                return (
                                    <Video key={item.id} uploadDate={item.uploadDate} views={item.views} author={item.author} length={item.duration} title={item.title} image={item.miniature} id={item.id} />
                                )
                            })
                        ) : (
                            ''
                        )
                    }
                </div>
            </div>
        )
    }
}

export default Preloader;