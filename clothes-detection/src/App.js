import React, {Component} from 'react';
import './App.css';
import MagicDropzone from 'react-magic-dropzone';

function getImageAttributes(userImage="https://www.converse.com/dw/image/v2/BCZC_PRD/on/demandware.static/-/Sites-cnv-master-catalog/default/dw2a253cb0/images/a_107/162065C_A_107X1.jpg") {
  const yurieApiKey = 'IzaSyCc2ZRO2cPmW50mHI8SDG1okNRzDo33gAU';
  const majorApiKey = 'AIzaSyB_LRUShuGlrxDwNvR9FBsyyiMUUGXZTb0';
  const url = `https://vision.googleapis.com/v1/images:annotate?alt=json&key=${majorApiKey}`;
  const requestParams = {
    "requests": [
      {
        "image": {
          "source": {
            "imageUri": userImage
          }
        },
        "features": [
          {
            "maxResults": 0,
            "type": "LABEL_DETECTION"
          }
        ]
      }
    ]
  }
  const options = {
    method: 'POST',
    body: JSON.stringify(requestParams),
  };
  fetch(url, options)
  .then(response => response.json())
  .then(imageAttributes => {
    console.log(imageAttributes);
    // figure out how to pass imageAttributes out to the react components
  })
  .catch(error => error.log(error))
}
getImageAttributes();

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

  // assign URI of image when accepted ?
    // console.log the value of state to understand the function of onDrop()
  onDrop = (accepted, rejected, links) => {
    this.setState({ 
      preview: accepted[0].preview || links[0] },
      function () {console.log(this.state.preview)
    })
  }

  render() {
    return (
      <div className="Dropzone-page">
        {this.state.model ? (
          <MagicDropzone
            className="Dropzone"
            accept="image/jpeg, image/png, .jpg, .jpeg, .png"
            multiple={false}
            onDrop={this.onDrop}
            onDragEnd={imageUploaded(this.state.preview)}
          >
            <div className="Dropzone-content">
              {this.state.preview ? (
                <img 
                  alt="upload preview"
                  className="Dropzone-img"
                  src={this.state.preview}
                />
              ) : (
                "Choose or drop a file"
              )}
              <canvas id="canvas" />
            </div>
          </MagicDropzone> 
        ) : (
          <div className="Dropzone">Loading model</div>
        )}
      </div>
    );
  }
}

// access state property inside App Class after the class is declared
  // remove this variable because it can only access to the original state, not the updated state
  // let imageURL = new App().state.preview;

// if no image was uploaded, do not hit the API
  // else, hit the API to produce label
function imageUploaded (url) {
  if (url == false) {
    return;
  } else {
    console.log(url + 'I am true')
  }
}
export default App;
