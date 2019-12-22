let inputLoad, btnReset, btnExport;
let fileName;

function buttons() {
  inputLoad = createFileInput(handleFile);
  inputLoad.id("file-upload");
  inputLoad.position(0, 0);

  btnLoad = createButton("RESET");
  btnLoad.parent("btns");
  btnLoad.mousePressed(function() {
    img = createImg(originalImageData, "");
  });

  btnExport = createButton("EXPORT");
  btnExport.parent("btns");
  btnExport.mousePressed(async function() {
    //saveCanvas(canvas, fileName);
    await useWasm();
  });
}

async function handleFile(file) {
  print(file);
  if (file.subtype === "jpeg" || file.subtype === "png") {
    img = createImg(file.data, "");
    originalImageData = JSON.parse(JSON.stringify(file.data));
    fileName = file.name;
    let promise = new Promise(resolve => {
      setTimeout(() => resolve("done!"), 1000);
    });
    let result = await promise;

    removeImages();
    windowResized();
  } else {
    img = null;
  }
}

function removeImages() {
  images.forEach(i => {
    i.remove();
  });
}
