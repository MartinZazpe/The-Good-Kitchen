window.addEventListener("load", function () {

    var hamburguerMenu = document.querySelector(".hambMenu")
    var navBarList = document.querySelectorAll(".list")
    var navbar = document.querySelector(".navbar")

    hamburguerMenu.addEventListener("click", function () {
        navBarList.forEach(function (list) {
            list.classList.toggle("listDisplay")
            navbar.classList.toggle('navbarFixed')
        })
    })
})