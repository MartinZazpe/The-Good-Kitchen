window.addEventListener('load', function () {




    var userImageInput = document.querySelector('.user-image-input')
    var userImageLabel = document.querySelector('.user-image-label')
    var imageUploadContainer = document.querySelector('.image-upload-container')
    var productPreview = document.querySelector('.product-preview')



    imageUploadContainer.addEventListener("click", function () {
        userImageInput.click()
    })

    userImageInput.onchange = evt => {
        const [file] = userImageInput.files
        if (file) {
            productPreview.src = URL.createObjectURL(file)
            console.log(file.size + " this is the file size in bytes")
        }
    }












})