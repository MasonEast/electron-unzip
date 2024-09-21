const dropZone = document.getElementById("drop-zone");

console.log(123);
dropZone.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropZone.style.borderColor = "#333";
});

dropZone.addEventListener("dragleave", () => {
  dropZone.style.borderColor = "#ccc";
});

dropZone.addEventListener("drop", (e) => {
  e.preventDefault();
  dropZone.style.borderColor = "#ccc";

  const files = e.dataTransfer.files;
  if (files.length > 0) {
    const filePath = files[0].path;
    console.log("File path:", filePath); // 调试输出文件路径
    window.electron.sendFilePath(filePath);
  }
});
