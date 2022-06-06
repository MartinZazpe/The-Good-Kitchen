window.addEventListener("load", function () {
    console.log('user-profile JS working')

    let userImage = document.querySelector(".user-image")
    let imageInputId = document.querySelector("#imageInput")
    let imageInput = document.querySelector(".image-input")
    let submitFormBtn = document.querySelector(".submitFormBtn")
    let noDisplay = document.querySelector(".noDisplay")
    let nameInput = document.querySelector(".username-input")
    let userEmail = document.querySelector(".user-email")

    userImage.addEventListener("click", function () {
        imageInput.click()
    })

    imageInput.onchange = evt => {
        const [file] = imageInput.files
        if (file) {
            userImage.src = URL.createObjectURL(file)
            console.log(file.size + " this is the file size in bytes")

            submitFormBtn.classList.remove("noDisplay")
        } else {
            submitFormBtn.classList.add("noDisplay")
        }
    }

    nameInput.onkeydown = evt => {
        submitFormBtn.classList.remove("noDisplay")
    }

    userEmail.onkeydown = evt => {
        submitFormBtn.classList.remove("noDisplay")
    }

})