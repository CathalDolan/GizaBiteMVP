$(document).ready(function(){
    
    console.log('hi, it works!');
    var PRODUCTS = {};
    $(document).on('keyup', '.ingredient_name', function() {
        console.log(`KEYPRESSED`)
        var q = $(this).val();
        console.log(`q=${q}`);
        var field = $(this);
        $(this).next().empty()
        fetch(`https://8000-cathaldolan-gizabitemvp-d7bejlihi03.ws-eu84.gitpod.io/get_products/${q}`)
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
        // console.log(`product_id = ${$(this).data('product_id')}`)
        $(this).parent().prev().val($(this).text()).data('product', $(this).data('product'));
        $('.suggestions-list').empty();
        // var product = PRODUCTS.filter(obj => obj.team__name == $(this).text());
        // console.log(`product = ${product}`)
        gatherNutrientInfo();
    })

    $(document).on("change", "input:not('.ingredient_name'), select", function() {
        console.log("CHANGED")
        gatherNutrientInfo()
    })

    function gatherNutrientInfo() {
        var EnergyKcals = 0;
        const ingredient_groups = $('.ingredient_group');
        console.log("ingredient_groups = ", ingredient_groups);
        ingredient_groups.each(function(index, item) {
            var cooking_method = $(item).find("[name='cooking_method']").val();
            var substrate = $(item).find("[name='substrate']").val();
            var ingredients = $(item).find('.ingredient_row');
            console.log("ingredients = ", ingredients);
            ingredients.each((index, element) => {
                console.log("element = ", element)
                var product = $(element).find(".ingredient_name").data('product');
                console.log("product = ", product);
                if(product != undefined) {
                    var amount = Number($(element).find("[name='batch_amount']").val());
                    var units = $(element).find("[name='unit_select']").val();
                    console.log("ingredient_data['EnergyKcal'] = ", product.EnergyKcal);
                    EnergyKcals += (product.EnergyKcal/100*amount);
                    console.log("amount = ", amount);
                    // console.log("units = ", units);
                    $('#total_calories').text(EnergyKcals);
                }
                
            })
        })
    }
});

$(document).ready(function() {
    $(document).on("click", ".add_ingredient_button", function(){
        console.log("Add Ingredient Function Fires");

        const html = `<div class="row mx-2 ingredient_row">
                        <div class="col-md-6 mt-2 col-12">
                            <input type="text" class="form-control ingredient_name" name="dish_name" placeholder="Ingredient Name" aria-label="IngredientName"></input>
                            <ul class="suggestions-list"></ul>
                        </div>
                        <div class="col-md-2 mt-2 col-5">
                            <input type="number" class="form-control" name="batch_amount" id="batch_amount" placeholder="Batch" aria-label="BatchAmount"></input>
                        </div>
                        <div class="col-md-2 mt-2 col-5">
                            <input type="number" class="form-control" name="dish_name" placeholder="Portion" aria-label="PortionAmount"></input>
                        </div>
                        <div class="col-md-2 mt-2 col-2 ps-0 ps-md-2">
                            <select class="form-select pe-0" name="unit_select">
                                <option value="g">g</option>
                                <option value="kg">kg</option>
                                <option value="pcs">Pcs</option>
                            </select>
                        </div>
                    </div>`
        $(this).parents(".ingredient_group").children("div.ingredient_container").append(html);
    });


    var ingredient_group_id_counter = 1;
    $(".add_ingredient_group_button").click(function(){
        console.log("add_ingredient_group Function Fires")
        
        ingredient_group_id_counter+=1
        localStorage.setItem("clickcount", ingredient_group_id_counter);
        let clickcount = localStorage.getItem("clickcount");
        console.log("Click Count: ", clickcount);
        
        html = `<div class="ingredient_group" id="ingredient_group_${clickcount}">
                    <div class="container ingredient_container">
                        <!-- Ingredient Details -->
                        <div class="row mx-2 ingredient_row">
                            <div class="col-md-6 mt-3 col-12">
                                <input type="text" class="form-control ingredient_name" name="dish_name" placeholder="Ingredient Name" aria-label="IngredientName"></input>
                                <ul class="suggestions-list"></ul>
                            </div>
                            <div class="col-md-2 mt-2 mt-md-3 col-5">
                                <input type="number" class="form-control" name="number_of_portions" id="number_of_portions" placeholder="Batch" aria-label="BatchAmount"></input>
                            </div>
                            <div class="col-md-2 mt-2 mt-md-3 col-5">
                                <input type="number" class="form-control" name="dish_name" placeholder="Portion" aria-label="PortionAmount"></input>
                            </div>
                            <div class="col-md-2 mt-2 mt-md-3 col-2 ps-0 ps-md-2">
                                <select class="form-select pe-0" name="unit_select">
                                    <option value="g">g</option>
                                    <option value="kg">kg</option>
                                    <option value="pcs">Pcs</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <!-- Cooking Method -->
                    <div class="container">
                        <div class="row mx-2">
                            <div class="col-md-6 mt-2 col-12">
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
                    <!-- Add Ingredients & Cooking Section -->
                    <div class="container element-container mx-auto">
                        <div class="row mt-3 mb-2 mx-2">
                            <div class="col-2 col-md-1 col-css">
                                <button class="add_ingredient_button" type="button">Add Ingredient</button>
                            </div>
                        </div>
                    </div>
                    <hr class="max_width_500">
                </div>`

        $("#ingredient_group_container").append(html);
    })

});
