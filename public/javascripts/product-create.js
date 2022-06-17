window.addEventListener("load", function () {

    console.log('product create JS working')


    // var add_more_fields = document.getElementById("add_more_fields")
    // var remove_fields = document.getElementById("remove_fields")
    // var form_container = document.getElementById('form-container')

    // add_more_fields.onclick = function () {
    //     var newField = document.createElement('input')
    //     newField.setAttribute('type', 'text')
    //     newField.setAttribute('name', 'directions[]')
    //     newField.setAttribute('placeholder', 'Another Field')
    //     form_container.appendChild(newField)
    // }


    // remove_fields.onclick = function () {
    //     var input_tags = form_container.getElementsByTagName('input')
    //     if (input_tags.length > 5) {
    //         form_container.removeChild(input_tags[(input_tags.length) - 1])
    //     }

    // }



    var add_more_fields = document.getElementById("add_more_fields")
    var remove_fields = document.getElementById("remove_fields")
    var directions_container = document.getElementById('product-directions')
    var instruction_list = document.getElementById('instruction-list')
    var imageInput = document.querySelector('.imageInput')
    var imagePreview = document.querySelector('.product-preview')


    imageInput.onchange = evt => {
        const [file] = imageInput.files
        if (file) {
            imagePreview.src = URL.createObjectURL(file)
            console.log(file.size + " this is the file size in bytes")
        }
    }

    //         submitFormBtn.classList.remove("noDisplay")
    //         clearFormBtn.classList.remove("noDisplay")
    //     } else {
    //         submitFormBtn.classList.add("noDisplay")
    //         clearFormBtn.classList.add("noDisplay")
    //     }
    // }




    add_more_fields.onclick = function () {
        var node = document.createElement("li")
        var newField = document.createElement('input')
        newField.setAttribute('type', 'text')
        newField.setAttribute('name', 'directions[]')
        newField.setAttribute('placeholder', 'Add Instruction')
        node.appendChild(newField)

        instruction_list.appendChild(node)
    }

    remove_fields.onclick = function () {
        var input_tags = instruction_list.getElementsByTagName('li')
        if (input_tags.length > 1) {
            instruction_list.removeChild(input_tags[(input_tags.length) - 1])
        }
    }



    var add_more_fields_ingredients = document.getElementById("add_more_fields_ingredients")
    var remove_fields_ingredients = document.getElementById("remove_fields_ingredients")
    var ingredient_list = document.getElementById('ingredient-list')




    add_more_fields_ingredients.onclick = function () {
        var node = document.createElement("li")
        var newField = document.createElement('input')
        newField.setAttribute('type', 'text')
        newField.setAttribute('name', 'Ingredients[]')
        newField.setAttribute('placeholder', 'Add Ingredient')
        node.appendChild(newField)
        ingredient_list.appendChild(node)
    }

    remove_fields_ingredients.onclick = function () {
        var input_tags = ingredient_list.getElementsByTagName('li')
        if (input_tags.length > 1) {
            ingredient_list.removeChild(input_tags[(input_tags.length) - 1])
        }
    }



})