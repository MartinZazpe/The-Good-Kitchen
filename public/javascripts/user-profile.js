window.addEventListener("load", function () {
    console.log('user-profile JS working')

    let userImage = document.querySelector(".user-image")
    let imageInputId = document.querySelector("#imageInput")
    let imageInput = document.querySelector(".image-input")
    let submitImageEdit = document.querySelector(".submitImageEdit")
    let noDisplay = document.querySelector(".noDisplay")
    let maxImageWidth = document.querySelector(".maxImageWidth")

    userImage.addEventListener("click", function () {
        imageInput.click()
    })

    imageInput.onchange = evt => {
        const [file] = imageInput.files
        if (file) {
            userImage.src = URL.createObjectURL(file)
            console.log(file.size + " this is the file size in bytes")

            submitImageEdit.classList.remove("noDisplay")
        } else {
            submitImageEdit.classList.add("noDisplay")
        }
    }



    // imageInput.onload = function () {
    //     var w = imageInput.width
    //     // var h = img.height
    //     console.log("NEW IMAGE width", w)
    // }


})