window.onload = function() {
    console.log('hi, it works!');
  }

$("button").click(function() {
    console.log("Button Clicked")
    console.log(this.id)
    alert(this.id); // or alert($(this).attr('id'));
});

var ingredient_id_counter = 1;
var cooking_method_id_counter = 0;
var ingredient_group_id_counter = 1;

function add_ingredient(obj){
    console.log("Add Ingredient Function Fires")
    ingredient_id_counter+=1
    console.log("Add Ingredient Counter: ", ingredient_id_counter)
    html = '<div class="container" id="add_ingredient_row'+ingredient_id_counter+'">\
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
    </div>'

    alert(obj.id);

    const form = document.getElementById('add_ingredient_container_1')
    form.innerHTML+= html
}

function add_ingredient_group(){
    console.log("add_ingredient_group Function Fires")
    ingredient_group_id_counter+=1
    cooking_method_id_counter+=1
    console.log("Counter: ", ingredient_group_id_counter)
    html = '<div id="ingredient_group_'+ingredient_group_id_counter+'">\
                <div class="container" id="add_ingredient_container_'+ingredient_group_id_counter+'">\
                    <!-- Ingredient Details -->\
                    <div class="row mx-2" id="add_ingredient_row_'+ingredient_group_id_counter+'">\
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
                <div class="container" id="add_cooking_method_container_'+ingredient_group_id_counter+'">\
                    <div class="row mx-2" id="add_cooking_method_row_'+ingredient_group_id_counter+'">\
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
                </div>\
                <!-- Add Ingredients & Cooking Section -->\
                <div class="container element-container mx-auto">\
                    <div class="row mt-3 mb-2 mx-2">\
                        <div class="col-2 col-md-1 col-css">\
                        <button id="add_ingredient_button_'+ingredient_group_id_counter+'" type="button" onclick="add_ingredient()">Add Ingredient</button>\
                        </div>\
                    </div>\
                </div>\
                <hr class="max_width_500">\
            </div>'

    const form = document.getElementById("ingredient_group_" + (ingredient_group_id_counter - 1)).insertAdjacentHTML('afterend', html);
    console.log("ingredient_group_" + (ingredient_group_id_counter - 1))
    // form.innerHTML+= html

}