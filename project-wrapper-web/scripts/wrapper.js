const CONSTANTS = {
    apiUrl: "@@ProjectWrapperApi"
}

document.getElementById("colour-sort-upload").addEventListener("change", (e) => {
    upload(e.target, CONSTANTS.apiUrl);
    handleFileSelect(e);
})

// const axios = require('axios');

function upload(target, endpoint) {
    const dataset = target.dataset;
    const dataName = dataset.name;

    const file = target.files[0];

    let formData = new FormData();
    formData.append(dataName, file);

    axios
        .post(endpoint, formData)
        .then((resp) => {
            console.log(resp);
        });


    // fetch(endpoint, {method: "POST", body: formData});
}

function handleFileSelect(evt) {
    var files = evt.target.files;
    var f = files[0];
    var reader = new FileReader();
     
    reader.onload = (function(theFile) {
          return function(e) {
            const output = document.getElementById('colour-src');
            const img = output.getElementsByTagName('img')[0];
            img.src = e.target.result;
            img.title = theFile.name;
            output.classList.add("display");
          };
    })(f);
     
    reader.readAsDataURL(f);
}
