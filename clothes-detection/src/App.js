import React, {Component} from 'react';
import './App.css';
import MagicDropzone from 'react-magic-dropzone';

function getImageAttributes(imageUri) {
  const yurieApiKey = 'AIzaSyAugHyBMfx_NSZcrc1H4QZ0e1mtIMgHPCg';
  const majorApiKey = 'AIzaSyB_LRUShuGlrxDwNvR9FBsyyiMUUGXZTb0';
  const url = `https://vision.googleapis.com/v1/images:annotate?alt=json&key=${yurieApiKey}`;
  const requestParams = {
    "requests": [
      {
        "image": {
          "content" : imageUri,
          "source": {
            "imageUri": ''
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
    // figure out how to pass imageAttributes out to the react components
    console.log(makeClothesLabel(imageAttributes));
  })
  .catch(error => console.error(error))
}

function makeClothesLabel (obj) {
  let resultArr = obj.responses[0].labelAnnotations;
  let labelArr = [];
  resultArr.forEach(function(result){
    let label = result.description;
    labelArr.push(label);
  })
  let labelString = labelArr.join();
  return labelString;
}

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

  // convert local file => blob => base 64 (when uploaded image is local)
  convertBase64 = (localFile) => {
  fetch(localFile)
  .then(function(response) {
    return response.blob()
  })
  .then(function(blob) {
    let reader = new FileReader(); 
    reader.readAsDataURL(blob);
    reader.onload = function () {
      let rawBase64data = reader.result;
      // remove the header string of base 64 data
      let finalBase64data = rawBase64data.substr(rawBase64data.indexOf(',') + 1);
      getImageAttributes(finalBase64data);
    }
  })
  .catch(error => console.log(error))
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
            onDragEnd={this.convertBase64(this.state.preview)}
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

export default App;
