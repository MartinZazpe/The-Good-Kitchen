window.addEventListener("load", function () {




    var add_more_fields = document.getElementById("add_more_fields")
    var remove_fields = document.getElementById("remove_fields")
    var add_more_fields_ingredients = document.getElementById("add_more_fields_ingredients")
    var remove_fields_ingredients = document.getElementById("remove_fields_ingredients")
    var ingredient_list = document.getElementById('ingredient-list')
    var instruction_list = document.getElementById('instruction-list')
    var imageInput = document.querySelector('.imageInput')
    var imagePreview = document.querySelector('.product-preview')
    var buttonSubmit = document.querySelector('#button-for-submit')




    imageInput.onchange = evt => {
        const [file] = imageInput.files
        if (file) {
            imagePreview.src = URL.createObjectURL(file)
            // console.log(file.size + " this is the file size in bytes")
        }
    }





    add_more_fields.onclick = function (e) {
        e.preventDefault()
        var node = document.createElement("li")
        var newField = document.createElement('input')
        newField.setAttribute('type', 'text')
        newField.setAttribute('name', 'directions[]')
        newField.setAttribute('placeholder', 'Add Instruction')
        node.appendChild(newField)
        instruction_list.appendChild(node)

    }


    /* to scroll to last added LI, not using currently */
    // var items = document.querySelector('#instruction-list')
    // var last = items[items.length - 1]
    // last.scrollIntoView({ behavior: "smooth", block: "center" })




    remove_fields.onclick = function (e) {
        e.preventDefault()
        var input_tags = instruction_list.getElementsByTagName('li')
        if (input_tags.length > 1) {
            instruction_list.removeChild(input_tags[(input_tags.length) - 1])
        }
    }



    add_more_fields_ingredients.onclick = function (e) {
        e.preventDefault()
        var node = document.createElement("li")
        var newField = document.createElement('input')
        newField.setAttribute('type', 'text')
        newField.setAttribute('name', 'Ingredients[]')
        newField.setAttribute('placeholder', 'Add Ingredient')
        node.appendChild(newField)
        ingredient_list.appendChild(node)
    }




    remove_fields_ingredients.onclick = function (e) {
        e.preventDefault()
        var input_tags = ingredient_list.getElementsByTagName('li')
        if (input_tags.length > 1) {
            ingredient_list.removeChild(input_tags[(input_tags.length) - 1])
        }
    }


})