$(document).ready(function(){
    
    console.log('hi, it works!');
    var PRODUCTS = {};
    $(document).on('keyup', '.ingredient_name', function() {
        console.log(`KEYPRESSED`)
        var q = $(this).val();
        console.log(`q=${q}`);
        var field = $(this);
        $(this).next().empty()
        fetch(`https://8000-cathaldolan-gizabitemvp-2fe79spgt3d.ws-eu92.gitpod.io/get_products/${q}`)
        .then(response => response.json())
        .then(data => {
            console.log("Fetch fn fires");
            PRODUCTS = data.products;
            console.log("PRODUCTS : ", PRODUCTS);
            $.each(PRODUCTS, function(index, item) {
                const allergens = []
                for(const [k, v] of Object.entries(item.Allergens)) {
                    // console.log(`allergen = ${v.index}`)
                    allergens.push(v.index)
                }
                $(field).next().append(`<li class="suggestion" data-product='${JSON.stringify(item)}'>${item['product_name']} ${allergens.length != 0 ? ' - [' + allergens + ']': ''}</li>`)
            })      
        });
    })

    $(document).on('click', '.suggestion', function() {
        $(this).parent().prev().val($(this).text()).data('product', $(this).data('product'));
        $('.suggestions-list').empty();
        gatherNutrientInfo();
    })

    $(document).on("change", "input:not('.ingredient_name'), select", function() {
        gatherNutrientInfo()
    })

    function gatherNutrientInfo() {
        var number_of_portions = $('#number_of_portions').val()
        var EnergyKcals = 0;
        const allergen_list = []
        const ingredient_groups = $('.ingredient_group');
        console.log("ingredient_groups = ", ingredient_groups);
        ingredient_groups.each(function(index, item) {
            var cooking_method = $(item).find("[name='cooking_method']").val();
            var substrate = $(item).find("[name='substrate']").val();
            var ingredients = $(item).find('.ingredient_row');
            console.log("ingredients = ", ingredients);
            ingredients.each((index, element) => {
                var product = $(element).find(".ingredient_name").data('product');
                console.log("product = ", product);
                if(product != undefined) {
                    var amount = Number($(element).find("[name='batch_amount']").val());
                    var units = $(element).find("[name='unit_select']").val();
                    EnergyKcals += (product.EnergyKcal/100*amount);
                    var product_allergens = product.Allergens
                    // console.log("product_allergens = ", typeof(product_allergens));
                    product_allergens.forEach(function(el) {
                        console.log("el = ", el.index)
                        if(!allergen_list.includes(el.index)) {
                            allergen_list.push(el.index)
                        }
                    })
                    console.log("allergen_list = ", allergen_list);
                    allergen_list.sort(function(a, b){return a-b});
                    $('#total_allergens').text(allergen_list);
                    $('#total_calories').text(Math.round(EnergyKcals/number_of_portions));
                }
                
            })
        })
    }
});

$(document).ready(function() {

    // Add a New Ingredient Row Function
    $(document).on("click", ".add_ingredient_button", function(){
        console.log("Add Ingredient Function Fires");

        const html = `<hr class="third-hr mx-auto mb-0 mt-2 p-0">
                    <div class="row mx-2 ingredient_row">
                        <div class="col-md-2 mt-2 col-5">
                            <input type="number" class="form-control" name="batch_amount" id="batch_amount" placeholder="Batch Amount" aria-label="BatchAmount"></input>
                        </div>
                        <div class="col-md-2 mt-2 col-5 ps-0">
                            <input type="number" class="form-control" name="dish_name" placeholder="Portion Amount" aria-label="PortionAmount"></input>
                        </div>
                        <div class="col-md-2 mt-2 col-2 ps-0">
                            <select class="form-select custom-select-icon pe-0" name="unit_select">
                                <option value="g">g</option>
                                <option value="kg">kg</option>
                                <option value="pcs">Pcs</option>
                            </select>
                        </div>
                        <div class="col-md-5 mt-2 col-11">
                            <input type="text" class="form-control ingredient_name" name="dish_name" placeholder="Ingredient Name" aria-label="IngredientName"></input>
                            <ul class="suggestions-list"></ul>
                        </div>
                        <div class="mt-2 col-1 px-0 delete_ingredient_icon_div">
                            <div class="delete_ingredient" name="delete_ingredient" aria-label="delete_ingredient">
                                <i class="fa-solid fa-trash-can"></i>
                            </div>
                        </div>
                    </div>`
        $(this).parents(".ingredient_group").children("div.ingredient_container").append(html);
    });

    // Add a New Ingredient Group Function
    var ingredient_group_id_counter = 1;
    $(".add_ingredient_group_button").click(function(){
        console.log("add_ingredient_group Function Fires")
        
        ingredient_group_id_counter+=1
        localStorage.setItem("clickcount", ingredient_group_id_counter);
        let clickcount = localStorage.getItem("clickcount");
        console.log("Click Count: ", clickcount);
        
        html = `<div class="ingredient_group" id="ingredient_group_${clickcount}">
                    <!-- Ingredient Details -->
                    <div class="container ingredient_container">
                        <div class="row mx-2 ingredient_row">
                            <div class="col-md-2 mt-3 col-5">
                                <input type="number" class="form-control" name="batch_amount" id="batch_amount" placeholder="Batch Amount" aria-label="BatchAmount"></input>
                            </div>
                            <div class="col-md-2 mt-3 col-5 ps-0">
                                <input type="number" class="form-control" name="dish_name" placeholder="Portion Amount" aria-label="PortionAmount"></input>
                            </div>
                            <div class="col-md-2 mt-3 col-2 ps-0">
                                <select class="form-select custom-select-icon pe-0" name="unit_select">
                                    <option value="g">g</option>
                                    <option value="kg">kg</option>
                                    <option value="pcs">Pcs</option>
                                </select>
                            </div>
                            <div class="col-md-5 mt-2 mt-md-3 col-11">
                                <input type="text" class="form-control ingredient_name" name="dish_name" placeholder="Ingredient Name" aria-label="IngredientName"></input>
                                <ul class="suggestions-list"></ul>
                            </div>
                            <div class="mt-2 mt-md-3 col-1 px-0 delete_ingredient_icon_div">
                                <div class="delete_ingredient" name="delete_ingredient" aria-label="delete_ingredient">
                                    <i class="fa-solid fa-trash-can"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- Cooking Method -->
                    <hr class="half-hr mx-auto">
                    <div class="container" id="add_cooking_method_container_1">
                        <div class="row mx-2" id="add_cooking_method_row_1">
                            <div class="col-md-6 mt-3 mt-md-2 col-12">
                                <select class="form-select" name="cooking_method">
                                    <option value="" disabled selected>Cooking Method</option>
                                    <option value="Boiled">Boiled</option>
                                    <option value="Deep Fried">Deep Fried</option>
                                    <option value="Baked">Baked</option>
                                </select>
                            </div>
                            <div class="col-md-6 mt-2 col-12">
                                <select class="form-select" name="substrate">
                                    <option value="" disabled selected>Substrate</option>
                                    <option value="Vegetable Oil">Vegetable Oil</option>
                                    <option value="Stock">Stock</option>
                                    <option value="Butter">Butter</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <!-- Add Ingredient and Remove Ingredient Group Buttons-->
                    <div class="row">
                        <!-- Add Ingredients & Cooking Section -->
                        <div class="container mt-3 element-container mx-auto col-6 col-css pe-2 text-end">
                            <button class="add_ingredient_button" type="button">Add Ingredient</button>
                        </div>
                        <!-- Remove Ingredient Group -->
                        <div class="container mt-3 element-container mx-auto col-6 col-css ps-2 text-start">
                            <button class="remove_ingredient_group_button" type="button">Delete Group</button>
                        </div>
                    </div>
                    <hr class="max_width_500 mb-0">
                </div>`

        $("#ingredient_group_container").append(html);
    })

    // Remove an Ingredient Row Function.
    $(document).on("click", ".delete_ingredient", function(){
    // $(".ingredient_row").on("click", ".delete_ingredient", function() {
        console.log("Delete_ingredient_row Function Fires");
        $(this).parents(".ingredient_row").remove();
    });

    // Remove an Ingredient Group Function
    $(document).on("click", ".remove_ingredient_group_button", function(){
        console.log("Remove_ingredient_group Function Fires");
        $(this).parents(".ingredient_group").remove();
    });
});
