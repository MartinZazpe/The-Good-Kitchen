window.addEventListener("load", function () {
    console.log("header js working")

    var hamburguerMenu = document.querySelector(".hambMenu")
    var navBarList = document.querySelectorAll(".list")
    var navbarId = document.querySelector("#navbar")
    var flexboxInitial = document.querySelector(".flexboxInitial")
    var flexboxExpanded = document.querySelector(".flexboxExpanded")
    var navBarScreen = document.querySelector(".navBarScreen")
    var menu = document.querySelector(".menu")
    var logo = document.querySelector("#logo")
    var loginRegister = document.querySelector(".login-register")
    var noDisplay = document.querySelector(".noDisplay")
    var xMenu = document.querySelector(".xMenu")

    var order1 = document.querySelector(".order1")
    var order2 = document.querySelector(".order2")
    var order3 = document.querySelector(".order3")

    hamburguerMenu.addEventListener("click", function () {
        navBarList.forEach(function (list) {
            list.classList.toggle("listDisplay")
            // navbar.classList.toggle('navbarFixed')
            navbarId.classList.toggle('navBarScreen')
            if (navbarId.classList.contains('navBarScreen')) {
                hamburguerMenu.classList.add('noDisplay')
                xMenu.classList.remove('noDisplay')
                navbarId.classList.remove('flexboxInitial')
                navbarId.classList.add('flexboxExpanded')
                menu.classList.add('order2')
                logo.classList.add('order1')
                loginRegister.classList.add('noDisplay')
            } else {
                hamburguerMenu.classList.remove('noDisplay')
                xMenu.classList.add('noDisplay')
                navbarId.classList.add('flexboxInitial')
                navbarId.classList.remove('flexboxExpanded')
                menu.classList.remove('order3')
                logo.classList.remove('order1')
                loginRegister.classList.remove('noDisplay')
            }
        })
    })
    xMenu.addEventListener("click", function () {
        navBarList.forEach(function (list) {
            list.classList.toggle("listDisplay")
            // navbar.classList.toggle('navbarFixed')
            navbarId.classList.toggle('navBarScreen')
            if (navbarId.classList.contains('navBarScreen')) {
                hamburguerMenu.classList.add('noDisplay')
                xMenu.classList.remove('noDisplay')
                navbarId.classList.remove('flexboxInitial')
                navbarId.classList.add('flexboxExpanded')
                menu.classList.add('order2')
                logo.classList.add('order1')
                loginRegister.classList.add('noDisplay')
            } else {
                hamburguerMenu.classList.remove('noDisplay')
                xMenu.classList.add('noDisplay')
                navbarId.classList.add('flexboxInitial')
                navbarId.classList.remove('flexboxExpanded')
                menu.classList.remove('order3')
                logo.classList.remove('order1')
                loginRegister.classList.remove('noDisplay')
            }
        })
    })


})


