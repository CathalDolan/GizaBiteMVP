window.onload = function() {
    console.log('hi, it works!');
  }

var ingredient_group_id_counter = 1;
var ingredient_id_counter = 1;
var cooking_method_id_counter = 1;

function add_ingredient(){
    console.log("Function Fires")
    ingredient_id_counter+=1
    console.log("Counter: ", ingredient_id_counter)
    html = `<div class="container" id="add_ingredient_row'+ingredient_id_counter+'">\
        <div class="row mx-2">\
            <div class="col-md-6 mt-2 col-12">\
                <input type="text" class="form-control" name="dish_name" placeholder="Ingredient Name" aria-label="IngredientName"></input>\
            </div>\
            <div class="col-md-2 mt-2 col-5">\
                <input type="number" class="form-control" name="number_of_portions" id="number_of_portions" placeholder="Batch" aria-label="BatchAmount"></input>\
            </div>\
            <div class="col-md-2 mt-2 col-5">\
                <input type="number" class="form-control" name="dish_name" placeholder="Portion" aria-label="PortionAmount"></input>\
            </div>\
            <div class="col-md-2 mt-2 col-2 ps-0 ps-md-2">\
                <select class="form-select pe-0" name="unit_select">\
                    <option value="g">g</option>\
                    <option value="kg">kg</option>\
                    <option value="pcs">Pcs</option>\
                </select>\
            </div>\
        </div>\
    </div>`

    const cooking_insert = document.getElementById('new_cooking_method_container')
    if (cooking_insert){
        add_ingredient_group()
    } else {
        console.log("cooking method row No")
        const form1 = document.getElementById('add_ingredient_container')
        form1.innerHTML+= html
    }
}

function add_cooking_method(){
    console.log("Function 2 Fires")
    html = `<div class="row mx-2" id="add_cooking_method_row">\
        <div class="col-md-6 mt-2 col-12">\
            <select class="form-select" name="cooking_method">\
                <option value="" disabled selected>Cooking Method</option>\
                <option value="Boiled">Boiled</option>\
                <option value="Deep Fried">Deep Fried</option>\
                <option value="Baked">Baked</option>\
            </select>\
        </div>\
        <div class="col-md-6 mt-2 col-12">\
            <select class="form-select" name="substrate">\
                <option value="" disabled selected>Substrate</option>\
                <option value="Vegetable Oil">Vegetable Oil</option>\
                <option value="Stock">Stock</option>\
                <option value="Butter">Butter</option>\
            </select>\
        </div>\
    </div>\
    <hr class="max_width_500">\
    <div id="new_add_ingredient_container"></div>\
    <div id="new_cooking_method_container"></div>`
    // The 2 divs above need to go elsewhere.
    
    const cooking_insert = document.getElementById('new_cooking_method_container')
    if (cooking_insert){
        const form = document.getElementById('new_cooking_method_container')
        form.innerHTML+= html
    } else {
        const form1 = document.getElementById('add_cooking_method_row_1')
        form1.innerHTML+= html
    }
}

function add_ingredient_group(){
    console.log("add_ingredient_group Function Fires")
    ingredient_id_counter+=1
    console.log("Counter: ", ingredient_id_counter)
    html = '<div class="container" id="add_ingredient_container">\
        <!-- Ingredient Details -->\
        <div class="row mx-2" id="add_ingredient_row_1">\
            <div class="col-md-6 mt-3 col-12">\
                <input type="text" class="form-control" name="dish_name" placeholder="Ingredient Name" aria-label="IngredientName"></input>\
            </div>\
            <div class="col-md-2 mt-2 mt-md-3 col-5">\
                <input type="number" class="form-control" name="number_of_portions" id="number_of_portions" placeholder="Batch" aria-label="BatchAmount"></input>\
            </div>\
            <div class="col-md-2 mt-2 mt-md-3 col-5">\
                <input type="number" class="form-control" name="dish_name" placeholder="Portion" aria-label="PortionAmount"></input>\
            </div>\
            <div class="col-md-2 mt-2 mt-md-3 col-2 ps-0 ps-md-2">\
                <select class="form-select pe-0" name="unit_select">\
                    <option value="g">g</option>\
                    <option value="kg">kg</option>\
                    <option value="pcs">Pcs</option>\
                </select>\
            </div>\
        </div>\
    </div>\
    <!-- Cooking Method -->\
    <div class="container" id="add_cooking_method_row_1"></div>\
    <div id="post_cooking_method_hr"></div>\
    </div>'

    const form = document.getElementById('ingredient_group_2')
    form.innerHTML+= html

}