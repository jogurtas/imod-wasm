var images = [];

function resizeMainImage() {
  if (img) {
    var canvasDiv = document.getElementById("canvas");
    var ratio = Math.min(canvasDiv.offsetWidth / img.width, canvasDiv.offsetHeight / img.height);
    resizeCanvas(Math.ceil(img.width * ratio), Math.ceil(img.height * ratio));
    image(img, 0, 0, img.width * ratio, img.height * ratio);
    console.log(img.width);
  }
}

function resizeIconImages() {
  removeImages();
  for (let index = 0; index < 6; index++) {
    var iconsContainer = document.getElementById("icons-bar");
    var i = createImg("img/img.jpg", "image");
    var side = iconsContainer.offsetHeight.toString() + "px";
    i.style("width", side);
    i.style("height", side);
    i.parent("icons-bar");
    i.id("img" + index);

    i.mousePressed(function() {
      console.log("img: " + index);
    });

    images[index] = i;
  }
}
