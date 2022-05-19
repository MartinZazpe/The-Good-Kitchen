window.addEventListener("load", function () {
    console.log("header js working")

    var hamburguerMenu = document.querySelector(".hambMenu")
    var navBarList = document.querySelectorAll(".list")

    hamburguerMenu.addEventListener("click", function () {

        navBarList.forEach(list => list.classList.toggle("listDisplay"))
    })

})