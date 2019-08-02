import React, {Component} from 'react';
import './App.css';
import MagicDropzone from 'react-magic-dropzone';

class App extends Component {

  // add data to manage inside this component (can mutate unlike props in functional component)
  state = {
    model: null,
    preview: "",
    predictions: []
  };

  // when model is always true (only for test)
  componentDidMount() {
    this.setState({
      model: true
    });
  }

  render() {
    return (
      <div className="App">
        <h1>Hi, I am react app.</h1>
      </div>
    )
  }
}

export default App;
