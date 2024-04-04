function clickHandler(zone) {
  document.getElementById(`fileInput`).zone = zone;
  document.getElementById(`fileInput`).click();
}

function handleFileSelect(event) {
  const file = event.target.files[0];
  const zone = event.target.zone;
  handleFile(file, zone);
}

function handleFile(file, zone) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function (event) {
    const text = event.target.result;
    document.getElementById(`drop-zone${zone}`).innerText = file.name;
    localStorage.setItem(`file${zone}`, text);
  };
  reader.readAsText(file);
}

function dragOverHandler(event) {
  event.preventDefault();
}

function dropHandler(event, zone) {
  event.preventDefault();
  const file = event.dataTransfer.files[0];
  handleFile(file, zone);
}

function compareFiles() {
  const file1 = localStorage.getItem("file1");
  const file2 = localStorage.getItem("file2");
  if (!file1 || !file2) {
    alert("Please upload two files first!");
    return;
  }

  const outputDiv = document.getElementById("output");
  outputDiv.innerHTML = "";

  const lines1 = file1.split("\n");
  const lines2 = file2.split("\n");

  if (file1 === file2) {
    const successMsg = document.createElement("div");
    successMsg.classList.add("similar");
    successMsg.textContent = "Files are similar";
    outputDiv.appendChild(successMsg);
    return;
  }

  for (let i = 0; i < Math.max(lines1.length, lines2.length); i++) {
    if (lines1[i] !== lines2[i]) {
      const diffLine = document.createElement("div");
      diffLine.classList.add("output-line");
      diffLine.innerHTML = `File 1: ${highlightDifferences(
        lines1[i],
        lines2[i]
      )} | File 2: ${highlightDifferences(lines2[i], lines1[i])}`;
      outputDiv.appendChild(diffLine);
    }
  }
}

function highlightDifferences(line1, line2) {
  let diffIndex = -1;
  for (let i = 0; i < Math.min(line1.length, line2.length); i++) {
    if (line1[i] !== line2[i]) {
      diffIndex = i;
      break;
    }
  }
  if (diffIndex === -1) return line1;
  const diffPart = line1.substring(diffIndex, diffIndex + line2.length - 1);
  return line1.replace(diffPart, `<span class="diff-text">${diffPart}</span>`);
}
