// import { readFile } from '@mikeljames/draft-js-drag-n-drop-upload-plugin/utils/file';

// Read file contents intelligently as plain text/json, image as dataUrl or
// anything else as binary
function readFile(file) {
  return new Promise(resolve => {
    const reader = new FileReader();

    // This is called when finished reading
    reader.onload = event => {
      // Return an array with one image
      resolve({
        // These are attributes like size, name, type, ...
        lastModifiedDate: file.lastModifiedDate,
        lastModified: file.lastModified,
        name: file.name,
        size: file.size,
        type: file.type,

        // This is the files content as base64
        src: event.target.result
      });
    };

    if (file.type.indexOf('text/') === 0 || file.type === 'application/json') {
      reader.readAsText(file);
    } else if (file.type.indexOf('image/') === 0) {
      reader.readAsDataURL(file);
    } else {
      reader.readAsBinaryString(file);
    }
  });
}

export default function mockUpload(data, success, failed, progress) {
  function doProgress(percent) {
    progress(percent || 1);
    if (percent === 100) {
      // Start reading the file
      Promise.all(data.files.map(readFile)).then(files =>
        success(files, { retainSrc: true })
      );
    } else {
      setTimeout(doProgress, 250, (percent || 0) + 10);
    }
  }

  doProgress();
}
