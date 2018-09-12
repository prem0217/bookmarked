import React, { Component } from 'react'
import { ref, storageRef } from '../config/constants'
import firebase from 'firebase'

export default class AddBookmark extends Component {
  constructor() {
    super();
    this.state = {
      showUpload: false,
      showLink: false,
    }
  }

  onClickUpload(e) {
    e.preventDefault();
    this.setState({showUpload: true});
    this.setState({showLink: false});
    document.getElementById("UploadButton").disabled = true;
    document.getElementById("LinkButton").disabled = false;
  }

  onClickLink(e) {
    e.preventDefault();
    this.setState({showUpload: false});
    this.setState({showLink: true});
    document.getElementById("UploadButton").disabled = false;
    document.getElementById("LinkButton").disabled = true;
  }

  render () {
    return (
      <div className="col-sm-6 col-sm-offset-3">
        <h1>Add Bookmark</h1>
        <button id="UploadButton" onClick={this.onClickUpload.bind(this)} className="btn btn-primary">Upload Bookmark</button>
        <button id="LinkButton" onClick={this.onClickLink.bind(this)} className="btn btn-primary">Link Bookmark</button>
        <br/>
        {this.state.showUpload && < UploadForm / >}
        {this.state.showLink && < LinkForm / >}
      </div>
    )
  }
}

export class UploadForm extends Component {
  handleSubmit = (e) => {
    e.preventDefault();
    var bookmarkRef = ref.child("Bookmark/").push();
    var key = bookmarkRef.key;
    var desc = this.desc;
    var title = this.title;
    var filename = this.file.files[0].name;
    var uploadTask = storageRef.child("Bookmark/" + key + "/" + filename).put(this.file.files[0]);
    var user = firebase.auth().currentUser;
    var userID, username;
    if (user != null) {
      userID = user.uid;
      ref.child("User/" + userID).once("value").then(function (snapshot) {
        username = snapshot.val().username;

        // Need to do upload in here since need to be sure username is retrieved first
        // Storage upload
        uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
          function(snapshot) {
            // Task progress
          }, function(error) {
            // Error handling
          }, function() {
            // Upload success
            var url = uploadTask.snapshot.downloadURL;
            var date = new Date().toString();
            
            // Realtime database upload setup
            var upload = {
              bookedCount: 0,
              postText: desc.value,
              timeStamp: date,
              title: title.value,
              userPosted: username,
              userID: userID,
              keyString: key
            };

            // Decide if image, gif, or video
            if (filename.endsWith(".gif")) {
              // Uploading gif
              upload["gif"] = url;
              upload["image"] = "nil";
              upload["video"] = "nil";
            } else if (filename.endsWith(".jpg") || filename.endsWith(".jpeg") || filename.endsWith(".png")) {
              // Uploading image, maybe add more filetypes later if needed?
              upload["gif"] = "nil";
              upload["image"] = url;
              upload["video"] = "nil";
            } else {
              // Just assuming anything else is a video now I guess? Lots of video formats
              upload["gif"] = "nil";
              upload["image"] = "nil";
              upload["video"] = url;
            }

            // Actually do the upload
            ref.child("Bookmark/" + key).set(upload);

            // Update UserToBookmark list as well
            var updates = {};
            updates[key] = 0; // Default for not in superbookmarks
            ref.child("UserToBookmark/" + userID + "/").update(updates);
          });
      });
    }

  }
  render() {
    return (
      <div>
        <h3>Upload Bookmark</h3>
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label>Title</label>
            <input className="form-control" ref={(title) => this.title = title} placeholder="Title"/>
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea className="form-control" placeholder="Description" rows="3" ref={(desc) => this.desc = desc} />
          </div>
          <div className="form-group">
            <label>File Upload</label>
            <input type="file" className="form-control" ref={(file) => this.file = file} />
          </div>
          <button type="submit" className="btn btn-primary">Submit</button>
        </form>
      </div>
    )
  }
}

class LinkForm extends Component {
  handleSubmit = (e) => {
    e.preventDefault();
    var bookmarkRef = ref.child("Bookmark/").push();
    var key = bookmarkRef.key;
    var desc = this.desc;
    var title = this.title;
    var url = this.url.value;
    var date = new Date().toString();
    var user = firebase.auth().currentUser;
    var userID, username;

    if (user != null) {
      userID = user.uid;
      ref.child("User/" + userID).once("value").then(function (snapshot) {
        username = snapshot.val().username;

        // Need to do upload in here since need to be sure username is retrieved first
        // Realtime database upload setup
        var upload = {
          bookedCount: 0,
          postText: desc.value,
          timeStamp: date,
          title: title.value,
          userPosted: username,
          userID: userID,
          keyString: key
        };

        // Decide if image, gif, or video
        if (url.endsWith(".gif") || url.endsWith(".gif/")) {
          // Uploading gif
          upload["gif"] = url;
          upload["image"] = "nil";
          upload["video"] = "nil";
        } else if (url.endsWith(".jpg") || url.endsWith(".jpg/") || url.endsWith(".png") ||
                  url.endsWith(".png/") || url.endsWith(".jpeg") || url.endsWith(".jpeg/")) {
          // Uploading image, maybe add more filetypes later if needed?
          upload["gif"] = "nil";
          upload["image"] = url;
          upload["video"] = "nil";
        } else {
            // Just assuming anything else is a video now I guess? Could do contains() to check for YouTube maybe
            upload["gif"] = "nil";
            upload["image"] = "nil";
            upload["video"] = url;
          }

          // Actually do the upload
          ref.child("Bookmark/" + key).set(upload);

          // Update UserToBookmark list as well
          var updates = {};
          updates[key] = 0; // Default for not in superbookmarks
          ref.child("UserToBookmark/" + userID + "/").update(updates);
      });
    }
  }
  render() {
    return (
      <div>
        <h3>Link Bookmark</h3>
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label>Title</label>
            <input className="form-control" ref={(title) => this.title = title} placeholder="Title"/>
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea className="form-control" placeholder="Description" rows="3" ref={(desc) => this.desc = desc} />
          </div>
          <div className="form-group">
            <label>Link</label>
            <input type="text" className="form-control" placeholder="Link to image, gif, video..." ref={(url) => this.url = url} />
          </div>
          <button type="submit" className="btn btn-primary">Submit</button>
        </form>
      </div>
    )
  }
}