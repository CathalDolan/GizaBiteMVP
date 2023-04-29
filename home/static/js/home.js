$(document).ready(function(){
    gatherNutrientInfo();
    // counter = 0;
    // setInterval(displayHello, 5000);

    // function displayHello() {
    //     counter+=5;
    //     console.log(counter)
    // }
    // fetch(`https://8000-cathaldolan-gizabitemvp-2fe79spgt3d.ws-eu96.gitpod.io/get_test_products`)
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
            fetch(`https://8000-cathaldolan-gizabitemvp-2fe79spgt3d.ws-eu96.gitpod.io/get_products/${q}`)
            .then(response => response.json())
            .then(data => {
                PRODUCTS = data.products;
                // console.log("q : ", q)
                console.log("SEARCH_STRING : ", SEARCH_STRING)
                
                
                if(data.q === SEARCH_STRING) {
                    var prod = JSON.parse(PRODUCTS)
                    console.log("prod : ", prod);
                    var target_element = $(field).siblings('.suggestions-list');
                    target_element.empty();
                    $.each(prod, function(item) {
                        // console.log("ITEM = ", prod[item])
                        const allergens = []
                        for(const [k, v] of Object.entries(prod[item].allergen)) {
                            // console.log("allergen = ", v.eu_index)
                            allergens.push(v.eu_index)
                        }
                        target_element.append(`<li class="suggestion">${prod[item]['name']} ${allergens.length != 0 ? ' - [' + allergens + ']': ''}</li>`)
                        var target_element_last_child = target_element.children('li:last-child')
                        // console.log(target_element_last_child)
                        target_element_last_child.data('product', prod[item])
                    }) 
                }  
            });
        }
    })

    $(document).on('click', '.suggestion', function() {
        $(this).parent().siblings('input').val($(this).text()).data('product', $(this).data('product'));
        console.log($(this).data('product'))
        group = $(this).parents('.ingredient_group')
        $('.suggestions-list').empty();
        // populateCookingMethodsList(group)
        gatherNutrientInfo();
    })

    $(document).on("change", ".cooking-method-container", function() {
        console.log("COOKING METHOD CHANGED");
        console.log("this = ", $(this).children('select').val());
        var cooking_method = $(this).children('select').val();
        if(cooking_method == 1) {
            console.log("this.next = ",$(this).next().children('select').children(":first"));
            $(this).next().children('select').empty().append(
                        `<option value=""></option>
                        <option value=0>Water</option>
                        <option value=0>Stock</option>
                        <option value=0>Bouillon</option>`)
        }
        if(cooking_method == 2) {
            $(this).next().children('select').empty().append(
                `<option value=""></option>
                <option value=0>None</option>
                <option value=36.6>Butter</option>
                <option value=44.9>Vegetable Oil</option>
                <option value=44.7>Nut Oil</option>
                <option value=44.8>Animal Fat</option>
                <option value=1>1 Kcal Spray</option>
                <option value=43.9>Ghee</option>`)
        }
        if(cooking_method == 3) {
            $(this).next().children('select').empty().append(`<option value=1>None</option>
                        `)
        }
        if(cooking_method == 4) {
            $(this).next().children('select').empty().append(
                `<option value=""></option>
                <option value=0>None</option>
                <option value=44.9>Vegetable Oil</option>
                <option value=44.7>Nut Oil</option>
                <option value=44.8>Animal Fat</option>
                <option value=1>1 Kcal Spray</option>
                <option value=43.9>Ghee</option>
                `).val(2)
        }
        gatherNutrientInfo();
    })
    $(document).on("change", "input:not('.ingredient_name'), select", function() {
        // console.log("this = ", this.value)
        gatherNutrientInfo()
    })

    function populateCookingMethodsList(group) {
        console.log("populateCookingMethodsList()", group);
        var liquids = false;
        var flour = false;
        var egg = false;
        var bread = false;
        var coating = false;
        ingredients = [...$(group).find('.ingredient_name')];
        // console.log("ingredients = ", ingredients)
        ingredients.forEach(item => {
            var product = $(item).data('product')
            console.log("product = ", product)
            if(product.sub_category == 'Soft Drinks' || product.sub_category.includes('Beer') || product.sub_category == 'Milk') {
                liquids = true;
            }
            if(product.sub_category.includes('Flour')) {
                flour = true;
            }
            if(product.sub_category == 'Egg') {
                egg = true;
            }
            if(product.sub_category.includes('Bread')) {
                bread = true;
            }

            if(flour == true && (liquids == true || (bread == true && egg == true))) {
                coating = true;
                
            }
        })
        console.log("liquids = ", liquids);
        console.log("flour = ", flour);
        console.log("egg = ", egg);
        console.log("bread = ", bread);
        console.log("coating = ", coating);
    }

    function gatherNutrientInfo() {
        console.log("--------gatherNutrientInfo--------")
        var number_of_portions = $('#number_of_portions').val();
        var EnergyKcals = 0;
        const possible_allergens_list = []
        const def_allergens_list = []
        const ingredient_groups = $('.ingredient_group');

        ingredient_groups.each(function(index, group) {
            console.log("group ", index + 1, group);
            $(group).find('.group-index').empty().append("Ingredient Group " + Number(index + 1))
            var cooking_method = $(group).find("[name='cooking_method']").val();
            console.log("cooking_method = ", cooking_method);
            var substrate = Number($(group).find("[name='substrate']").val());
            console.log("substrate = ", substrate);
            var ingredients = $(group).find('.ingredient_row');
            // cooking_method = "" : No cooking method option chosen
            // cooking_method = 1 : Boiled, steamed, poached, Simmered / Stewed
            // cooking_method = 2 : Sauteed / Pan Fried, Grilled / Broiled, Roasted, Braised
            // cooking_method = 3 : Baked
            // cooking_method = 4 : Shallow Fried, Deep Fried
            if(cooking_method == "" || cooking_method == 1 || cooking_method == 3) {
                console.log("cooking_method == '' || cooking_method == 1 || cooking_method == 3)")
                ingredients.each((index, ingredient) => {
                    $(ingredient).find('.ingredient-index').empty().append(index + 1);
                    var product = $(ingredient).find(".ingredient_name").data('product');
                    console.log("ingredient ", index + 1, product);
                    if(product != undefined) {
                        var portion_amount = Number($(ingredient).find("[name='portion_amount']").val());
                        var batch_amount = Number($(ingredient).find("[name='batch_amount']").val());
                        var unit_of_measurement = Number($(ingredient).find("[name='unit_of_measurement']").val());
                        console.log("portion_amount = ", portion_amount);
                        console.log("unit_of_measurement = ", unit_of_measurement);
                        EnergyKcals += (product.energy_kcal*((portion_amount*unit_of_measurement)/100));
                        console.log("EnergyKcals = ", EnergyKcals);
                        var product_allergens = product.allergen
                        product_allergens.forEach(function(el) {
                            if(el.group[0] == '*') {
                                possible_allergens_list.push(el);
                            }
                            else {
                                def_allergens_list.push(el);
                            }
                        })
                    }
                })
            }
            if(cooking_method == 2) {
                console.log("cooking_method == 2")
                ingredients.each((index, ingredient) => {
                    var product = $(ingredient).find(".ingredient_name").data('product');
                    console.log("ingredient ", index + 1, product);
                    if(product != undefined) {
                        var portion_amount = $(ingredient).find("[name='portion_amount']").val();
                        var batch_amount = Number($(ingredient).find("[name='batch_amount']").val());
                        var unit_of_measurement = $(ingredient).find("[name='unit_of_measurement']").val();
                        console.log("portion_amount = ", portion_amount);
                        console.log("unit_of_measurement = ", unit_of_measurement);
                        console.log("substrate = ", substrate);
                        EnergyKcals += (product.energy_kcal*((portion_amount*unit_of_measurement)/100));
                        console.log("EnergyKcals = ", EnergyKcals);
                        var product_allergens = product.allergen;
                        // console.log("product_allergens = ", product_allergens);
                        product_allergens.forEach(function(el) {
                            if(el.group[0] == '*') {
                                possible_allergens_list.push(el);
                            }
                            else {
                                def_allergens_list.push(el);
                            }
                        })
                    }
                })
                EnergyKcals += substrate
                console.log("EnergyKcals + substrate= ", EnergyKcals)
            }
            if(cooking_method == 4) {
                console.log("cooking_method == 4")
                // Check for custom made coating ingredients
                console.log("Check for custom made coating ingredients")
                var liquids = false;
                var flour = false;
                var egg = false;
                var bread = false;
                var coating = false;
                ingredients.each((index, ingredient) => {
                    console.log("Custom made ingredient check", ingredient);
                    var product = $(ingredient).find(".ingredient_name").data('product');
                    if(product != undefined) {
                        if(product.sub_category == 'Soft Drinks' || product.sub_category.includes('Beer') || product.sub_category == 'Milk') {
                            liquids = true;
                        }
                        if(product.sub_category.includes('Flour')) {
                            flour = true;
                        }
                        if(product.sub_category == 'Egg') {
                            egg = true;
                        }
                        if(product.sub_category.includes('Bread')) {
                            bread = true;
                        }
                        if(flour == true && (liquids == true || (bread == true && egg == true))) {
                            coating = true;  
                        }
                    } 
                    console.log("liquids = ", liquids);
                    console.log("flour = ", flour);
                    console.log("egg = ", egg);
                    console.log("bread = ", bread);
                    console.log("coating = ", coating); 
                })
                ingredients.each((index, ingredient) => {
                    var product = $(ingredient).find(".ingredient_name").data('product');       
                    console.log("ingredient ", index + 1, product);
                    if(product != undefined) {
                        console.log("product.deep_frying_index = ", product.deep_frying_index);
                        var portion_amount = $(ingredient).find("[name='portion_amount']").val();
                        var batch_amount = Number($(ingredient).find("[name='batch_amount']").val());
                        var unit_of_measurement = $(ingredient).find("[name='unit_of_measurement']").val();
                        if(coating === true || product.deep_frying_index == 4) {
                            console.log("coating === true || product.deep_frying_index == 4");
                            EnergyKcals += (product.energy_kcal*((portion_amount*unit_of_measurement)/100)*1.935);
                            console.log("EnergyKcals = ", EnergyKcals);
                        }
                        else {
                            if(product.deep_frying_index == 1) {
                                console.log("product.deep_frying_index == 1");
                                EnergyKcals += (product.energy_kcal*((portion_amount*unit_of_measurement)/100)*2.5121);
                                console.log("EnergyKcals = ", EnergyKcals);
                            }
                            if(product.deep_frying_index == 2) {
                                console.log("product.deep_frying_index == 2");
                                EnergyKcals += (product.energy_kcal*((portion_amount*unit_of_measurement)/100)*1.4265);
                                console.log("EnergyKcals = ", EnergyKcals);
                            }
                            if(product.deep_frying_index == 3) {
                                console.log("product.deep_frying_index == 3");
                                EnergyKcals += (product.energy_kcal*((portion_amount*unit_of_measurement)/100)*1.2624);
                                console.log("EnergyKcals = ", EnergyKcals);
                            }
                        }
                        var product_allergens = product.allergen
                        // console.log("product_allergens = ", product_allergens);
                        product_allergens.forEach(function(el) {
                            if(el.group[0] == '*') {
                                possible_allergens_list.push(el);
                            }
                            else {
                                def_allergens_list.push(el);
                            }
                        })
                    }
                })
            }
        })
        
        $('#total_calories').text(Math.round(EnergyKcals));
        
        // console.log("possible_allergens_list = ", possible_allergens_list);
        const filtered_possible_allergens = possible_allergens_list.map(function(item) {
            var allergen_group = def_allergens_list.filter(obj => obj.group == item.group.slice(1));
            if(!allergen_group[0]) {
                return item;
            }
            else {
                for(i=0; i<allergen_group.length; i++) {
                    if(allergen_group[i].name == item.name) {
                        return {'group': item.group, 'name':''};
                    }
                }
                return item;
            }
        });
        const possible_allergen_groups = [];
        const possible_allergens = [];
        filtered_possible_allergens.forEach(item => {
            // console.log("item = ", item);
            if(item != undefined && !possible_allergen_groups.includes(item.group)) {
                possible_allergen_groups.push(item.group)
            }
        })
        for(i=0; i<possible_allergen_groups.length; i++) {
            const possible_allergen_group = filtered_possible_allergens.filter(obj => obj.group == possible_allergen_groups[i]);
            // console.log("possible_allergen_group = ", possible_allergen_group);
            var allergen = {'group':'', 'name':''};
            possible_allergen_group.forEach(obj => {
                // console.log("obj = ", obj.name);
                allergen.group = obj.group;
                if(!allergen.name.includes(obj.name)) {
                    allergen.name += obj.name + '/'
                }  
            })
            possible_allergens.push(allergen)
        }
        // console.log("def_allergens_list = ", def_allergens_list);   
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
    }

    // Add a New Ingredient Row Function
    var ingredient_row_id_counter = 1;
    $(document).on("click", ".add_ingredient_button", function(){
        console.log("Add Ingredient Function Fires");

        ingredient_row_id_counter+=1
        localStorage.setItem("clickcount", ingredient_row_id_counter);

        const html = `<div class="row mx-2 ingredient_row">
                        <div class="col-12">
                            <hr class="third-hr mx-auto mb-0">
                        </div>
                        <div class="col-1 col-lg-1 ingredient-index text-center mt-3 p-0"></div>
                        <div class="col-lg-2 mt-3 col did-floating-label-content">
                            <input type="number" class="form-control input batch_amount did-floating-input" name="batch_amount" placeholder=" " aria-label="BatchAmount"></input>
                            <label class="did-floating-label">Batch Amount</label>
                        </div>
                        <div class="col-lg-2 mt-3 col ps-0 did-floating-label-content">
                            <input type="number" class="form-control input portion_amount did-floating-input" name="portion_amount" placeholder=" " aria-label="PortionAmount"></input>
                            <label class="did-floating-label portion_amount_label">Portion Amount</label>
                        </div>
                        <div class="col-lg-2 mt-3 col-2 ps-0 did-floating-label-content">
                            <select class="form-select custom-select-icon pe-0 input did-floating-select" name="unit_of_measurement" onclick="this.setAttribute('value', this.value);" onchange="this.setAttribute('value', this.value);" value="1">
                                <option value="1">g</option>
                                <option value="2">kg</option>
                                <option value="3">ml</option>
                                <option value="4">l</option>
                                <option value="5">pcs</option>
                            </select>
                            <label class="did-floating-label unit_of_measure_label">Unit</label>
                        </div>
                        <!-- Line 10 in home.js preventing this from working: $(this).next().empty() -->
                        <div class="col-lg-4 mt-2 mt-md-3 col-11 did-floating-label-content">
                            <input type="text" class="form-control input ingredient_name did-floating-input" name="dish_name" placeholder=" " aria-label="IngredientName"></input>
                            <label class="did-floating-label">Ingredient Name</label>
                            <ul class="suggestions-list"></ul>
                        </div>
                        <div class="mt-2 mt-lg-3 col-1 px-0 delete_ingredient_icon_div">
                            <div class="delete_ingredient" name="delete_ingredient" aria-label="delete_ingredient">
                                <i class="fa-solid fa-trash-can"></i>
                            </div>
                        </div>
                    </div>`
        $(this).parents(".ingredient_group").children(".ingredient_container").append(html);
        // console.log("233 = ", $(this).parents(".ingredient_container"));
        gatherNutrientInfo();
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
                    <p class="mx-2 group-index"></p>
                    <!-- Ingredient Details -->
                    <div class="container ingredient_container">
                        <div class="row mx-2 ingredient_row">
                            <div class="col-1 col-lg-1 ingredient-index text-center mt-3 p-0"></div>
                            <div class="col-lg-2 mt-3 col did-floating-label-content">
                                <input type="number" class="form-control input batch_amount did-floating-input" name="batch_amount" placeholder=" " aria-label="BatchAmount"></input>
                                <label class="did-floating-label">Batch Amount</label>
                            </div>
                            <div class="col-lg-2 mt-3 col ps-0 did-floating-label-content">
                                <input type="number" class="form-control input portion_amount did-floating-input" name="portion_amount" placeholder=" " aria-label="PortionAmount"></input>
                                <label class="did-floating-label portion_amount_label">Portion Amount</label>
                            </div>
                            <div class="col-lg-2 mt-3 col-2 ps-0 did-floating-label-content">
                                <select class="form-select custom-select-icon pe-0 input did-floating-select" name="unit_of_measurement" onclick="this.setAttribute('value', this.value);" onchange="this.setAttribute('value', this.value);" value="1">
                                    <option value="1">g</option>
                                    <option value="2">kg</option>
                                    <option value="3">ml</option>
                                    <option value="4">l</option>
                                    <option value="5">pcs</option>
                                </select>
                                <label class="did-floating-label unit_of_measure_label">Unit</label>
                            </div>
                            <!-- Line 10 in home.js preventing this from working: $(this).next().empty() -->
                            <div class="col-lg-4 mt-2 mt-md-3 col-11 did-floating-label-content">
                                <input type="text" class="form-control input ingredient_name did-floating-input" name="dish_name" placeholder=" " aria-label="IngredientName"></input>
                                <label class="did-floating-label">Ingredient Name</label>
                                <ul class="suggestions-list"></ul>
                            </div>
                            <div class="mt-2 mt-lg-3 col-1 px-0 delete_ingredient_icon_div">
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
                            <div class="col-md-6 mt-3 mt-md-2 col-12 did-floating-label-content cooking-method-container">
                                <select class="form-select custom-select-icon pe-0 input did-floating-select" name="cooking_method" onclick="this.setAttribute('value', this.value);" onchange="this.setAttribute('value', this.value);" value="">
                                    <option value="">None</option>
                                        <option value=1>Boiled</option>
                                        <option value=1>Poached</option>
                                        <option value=1>Simmered / Stewed</option>
                                        <option value=1>Steamed</option>
                                        <option value=2>Sauteed / Pan Fried</option>
                                        <option value=2>Grilled / Broiled</option>
                                        <option value=3>Baked</option>
                                        <option value=2>Roasted </option>
                                        <option value=4>Braised </option>
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
        gatherNutrientInfo();
    })

    // Remove an Ingredient Row Function.
    $(document).on("click", ".delete_ingredient", function(){
    // $(".ingredient_row").on("click", ".delete_ingredient", function() {
        console.log("Delete_ingredient_row Function Fires");
        group = $(this).parents('.ingredient_group')
        $(this).parents(".ingredient_row").remove();
        // populateCookingMethodsList(group)
        gatherNutrientInfo();
    });

    // Remove an Ingredient Group Function
    $(document).on("click", ".remove_ingredient_group_button", function(){
        console.log("Remove_ingredient_group Function Fires");
        $(this).parents(".ingredient_group").remove();
        gatherNutrientInfo();
    });

    // Function to calculate the portion and batch size
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
