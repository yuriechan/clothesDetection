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

  // assign URI of image when accepted ?
    // console.log the value of state to understand the function of onDrop()
  onDrop = (accepted, rejected, links) => {
    this.setState({ 
      preview: accepted[0].preview || links[0] },
      function () {console.log(this.state.preview)
    })
  }
  
  cropToCanvas = (image, canvas, ctx) => {
    const naturalWidth = image.naturalWidth;
    const naturalHeight = image.naturalHeight;

    canvas.width = image.width;
    canvas.height = image.height;
    // area of canvas that is in color white (cleared)
    ctx.clearRect(0,0, ctx.canvas.width, ctx.canvas.height);

    // set the area of uploaded image 
    if (naturalWidth > naturalHeight) {
      ctx.drawImage(
        image,
        (naturalWidth - naturalHeight) / 2,
        0,
        naturalHeight,
        naturalHeight,
        0,
        0,
        ctx.canvas.width,
        ctx.canvas.height
      );
    } else {
      ctx.drawImage(
        image,
        0,
        (naturalHeight - naturalWidth) / 2,
        naturalWidth,
        naturalWidth,
        0,
        0,
        ctx.canvas.width,
        ctx.canvas.height
      );
    }
  };

  render() {
    return (
      <div className="Dropzone-page">
        {this.state.model ? (
          <MagicDropzone
            className="Dropzone"
            accept="image/jpeg, image/png, .jpg, .jpeg, .png"
            multiple={false}
            onDrop={this.onDrop}
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
