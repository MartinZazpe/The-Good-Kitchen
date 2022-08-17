window.addEventListener("load", function () {
    console.log("header js working")



    var navigationListDropdown = document.querySelector('.navigation-list-dropdown')
    var searchIconContainer = document.querySelector('.search-icon-container')
    var searchButton = document.querySelector('.search-submit')
    var extraMargin = document.querySelector('.extraMargin')

    const hamburger = document.querySelector('.hamburger')

    hamburger.addEventListener('click', function () {
        hamburger.classList.toggle('active')
        if (hamburger.classList.contains('active')) {
            navigationListDropdown.classList.toggle('active')
            navigationListDropdown.classList.toggle('noDisplay')
            if (req.session.userLogged) {
                // console.log('user is logged')
            }
        } else {
            navigationListDropdown.classList.toggle('active')
            navigationListDropdown.classList.toggle('noDisplay')
        }
    })




    searchIconContainer.addEventListener('click', function () {
        searchButton.click()
    })














    // $(window).on("orientationchange load resize", function () {
    //     var width = $(document).width()
    //     if (width > 850) {
    //         $(navigationList).show()
    //     }
    // })





})


