$(document).ready(function(){
    // counter = 0;
    // setInterval(displayHello, 5000);

    // function displayHello() {
    //     counter+=5;
    //     console.log(counter)
    // }
    // fetch(`https://8000-cathaldolan-gizabitemvp-d7bejlihi03.ws-eu93.gitpod.io/get_test_products`)
    // .then(response => response.json())
    // .then(data => {
    //     console.log("data")
    // })
    console.log('hi, it works!');
    var PRODUCTS = {};
    var SEARCH_STRING;
    $(document).on('keyup', '.ingredient_name', function() {
        if($(this).val().length > 2) {
            var q = $(this).val();
            SEARCH_STRING = $(this).val();
            var field = $(this);
            $(this).next().empty()
            fetch(`https://8000-cathaldolan-gizabitemvp-d7bejlihi03.ws-eu94.gitpod.io/get_products/${q}`)
            .then(response => response.json())
            .then(data => {
                PRODUCTS = data.products;
                // console.log("q : ", q)
                // console.log("SEARCH_STRING : ", SEARCH_STRING)
                // console.log("PRODUCTS : ", PRODUCTS);
                if(data.q === SEARCH_STRING) {
                    $.each(PRODUCTS, function(index, item) {
                        const allergens = []
                        for(const [k, v] of Object.entries(item.allergen)) {
                            // console.log(`allergen = ${v["allergen"]}`)
                            allergens.push(v.index)
                        }
                        $(field).next().append(`<li class="suggestion" data-product='${JSON.stringify(item)}'>${item['name']} ${allergens.length != 0 ? ' - [' + allergens + ']': ''}</li>`)
                    }) 
                }
                     
            });
        }
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
        const possible_allergens_list = []
        const def_allergens_list = []
        const ingredient_groups = $('.ingredient_group');

        ingredient_groups.each(function(index, item) {
            var cooking_method = $(item).find("[name='cooking_method']").val();
            var substrate = $(item).find("[name='substrate']").val();
            var ingredients = $(item).find('.ingredient_row');
            // console.log("ingredients = ", ingredients);
            ingredients.each((index, element) => {
                var product = $(element).find(".ingredient_name").data('product');
                // console.log("product = ", product);
                if(product != undefined) {
                    var amount = Number($(element).find("[name='batch_amount']").val());
                    var units = $(element).find("[name='unit_select']").val();
                    EnergyKcals += (product.energy_kcal*(amount/100));
                    var product_allergens = product.allergen
                    // console.log("product_allergens = ", product_allergens);
                    product_allergens.forEach(function(el) {
                        if(el.group[0] == '*') {
                            possible_allergens_list.push(el)
                        }
                        else {
                            def_allergens_list.push(el)
                        }
                    })
                    
                }
                
            })
        })
        
        console.log("possible_allergens_list = ", possible_allergens_list);
        const filtered_possible_allergens = possible_allergens_list.map(function(item) {
            var allergen_group = def_allergens_list.filter(obj => obj.group == item.group.slice(1));
            if(!allergen_group[0]) {
                return item;
            }
            else {
                for(i=0; i<allergen_group.length; i++) {
                    if(allergen_group[i].name == item.name) {
                        console.log("==")
                        return {'group': item.group, 'name':''};
                    }
                }
                return item;
            }
        });
        const possible_allergen_groups = [];
        const possible_allergens = [];
        filtered_possible_allergens.forEach(item => {
            console.log("item = ", item);
            if(item != undefined && !possible_allergen_groups.includes(item.group)) {
                possible_allergen_groups.push(item.group)
            }
        })
        for(i=0; i<possible_allergen_groups.length; i++) {
            const possible_allergen_group = filtered_possible_allergens.filter(obj => obj.group == possible_allergen_groups[i]);
            console.log("possible_allergen_group = ", possible_allergen_group);
            var allergen = {'group':'', 'name':''};
            possible_allergen_group.forEach(obj => {
                console.log("obj = ", obj.name);
                allergen.group = obj.group;
                if(!allergen.name.includes(obj.name)) {
                    allergen.name += obj.name + '/'
                }  
            })
            possible_allergens.push(allergen)
        }
        console.log("def_allergens_list = ", def_allergens_list);   
        const definite_allergen_groups = [];
        const definite_allergens = [];
        def_allergens_list.forEach(item => {
            if(!definite_allergen_groups.includes(item.group)) {
                definite_allergen_groups.push(item.group);
            }
        })         
        for(i=0; i<definite_allergen_groups.length; i++) {
            const definite_allergen_group = def_allergens_list.filter(obj => obj.group == definite_allergen_groups[i]);
            allergen = {'group':'', 'name':''};
            definite_allergen_group.forEach(obj => {
                allergen.group = obj.group;
                if(!allergen.name.includes(obj.name)) {
                    allergen.name += obj.name + '/'
                }  
            });
            definite_allergens.push(allergen);
        }
        console.log("possible_allergens = ", possible_allergens);
        console.log("definite_allergens = ", definite_allergens)
        var allergen_list_refined = [];

        
        $('#total_allergens').empty();
        
        definite_allergens.forEach(item => {
            if(item.name[0] == '/') {
                item.name = item.name.slice(1,-1)
            }
            else {
                item.name = item.name.slice(0,-1)
            }
            if(item.name == 'null') {
                item.name = null;
            }
            allergen_name = item.name ? ': ' + item.name : '';
            $('#total_allergens').append(`<p>${item.group}${allergen_name}</p>`)
        })
        possible_allergens.forEach(item => {
            if(item.name[0] == '/') {
                console.log("YES IF")
                console.log("item.name = ", item.name)
                console.log("item.name.split(1,-1) = ", item.name.slice(1,-1))
                item.name = item.name.slice(1,-1)
            }
            else {
                item.name = item.name.slice(0,-1)
            }
            if(item.name == 'null') {
                item.name = null;
            }
            allergen_name = item.name ? ': ' + item.name : '';
            $('#total_allergens').append(`<p>${item.group}${allergen_name}</p>`)
        })
        if(possible_allergens.length > 1) {
            $("#total_allergens").append(`<p class="allergens-footnote">* denotes recipe may contain these items.</p>`)
        }
        // console.log("allergen_list = ", allergen_list);
        // $('#total_allergens').text(allergen_list);
        $('#total_calories').text(Math.round(EnergyKcals/number_of_portions));
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
                                <input type="number" class="form-control" name="batch_amount" id="batch_amount" placeholder="Batch" aria-label="BatchAmount"></input>
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
