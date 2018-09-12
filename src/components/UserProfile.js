import React, { Component } from 'react'
import BookmarkList from '../components/BookmarkList'
import request from 'superagent';
import '../index.css'
import firebase from 'firebase';
import { ref } from '../config/constants'

export default class UserProfile extends Component {

  constructor(props) {
    super(props);

    const url=`http://api.giphy.com/v1/gifs/search?q=pizza&api_key=dc6zaTOxFJmzC`;

    request.get(url, (err, res) => {
      this.setState({ gifs: res.body.data });
    });

    this.state = {
      isMounted:false,
      gifs: [],
      items: [],
    };
  }
  render () {
    var user = firebase.auth().currentUser;
    var uid, username, bio, image;

    if (user != null) {
      uid = user.uid;

      var userRef = firebase.database().ref('User/' + uid);
      userRef.once('value', function(snapshot) {
        username = snapshot.val().username;

        image = snapshot.val().userImage;
        if(image == "nil"){
          image = "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Anonymous_emblem.svg/1000px-Anonymous_emblem.svg.png";
        }

        bio = snapshot.val().userBio;

        document.getElementById('usernameText').innerHTML = username;
        document.getElementById('bioText').innerHTML = bio;
        document.getElementById('userPicture').src = image;
      });
    }

    const divStyleLeft = {
      float:"left",
      width:"300px",
      height:"300px",
      clear:"both"
    };
    const divStyleRight = {
      float:"right",
      width:"70%",
      height:"1000px"
    };
    const userImageStyle = {
      margin: "15px",
      width:"90%"
    };
    const userNameStyle = {
      display:"block",
      textAlign:"center"
    };
    const divBioStyle = {
      width:"100%",
      height:"200px",
      padding:"20px",
      position: "relative"
    };
    const bioImageStyle = {
      position: "absolute",
      width:"30%",
      bottom: "-50px",
      right: "0",
      padding: "5px"
    };

    return (
      <div>
        <div style={divStyleLeft}>
          <img id="userPicture" alt=" " style={userImageStyle} src=""/>
          <label id='usernameText' style={userNameStyle}> {username} </label>
        </div>
        <div style={divStyleRight}>
          <div style={divBioStyle}>
            <label id='bioText'>Insert bio into here</label>
            <img alt=" " style={bioImageStyle} src="http://www.openbookpublishers.com/shopimages/sections/normal/Open-Bookpic.jpg"/>
          </div>
          <div>
            <BookmarkList gifs={this.state.gifs} />
          </div>
        </div>
      </div>
    )
  }
}
