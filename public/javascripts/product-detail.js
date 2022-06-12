window.addEventListener("load", function () {
    console.log('product-detail JS working')

    let liItem = document.querySelectorAll('.ingredients-list li')

    liItem.forEach((li) => {
        li.onclick = (li) => {
            (li.target).classList.toggle('strikethrough')
        }
    })





})