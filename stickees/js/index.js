var originalImage = document.getElementById('original-image');
var imageInput = document.getElementById('image-input');

function displayCanvas(c) {
  // Convert the canvas to a data URL and display the final image
  var finalImageDataURL = c.toDataURL();

  var finalImage = document.createElement('img');
  finalImage.src = finalImageDataURL;

  // Set a maximum width and height for the displayed image
  finalImage.style.maxWidth = '82%';
  finalImage.style.maxHeight = '82%';

  document.getElementById("editImg").innerHTML = "";
  document.getElementById("editImg").appendChild(finalImage);
}

function addBleed(canvas, context, bleed, smoothness) {
  // Takes a context and adds bleed, then returns a copy of the original (for future calculations)

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
      bleed.data[i] = 255;
      bleed.data[i + 1] = 255;
      bleed.data[i + 2] = 255;
      bleed.data[i + 3] = 255;
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

function editBleed(bleed) {
  // Get all user inputs
  bleed = document.getElementById("Bleed").value;
  smoothness = document.getElementById("Smoothness").value;

  // Create a canvas
  var canvas = document.createElement('canvas');
  var context = canvas.getContext('2d', { willReadFrequently: true });

  // Calculate the dimensions for the canvas (double of original dimensions)
  var maxDimension = Math.max(originalImage.width, originalImage.height);
  canvas.width = maxDimension * 1.2;
  canvas.height = maxDimension * 1.2;

  // Apply bleed to it
  trimmedOriginal = addBleed(canvas, context, bleed, smoothness);

  // Display the edited image
  displayCanvas(canvas);

  // Trim empty space around canvas
  trimmed = trimCanvas(canvas);
  trimmedHeight = trimmed.height;
  trimmedWidth = trimmed.width;
  originalHeight = trimmedOriginal.height;
  originalWidth = trimmedOriginal.width;

  // Calculate width of the bleed added (in px)
  DPI = document.getElementById("typeNumber").value;
  bleedWidth = (trimmedHeight - trimmedOriginal.height) / 2;
  bleedWidth = bleedWidth * (2.54 / DPI); // width in cm (2.54cm per inch; 96 dots per inch)
  document.getElementById("bleedWidth").innerHTML = bleedWidth + " cm";

  // Display image print size
  document.getElementById('newImgHeight').innerHTML = trimmedHeight * (2.54 / DPI);
  document.getElementById('newImgWidth').innerHTML = trimmedWidth * (2.54 / DPI);

  document.getElementById('imgHeight').innerHTML = originalHeight * (2.54 / DPI);
  document.getElementById('imgWidth').innerHTML = originalWidth * (2.54 / DPI);
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