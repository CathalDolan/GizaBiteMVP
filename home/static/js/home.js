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
            $(this).next(".suggestions-list").empty()
            fetch(`https://8000-cathaldolan-gizabitemvp-2fe79spgt3d.ws-eu94.gitpod.io/get_products/${q}`)
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
                            allergens.push(v.eu_index)
                        }
                        $(field).siblings('.suggestions-list').append(`<li class="suggestion" data-product='${JSON.stringify(item)}'>${item['name']} ${allergens.length != 0 ? ' - [' + allergens + ']': ''}</li>`)
                    }) 
                }
                     
            });
        }
    })

    $(document).on('click', '.suggestion', function() {
        $(this).parent().siblings('input').val($(this).text()).data('product', $(this).data('product'));
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

    // Add a New Ingredient Row Function
    var ingredient_row_id_counter = 1;
    $(document).on("click", ".add_ingredient_button", function(){
        console.log("Add Ingredient Function Fires");

        ingredient_row_id_counter+=1
        localStorage.setItem("clickcount", ingredient_row_id_counter);

        const html = `<div class="row mx-2 ingredient_row">
                        <div class="col-md-2 mt-3 col-5 did-floating-label-content">
                            <input type="number" class="form-control input batch_amount did-floating-input" name="batch_amount" placeholder=" " aria-label="BatchAmount"></input>
                            <label class="did-floating-label">Batch Amount</label>
                        </div>
                        <div class="col-md-2 mt-3 col-5 ps-0 did-floating-label-content">
                            <input type="number" id="portion_amount" class="form-control input portion_amount did-floating-input" name="portion_amount" placeholder=" " aria-label="PortionAmount"></input>
                            <label class="did-floating-label">Portion Amount</label>
                        </div>
                        <div class="col-md-2 mt-3 col-2 ps-0 did-floating-label-content">
                            <select class="form-select custom-select-icon pe-0 input did-floating-select" name="unit_of_measurement" onclick="this.setAttribute('value', this.value);" onchange="this.setAttribute('value', this.value);" value="">
                                <option value=" "></option>
                                <option value="1">g</option>
                                <option value="2">kg</option>
                                <option value="3">ml</option>
                                <option value="4">l</option>
                                <option value="5">pcs</option>
                            </select>
                            <label class="did-floating-label unit_of_measure_label">Unit</label>
                        </div>
                        <div class="col-md-5 mt-2 mt-md-3 col-11 did-floating-label-content">
                            <input type="text" class="form-control input ingredient_name did-floating-input" name="dish_name" placeholder=" " aria-label="IngredientName"></input>
                            <label class="did-floating-label">Ingredient Name</label>
                            <ul class="suggestions-list"></ul>
                        </div>
                        <div class="mt-2 mt-md-3 col-1 px-0 delete_ingredient_icon_div">
                            <div class="delete_ingredient" name="delete_ingredient" aria-label="delete_ingredient">
                                <i class="fa-solid fa-trash-can"></i>
                            </div>
                        </div>
                    </div>`
        $(this).parents(".ingredient_group").children(".ingredient_container").append(html);
        // console.log("233 = ", $(this).parents(".ingredient_container"));
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
                        <div class="col-md-2 mt-3 col-5 did-floating-label-content">
                            <input type="number" class="form-control input batch_amount did-floating-input" name="batch_amount" placeholder=" " aria-label="BatchAmount"></input>
                            <label class="did-floating-label">Batch Amount</label>
                        </div>
                        <div class="col-md-2 mt-3 col-5 ps-0 did-floating-label-content">
                            <input type="number" id="portion_amount" class="form-control input portion_amount did-floating-input" name="portion_amount" placeholder=" " aria-label="PortionAmount"></input>
                            <label class="did-floating-label">Portion Amount</label>
                        </div>
                        <div class="col-md-2 mt-3 col-2 ps-0 did-floating-label-content">
                            <select class="form-select custom-select-icon pe-0 input did-floating-select" name="unit_of_measurement" onclick="this.setAttribute('value', this.value);" onchange="this.setAttribute('value', this.value);" value="">
                                <option value=" "></option>
                                <option value="1">g</option>
                                <option value="2">kg</option>
                                <option value="3">ml</option>
                                <option value="4">l</option>
                                <option value="5">pcs</option>
                            </select>
                            <label class="did-floating-label unit_of_measure_label">Unit</label>
                        </div>
                        <div class="col-md-5 mt-2 mt-md-3 col-11 did-floating-label-content">
                            <input type="text" class="form-control input ingredient_name did-floating-input" name="dish_name" placeholder=" " aria-label="IngredientName"></input>
                            <label class="did-floating-label">Ingredient Name</label>
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
                            <div class="col-md-6 mt-3 mt-md-2 col-12 did-floating-label-content">
                                <select class="form-select custom-select-icon pe-0 input did-floating-select" name="cooking_method" onclick="this.setAttribute('value', this.value);" onchange="this.setAttribute('value', this.value);" value="">
                                    <option value=" "></option>
                                    <option value="Boiled">Boiled</option>
                                    <option value="Deep Fried">Deep Fried</option>
                                    <option value="Baked">Baked</option>
                                </select>
                                <label class="did-floating-label cooking_method_label">Cooking Method</label>
                            </div>
                            <div class="col-md-6 mt-2 col-12 did-floating-label-content">
                                <select class="form-select custom-select-icon pe-0 input did-floating-select"  name="substrate" onclick="this.setAttribute('value', this.value);" onchange="this.setAttribute('value', this.value);" value="">
                                    <option value=" "></option>
                                    <option value="Vegetable Oil">Vegetable Oil</option>
                                    <option value="Animal Fat">Animal Fat</option>
                                    <option value="Butter">Butter</option>
                                    <option value="Stock">Stock</option>
                                    <option value="Butter">Water</option>
                                </select>
                                <label class="did-floating-label substrate_label">Substrate</label>
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

    // Functions to calculate the portion and batch size
    $("#number_of_portions").keyup(function(){
        console.log("Calc 1 fires");
        const number_of_portions = parseInt($("#number_of_portions").val());
        const batch_amount = parseInt($(".batch_amount").val() || 0);
        const portion_amount = parseInt($(".portion_amount").val() || 0);
        const batch_amount_calc = (number_of_portions*portion_amount);
        const portion_amount_calc = (batch_amount/number_of_portions);
        if (batch_amount > 0 && portion_amount == 0) {
            $(".portion_amount").val(portion_amount_calc);
        } else if (portion_amount > 0) {
            $(".batch_amount").val(batch_amount_calc);
        }
    });
    // Function to calculate Portion Amount
    $("#ingredient_group_container").on("keyup", ".batch_amount", function(){
        if ($("#number_of_portions").val() > 0) {
            let number_of_portions = parseInt($("#number_of_portions").val());
            let batch_amount = parseInt($(this).val());
            let portion_amount_calc = (batch_amount/number_of_portions);
            $(this).closest(".ingredient_row").find("input[name='portion_amount']").val(portion_amount_calc);
        } else {
            $(this).val("");
            alert("Please add number of portions");
        }
    });
    // Function to calculate Batch Amount
    $("#ingredient_group_container").on("keyup", ".portion_amount", function(){
        if ($("#number_of_portions").val() > 0) {
            const number_of_portions = parseInt($("#number_of_portions").val());
            const portion_amount = parseInt($(this).closest(".ingredient_row").find("input[name='portion_amount']").val());
            const batch_amount_calc = (number_of_portions*portion_amount);
            $(this).closest(".ingredient_row").find("input[name='batch_amount']").val(batch_amount_calc);
        } else {
            $(this).val("");
            alert("Please add number of portions");
        }
    });

})
