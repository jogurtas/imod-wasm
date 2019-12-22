let inputLoad, btnReset, btnExport;
let fileName;
let sel;

function input() {
  sel = createSelect();
  sel.option("NONE");
  sel.option("FILTER 1");
  sel.option("FILTER 2");
  sel.option("FILTER 3");
  sel.option("FILTER 4");
  sel.option("FILTER 5");
  sel.option("FILTER 6");
  sel.id("sel");

  inputLoad = createFileInput(handleFile);
  inputLoad.id("file-upload");
  inputLoad.position(0, 0);

  // btnLoad = createButton("RESET");
  // btnLoad.parent("btns");
  // btnLoad.mousePressed(function() {
  //   windowResized();
  //   document.getElementById("sel").selectedIndex = 0;
  // });

  btnExport = createButton("SAVE");
  btnExport.parent("btns");
  btnExport.mousePressed(function() {
    saveCanvas(canvas, fileName);
    document.getElementById("sel").selectedIndex = 0;
  });

  sel.parent("btns");
  sel.changed(applyFilter);
}

async function handleFile(file) {
  // print(file);
  document.getElementById("sel").selectedIndex = 0;
  if (file.subtype === "jpeg" || file.subtype === "png") {
    img = createImg(file.data, "");
    originalImageData = JSON.parse(JSON.stringify(file.data));
    fileName = file.name;
    let promise = new Promise(resolve => {
      setTimeout(() => resolve("done!"), 1000);
    });
    let result = await promise;

    windowResized();
  } else {
    img = null;
  }
}

async function applyFilter() {
  let id = document.getElementById("sel").selectedIndex;

  if (img) {
    if (id == 0) windowResized();
    else await useWasm(id - 1);
  }
}
