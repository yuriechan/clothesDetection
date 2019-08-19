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
    // valid return value : {labelAnnotations: [{}, {}, {}]
    // invalide return value : {error: {object}}
    const labelAnnotations = imageAttributes.responses[0].labelAnnotations;
    // if property key is error, labelAnnotations will return undefined, which will be converted to false in conditional.
    if (labelAnnotations) {
      const labels = makeClothesLabel(labelAnnotations);
      const matchedLabels = findClothesMatch(labels);
      populateClothesMatch(matchedLabels);
      console.log(labels);
    }
  })
  .catch(error => console.error(error))
}

function makeClothesLabel(labelAnnotations) {
  let labelArr = [];
  labelAnnotations.forEach(function(labelAnnotation){
    let label = labelAnnotation.description.toLowerCase();
    labelArr.push(label);
  });
  return labelArr;
}

function findClothesMatch(labelArr) {
  const db = getDB();
  let matchedArr = [];
  // iterate each label inside its array 
  for (let i = 0, n = labelArr.length; i < n; i ++) {
    // iterate each item in db 
    for (let j = 0, m = db.length; j < m; j++) {
      // assign all value of property in an array 
      let attributeValueArr = Object.values(db[j]);
        // retrieve each item in attributeValueArr
        for (let index in attributeValueArr) {
          // when item is an array
          if (attributeValueArr[index].constructor === Array) {
            // iterate each item inside the array
            for (let k = 0, o = attributeValueArr[index].length; k < o; k++) {
              // compare the target label to each item inside the array
              if (labelArr[i] == attributeValueArr[index][k]) {
                // push to matched array
                // matchedArr.push(attributeValueArr[index][k]);
                matchedArr.push(j);
              }
            }
          } 
          // when item is not array
          else if (labelArr[i] == attributeValueArr[index]) {
            // matchedArr.push(attributeValueArr[index]);
            matchedArr.push(j);
          }
        }
    }
  }
  console.log(matchedArr);
  return matchedArr;
}

function getDB() {
  const db = [
    {
      gender: "m", // male
      category: "shirt", // shirt
      subCategory: ['tshirt', 'crew neck'], // ['tshirt', 'crew neck']
      color: ["white"], // ['red', 'white']
      dataUri: "", // base64 encoded image
      dataUrl: "/images/white-tshirt.jpg" // url of image
    }
  ];
  return db;
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
    <div>
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
      <div id="Results__container" />
  </div>
    );
  }
}

export default App;
