window.addEventListener("load", function () {
    console.log('product-detail JS working')

    let liItem = document.querySelectorAll('.ingredients-list li')
    let waitToComment = document.querySelector('.waitToComment')
    let submit = document.querySelector('.submit-form')
    let checkMark = document.querySelector('.checkMark')
    let liItemDirection = document.querySelectorAll('.directions-list li')
    let Overview = document.getElementById('Overview')
    let Steps = document.getElementById('Steps')
    let Comments = document.getElementById('Comments')
    let productNavbar = document.querySelector('.productNavbar')


    // console.log(productNavbar.children[0])

    productNavbar.children[0].addEventListener('click', function () {
        Overview.scrollIntoView({ behavior: "smooth", block: 'center' })
    })

    productNavbar.children[1].addEventListener('click', function () {
        Steps.scrollIntoView({ behavior: "smooth", block: 'center' })
    })

    productNavbar.children[2].addEventListener('click', function () {
        Comments.scrollIntoView({ behavior: "smooth", block: 'center' })
    })


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