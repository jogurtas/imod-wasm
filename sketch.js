// browser-sync start --server -f -w

let img;

function preload() {
  let path = "img/img_road.jpg";
  img = loadImage(path);
}

async function setup() {
  const canvas = createCanvas(img.width, img.height);
  pixelDensity(1);
  canvas.parent("canvas");
  textFont("Roboto");

  image(img, 0, 0);
  loadPixels();
  //console.log(pixels);

  // WASM
  var imod = await loadLib();
  const p = imod.create_buffer(canvas.width, canvas.height);
  Module.HEAP8.set(pixels, p);
  var w = imod.green(p, canvas.width, canvas.height, 4);

  const resultPointer = imod.get_result_pointer();
  const resultSize = imod.get_result_size();
  const resultView = new Uint8Array(Module.HEAP8.buffer, resultPointer, resultSize);
  const result = new Uint8Array(resultView);
  
  console.log(pixels);

  copyPixelArray(result); 
  
  //console.log("Width: " + w);
  //console.log("Ptr: " + p);
  //imod.destroy_buffer(p);

  console.log(pixels);
  //console.log(imod.version());

  updatePixels();
}

function draw() {
  //image(img, 0, 0);
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

function loadLib() {
  return new Promise(resolve => {
    const imod = {
      version: Module.cwrap("version", "number", []),
      create_buffer: Module.cwrap("create_buffer", "number", ["number", "number"]),
      destroy_buffer: Module.cwrap("destroy_buffer", "", ["number"]),
      green: Module.cwrap("green", "", ["number", "number", "number", "number"]),
      get_result_pointer: Module.cwrap("get_result_pointer", "number", []),
      get_result_size: Module.cwrap("get_result_size", "number", [])
    };
    resolve(imod);
  });
}
