window.addEventListener("load", function () {
    console.log('product-detail JS working')

    let liItem = document.querySelectorAll('.ingredients-list li')
    let waitToComment = document.querySelector('.waitToComment')
    let submit = document.querySelector('.submit-form')
    let checkMark = document.querySelector('.checkMark')
    let liItemDirection = document.querySelectorAll('.directions-list li')
    // let strikethrough = document.queryCommandValue('.strikethrough')

    liItem.forEach((li) => {
        li.onclick = (li) => {
            (li.target).classList.toggle('strikethrough')
        }
    })

    liItemDirection.forEach((li) => {
        li.onclick = (li) => {
            (li.target).classList.toggle('strikethrough')
        }
    })


    // submit.addEventListener('click', () => {
    //     document.getElementsByClassName("waitToComment").scrollIntoView()

    // })



})