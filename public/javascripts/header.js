window.addEventListener("load", function () {
    console.log("header js working")



    var navigationListDropdown = document.querySelector('.navigation-list-dropdown')
    var toggleButton = document.querySelector('.toggle-button')



    toggleButton.addEventListener("click", function () {
        navigationListDropdown.classList.toggle('noDisplay')
    })






    // $(window).on("orientationchange load resize", function () {
    //     var width = $(document).width()
    //     if (width > 850) {
    //         $(navigationList).show()
    //     }
    // })





})


