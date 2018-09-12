import React from 'react';

var FontAwesome = require('react-fontawesome');

class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = { term: '' }
  }

  onInputChange(term) {
    this.setState({term});
    this.props.onTermChange(term);
  }

  render() {
    return (
      <div className="search">
        <input onChange={event => this.onInputChange(event.target.value) } />
    <div className="searchIcon">
        <FontAwesome className="pull-right" name='search' size='2x' style={{ textShadow: '0 1px 0 rgba(0, 0, 0, 0.1)' }}/>
        </div>
      </div>
    );
  }
}

export default SearchBar;
