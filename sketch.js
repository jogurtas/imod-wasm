// browser-sync start --server -f -w

var img, originalImageData, canvas;

async function setup() {
  pixelDensity(1);
  canvas = createCanvas(10, 10);
  canvas.parent("canvas");
  input();
}

function draw() {
  noLoop();
}

function windowResized() {
  if (img) {
    var canvasDiv = document.getElementById("canvas");
    var ratio = Math.min(canvasDiv.offsetWidth / img.width, canvasDiv.offsetHeight / img.height);
    resizeCanvas(Math.ceil(img.width * ratio), Math.ceil(img.height * ratio));
    image(img, 0, 0, img.width * ratio, img.height * ratio);
  }
}

function loadLib() {
  return new Promise(resolve => {
    const imod = {
      version: Module.cwrap("version", "number", []),
      create_buffer: Module.cwrap("create_buffer", "number", ["number", "number"]),
      destroy_buffer: Module.cwrap("destroy_buffer", "", ["number"]),
      green: Module.cwrap("green", "", ["number", "number", "number", "number", "number"]),
      get_result_pointer: Module.cwrap("get_result_pointer", "number", []),
      get_result_size: Module.cwrap("get_result_size", "number", [])
    };
    resolve(imod);
  });
}

function copyPixelArray(data) {
  loadPixels();

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let index = (x + y * width) * 4;

      pixels[index] = data[index];
      pixels[index + 1] = data[index + 1];
      pixels[index + 2] = data[index + 2];
      pixels[index + 3] = 255;
    }
  }
  updatePixels();
}

async function useWasm(index) {
  // WASM
  windowResized();
  loadPixels();

  var imod = await loadLib();
  const p = imod.create_buffer(canvas.width, canvas.height);
  Module.HEAP8.set(pixels, p);
  var size = imod.green(p, canvas.width, canvas.height, 4, index);

  const resultPointer = imod.get_result_pointer();
  const resultSize = imod.get_result_size();
  const resultView = new Uint8Array(Module.HEAP8.buffer, resultPointer, resultSize);
  const result = new Uint8Array(resultView);

  copyPixelArray(result);
  updatePixels();
  imod.destroy_buffer(p);
}
