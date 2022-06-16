window.addEventListener("load", function () {
    console.log('product-detail JS working')

    let liItem = document.querySelectorAll('.ingredients-list li')
    let waitToComment = document.querySelector('.waitToComment')
    let submit = document.querySelector('.submit-form')

    liItem.forEach((li) => {
        li.onclick = (li) => {
            (li.target).classList.toggle('strikethrough')
        }
    })

    submit.addEventListener('click', () => {
        document.getElementsByClassName("waitToComment").scrollIntoView()

    })



})