//Import form valdiation
import validateForm from './formValidation.js';
 
//img preview container
 const imgPreview = document.querySelector("#image-preview");
//input from the img
const imgInput = document.querySelector("#sender-image");

//event listener to update image preview when file uploads
imgInput.addEventListener("change", (event) => {
if (imgInput.files && imgInput.files[0]) {
        var reader = new FileReader();
        reader.onload = function(e) {
            imgPreview.src = e.target.result;
        }
        reader.readAsDataURL(imgInput.files[0]);
    }
});

// REWORK
// event listener to add hypends and not make user do it
document.querySelector("#card-number").addEventListener("input", function (e) {
    const nonDigits = new RegExp("\\D", "g"); 
    const addHyphens = new RegExp("(\\d{4})", "g"); 
    const trailingHyphen = new RegExp("-$", "g"); 

    e.target.value = e.target.value
        .replace(nonDigits, "")    
        .replace(addHyphens, "$1-")
        .replace(trailingHyphen, "");

    if (e.target.value.length > 19) {
        e.target.value = e.target.value.slice(0, 19);
    }
});



//Add event listener to validate form on submit 
const form = document.querySelector('form');
form.addEventListener('submit', validateForm);
 