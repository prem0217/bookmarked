import React, { Component } from 'react'
import BookmarkList from '../../components/BookmarkList'
import SearchBar from '../../components/SearchBar';
import request from 'superagent';
import '../../index.css'
import { refBook } from '../../config/constants'

var GifPlayer = require('react-gif-player'); //https://www.npmjs.com/package/react-gif-player

export default class Feed extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isMounted:false,
      gifs: [],
      items: [],
    };
  }

  componentDidMount(){
    this.setState({isMounted: true})
    refBook.on('value', snapshot => {
      var isGifBool, isImgBool, isVideoBool;
      var arr = [];

      snapshot.forEach(function(childSnapshot) {
        if(childSnapshot.val().gif !== "nil"){
          isGifBool = true;
          isImgBool = false;
          isVideoBool = false;
        }
        else if(childSnapshot.val().image !== "nil"){
          isImgBool = true;
          isGifBool = false;
          isVideoBool = false;
        }
        else if(childSnapshot.val().video !== "nil"){
          isVideoBool = true;
          isGifBool = false;
          isImgBool = false;
        }
        arr.push({
          bookedCount: childSnapshot.val().bookedCount,
          gif: childSnapshot.val().gif,
          image: childSnapshot.val().image,
          keyString: childSnapshot.val().keyString,
          postText: childSnapshot.val().postText,
          timeStamp: childSnapshot.val().timeStamp,
          title: childSnapshot.val().title,
          userPosted: childSnapshot.val().userPosted,
          video: childSnapshot.val().video,
          isGif: isGifBool,
          isImg: isImgBool,
          isVideo: isVideoBool,
        });
      });
      if(this.state.isMounted){
        this.setState({
          items: this.state.items.concat(arr)
        });
      }
    });
  }

  componentWillUnmount(){
    this.setState({isMounted:false})
  }

  handleTermChange = (term) => {
    const url = `http://api.giphy.com/v1/gifs/search?q=${term.replace(/\s/g, '+')}&api_key=dc6zaTOxFJmzC`;
    request.get(url, (err, res) => {
      this.setState({ gifs: res.body.data })
    });
  };

  render () {
/*CSS stuff */
    return (
      <div>
        <SearchBar onTermChange={this.handleTermChange} />
        <BookmarkList gifs={this.state.gifs} />
        <List items={this.state.items} />
      </div>
    )
  }
}

var Node = require('react-if-comp');

const List = (props) => {
  return (
    <ul>
    { props.items.map( (item,i) => {
     const {bookedCount, gif, image, postText, timeStamp, title, userPosted, video , isImg, isGif, isVideo} = item;
    return (
      <div className="gallery">
        <p className='gif-item'>{item.title}</p>
        <Node if={item.isImg} then={<img className='gallery-img' alt=" " src={item.image}/> }/>
        <Node if={item.isVideo} then={<video  className="gallery-img" controls> <source src={item.video} type="video/mp4" /> </video>} />
        <Node if={item.isGif} then={<GifPlayer className='gallery-img' gif={item.gif} /> } />
      </div>
    )
    })}
    </ul>
  )
}
