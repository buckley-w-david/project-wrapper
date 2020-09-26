"use strict";

var CONSTANTS = {
  apiUrl: "http://localhost:2019/api"
};
document.getElementById("colour-sort-upload").addEventListener("change", function (e) {
  upload(e.target, CONSTANTS.apiUrl);
  handleFileSelect(e);
}); // const axios = require('axios');

function upload(target, endpoint) {
  var dataset = target.dataset;
  var dataName = dataset.name;
  var file = target.files[0];
  var formData = new FormData();
  formData.append(dataName, file);
  axios.post(endpoint, formData).then(function (resp) {
    console.log(resp);
  }); // fetch(endpoint, {method: "POST", body: formData});
}

function handleFileSelect(evt) {
  var files = evt.target.files;
  var f = files[0];
  var reader = new FileReader();

  reader.onload = function (theFile) {
    return function (e) {
      var output = document.getElementById('colour-src');
      var img = output.getElementsByTagName('img')[0];
      img.src = e.target.result;
      img.title = theFile.name;
      output.classList.add("display");
    };
  }(f);

  reader.readAsDataURL(f);
}