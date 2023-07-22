// function from https://stackoverflow.com/a/15832662/512042
function download(dataurl: string, filename: string) {
  const link = document.createElement("a");
  link.href = dataurl;
  link.download = filename;
  link.click();
}

export default download;
