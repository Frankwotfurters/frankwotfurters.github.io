var originalImage = document.getElementById('original-image');
var imageInput = document.getElementById('image-input');

function displayCanvas(c) {
  // Convert the canvas to a data URL and display the final image
  var finalImageDataURL = c.toDataURL();

  var finalImage = document.createElement('img');
  finalImage.src = finalImageDataURL;
  finalImage.id = 'finalImg';

  // Set a maximum width and height for the displayed image
  finalImage.style.maxWidth = '82%';
  finalImage.style.maxHeight = '82%';

  document.getElementById("editImg").innerHTML = "";
  document.getElementById("editImg").appendChild(finalImage);

  document.getElementById("downloadButton").href = finalImageDataURL;
  document.getElementById("downloadButton").download = "download.png";
}

function displayMeasurements(cWidth, cHeight, imgWidth, imgHeight, bleed) {
  // Create a new canvas for measurements
  var measurementsCanvas = document.createElement('canvas');
  var measurementsContext = measurementsCanvas.getContext('2d');
  measurementsCanvas.width = cWidth;
  measurementsCanvas.height = cHeight;

  measurementsContext.strokeStyle = 'red'; // Set the line color (you can change it to your preferred color)
  measurementsContext.lineWidth = 2; // Set the line width (you can change it to your preferred width)  

  // Draw top image bound
  topBound = ((cHeight - imgHeight - bleed * 2) / 2);
  measurementsContext.beginPath();
  measurementsContext.moveTo(0, topBound);
  measurementsContext.lineTo(cWidth, topBound);
  measurementsContext.stroke();

  // Draw bottom image bound
  botBound = (cHeight - topBound);
  measurementsContext.beginPath();
  measurementsContext.moveTo(0, botBound);
  measurementsContext.lineTo(cWidth, botBound);
  measurementsContext.stroke();

  // Draw left image bound
  leftBound = ((cWidth - imgWidth - bleed * 2) / 2);
  measurementsContext.beginPath();
  measurementsContext.moveTo(leftBound, 0);
  measurementsContext.lineTo(leftBound, cHeight);
  measurementsContext.stroke();

  // Draw right image bound
  rightBound = (cWidth - leftBound);
  measurementsContext.beginPath();
  measurementsContext.moveTo(rightBound, 0);
  measurementsContext.lineTo(rightBound, cHeight);
  measurementsContext.stroke();

  var measurementsDataURL = measurementsCanvas.toDataURL();
  var measurementsImg = document.createElement('img');
  measurementsImg.src = measurementsDataURL;
  measurementsImg.id = 'measurements';

  // Set a maximum width and height for the displayed image
  measurementsImg.style.maxWidth = '82%';
  measurementsImg.style.maxHeight = '82%';

  // document.getElementById("editImg").innerHTML = "";
  document.getElementById("editImg").appendChild(measurementsImg);
}

function addBleed(canvas, context, bleed, smoothness, hexColor) {
  // Takes a context and adds bleed, then returns a copy of the original (for future calculations)

  // Get bleed RGB values from Hex
  const r = parseInt(hexColor.substr(1,2), 16);
  const g = parseInt(hexColor.substr(3,2), 16);
  const b = parseInt(hexColor.substr(5,2), 16);

  // Calculate the positioning of the images to center it
  var offsetX = (canvas.width - originalImage.width) / 2;
  var offsetY = (canvas.height - originalImage.height) / 2;

  // First, draw the original image on the canvas
  context.drawImage(originalImage, offsetX, offsetY);

  // Copy it for calculations later
  trimmedOriginal = trimCanvas(canvas);

  // Apply blur and draw the original image on the enlarged canvas
  context.filter = 'blur(' + bleed + 'px)';
  context.drawImage(originalImage, offsetX, offsetY);

  // Extract image data and modify non-transparent pixels to white
  var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  var data = imageData.data;
  var bleed = context.createImageData(imageData);

  for (var i = 0; i < data.length; i += 4) {
    var alpha = data[i + 3];
    if (alpha > smoothness) { // if opacity is above a certain threshold
      bleed.data[i] = r;
      bleed.data[i + 1] = g;
      bleed.data[i + 2] = b;
      bleed.data[i + 3] = 255; // Alpha
    }
  }

  // Remove filter to retrieve original image again
  context.filter = 'none';

  // Clear the canvas and put the modified image data
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.putImageData(bleed, 0, 0);

  // Draw the original image on top of the modified image
  context.drawImage(originalImage, offsetX, offsetY);

  return trimmedOriginal
}

function editBleed() {
  // Get all user inputs
  bleed = document.getElementById("Bleed").value;
  smoothness = document.getElementById("Smoothness").value;
  color = document.getElementById("colorPicker").value;

  // Create a canvas
  var canvas = document.createElement('canvas');
  var context = canvas.getContext('2d', { willReadFrequently: true });

  // Calculate the dimensions for the canvas (double of original dimensions)
  var maxDimension = Math.max(originalImage.width, originalImage.height);
  canvas.width = maxDimension * 1.2;
  canvas.height = maxDimension * 1.2;

  // Apply bleed to it
  trimmedOriginal = addBleed(canvas, context, bleed, smoothness, color);

  // Trim empty space around canvas
  trimmed = trimCanvas(canvas);
  trimmedHeight = trimmed.height;
  trimmedWidth = trimmed.width;
  originalHeight = trimmedOriginal.height;
  originalWidth = trimmedOriginal.width;

  // Calculate width of the bleed added (in px)
  DPI = document.getElementById("typeNumber").value;
  bleedPx = (trimmedHeight - trimmedOriginal.height) / 2;
  bleedWidth = bleedPx * (2.54 / DPI); // width in cm (2.54cm per inch; 96 dots per inch)
  document.getElementById("bleedWidth").value = bleedWidth;

  // Display image print size
  document.getElementById('newImgHeight').value = trimmedHeight * (2.54 / DPI);
  document.getElementById('newImgWidth').value = trimmedWidth * (2.54 / DPI);

  document.getElementById('imgHeight').value = originalHeight * (2.54 / DPI);
  document.getElementById('imgWidth').value = originalWidth * (2.54 / DPI);
  
  // Get any custom dimensions set, and scale new dimensions to that
  var elementDict = [
    document.getElementById("imgWidth"),
    document.getElementById("imgHeight"),
    document.getElementById("newImgWidth"),
    document.getElementById("newImgHeight"),
    document.getElementById("bleedWidth")
  ];

  for (var x = 0; x < 4; x++) {
    let changedData = elementDict[x].getAttribute("data-changed");
    if (changedData != "null") {
      // New dimension to scale to
      elementDict[x].value = changedData;
      editSize(x, changedData);
    }
  }

  // Display the measurements and edited image
  displayCanvas(canvas);
  displayMeasurements(canvas.width, canvas.height, originalWidth, originalHeight, bleedWidth);
}

imageInput.addEventListener('change', function (e) {
  document.getElementById("file-drop").style.display = "none";
  document.getElementById("editor").style.display = "block";
  var reader = new FileReader();
  reader.onload = function (event) {
    originalImage.src = event.target.result;
  }
  reader.readAsDataURL(e.target.files[0]);
});

var imageInput = document.getElementById('image-input');

originalImage.addEventListener('load', function () {
  editBleed();
});

var colorPickerTimeout;

function editColor() {
  clearTimeout(colorPickerTimeout); // Clear any existing timeout
  colorPickerTimeout = setTimeout(editBleed, 300); // Call editBleed() after 300 milliseconds of no input
}

// MIT http://rem.mit-license.org
function trimCanvas(c) {
  var ctx = c.getContext('2d'),
    copy = document.createElement('canvas').getContext('2d'),
    pixels = ctx.getImageData(0, 0, c.width, c.height),
    l = pixels.data.length,
    i,
    bound = {
      top: null,
      left: null,
      right: null,
      bottom: null
    },
    x, y;

  // Iterate over every pixel to find the highest
  // and where it ends on every axis ()
  for (i = 0; i < l; i += 4) {
    if (pixels.data[i + 3] !== 0) {
      x = (i / 4) % c.width;
      y = ~~((i / 4) / c.width);

      if (bound.top === null) {
        bound.top = y;
      }

      if (bound.left === null) {
        bound.left = x;
      } else if (x < bound.left) {
        bound.left = x;
      }

      if (bound.right === null) {
        bound.right = x;
      } else if (bound.right < x) {
        bound.right = x;
      }

      if (bound.bottom === null) {
        bound.bottom = y;
      } else if (bound.bottom < y) {
        bound.bottom = y;
      }
    }
  }

  // Calculate the height and width of the content
  var trimHeight = bound.bottom - bound.top,
    trimWidth = bound.right - bound.left,
    trimmed = ctx.getImageData(bound.left, bound.top, trimWidth, trimHeight);

  copy.canvas.width = trimWidth;
  copy.canvas.height = trimHeight;
  copy.putImageData(trimmed, 0, 0);

  // Return trimmed canvas
  return copy.canvas;
}

function editSize(i, newValue) {
  // Current values
  // trimmedWidth
  // trimmedHeight
  // originalWidth
  // originalHeight
  var pixelDict = [originalWidth, originalHeight, trimmedWidth, trimmedHeight, bleedPx]
  var elementDict = [
    document.getElementById("imgWidth"),
    document.getElementById("imgHeight"),
    document.getElementById("newImgWidth"),
    document.getElementById("newImgHeight"),
    document.getElementById("bleedWidth")
  ];

  let newSize;

  for (var x = 0; x < 5; x++) {
    if (x != i) {
      // for each value to be calculated
      newSize = pixelDict[x] / pixelDict[i] * newValue;
      elementDict[x].value = newSize;

      // clear changed data flag
      elementDict[x].setAttribute("data-changed", null);
    }
    else {
      // set changed data flag for recalculation
      elementDict[x].setAttribute("data-changed", newValue);
    }
  }

}