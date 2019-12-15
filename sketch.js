// browser-sync start --server -f -w

let img;

function preload() {
  let path = "img/img_road.jpg";
  img = loadImage(path);
}

async function setup() {
  const canvas = createCanvas(img.width, img.height);
  canvas.parent("canvas");
  textFont("Roboto");

  image(img, 0, 0);
  loadPixels();
  console.log(pixels);

  // WASM
  var imod = await loadLib();
  const p = api.create_buffer(canvas.width, canvas.height);
  Module.HEAP8.set(pixels, p);
  // ... call encoder ...
  api.destroy_buffer(p);

  console.log(imod.version());

  updatePixels();
}

function draw() {
  //image(img, 0, 0);
}

function loadImageData(fx, sliderValue) {
  loadPixels();

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let index = (x + y * width) * 4;

      pixels[index] = colors[0];
      pixels[index + 1] = colors[1];
      pixels[index + 2] = colors[2];
      pixels[index + 3] = 255;
    }
  }

  updatePixels();
}

function loadLib() {
  return new Promise(resolve => {
    const imod = {
      version: Module.cwrap("version", "number", []),
      create_buffer: Module.cwrap("create_buffer", "number", ["number", "number"]),
      destroy_buffer: Module.cwrap("destroy_buffer", "", ["number"]),
      green: Module.cwrap("green", "number", []),
      fileString: Module.cwrap("fileString", "string", [])
    };
    resolve(imod);
  });
}
