

var list_processor = ( function() {
    var grocery_list = [];
    var departments = [
        "Bakery", "Baking", "Beauty", "Breakfast", "Canned Goods", "Condiments",
        "Cleaning", "Dairy", "Freezer", "Housewares / Gifts", "International",
        "Meat", "Medicine", "Organics", "Organics Freezer", "Paper / Storage",
        "Pasta", "Pet Food", "Plants", "Produce", "Snacks"
    ];
    var item_entry = $("#item_entry");
    var department_selection = $("#department_selection");
    var display_list = $("#display_list");
    var save_new_btn = $("#save_new_btn");
    var reset_list_btn = $("#reset_list_btn");
    var new_department = $("#new_department");
    var add_department_btn = $("#add_department_btn");

    function clean_user_input (value) {
        value = value.replace(/[^a-zA-Z0-9\s\/\-_]/, "");

        return value.replace(/\w\S*/g, function (word) {
            return word.charAt(0).toUpperCase() + word.substr(1).toLowerCase();
        });
    }

    function load_department_selections () {
        department_selection.empty();
        departments.sort();

        for (var i = 0; i < departments.length; i++) {
            var item = departments[i];
            item = clean_user_input(item);
            var option;

            if (i === 0) {
                option = new Option(item, item, true, true);
            }
            else {
                option = new Option(item, item);
            }
            department_selection.append(option);
        }
    }

    function print_grocery_list() {
        display_list.empty();
        grocery_list.sort(function (a, b) {
            return a.department.localeCompare(b.department) || a.item.localeCompare(b.item);
        });
        var current_department = null;

        for (var i = 0; i < grocery_list.length; i++) {
            next_item = grocery_list[i];

            if (next_item.department !== current_department) {

                if (next_item.department) {
                    current_department = next_item.department;
                }
                else {
                    current_department = "No Department Specified";
                }

                display_list.append("<h4 class='mt-4'>" + current_department + "</h4>");
            }

            display_list.append("<span class='pl-3'>" + next_item.item + "</span><br>");
        }

    }

    function validate_input(text_input) {
        var is_valid = false;

        if (text_input.val().length >= 1) {
            is_valid = true;
            text_input.removeClass("is-invalid");
            text_input.addClass("is-valid");
        }
        else {
            text_input.removeClass("is-valid");
            text_input.addClass("is-invalid");
        }

        return is_valid;
    }

    return {
        setup_page: function () {
            item_entry.on("keyup", function () {
                validate_input($(this));
            });
            save_new_btn.on("click", function () {
                var is_valid = validate_input(item_entry);

                if (is_valid) {
                    var new_item = item_entry.val();
                    new_item = clean_user_input(new_item);
                    var dept = department_selection.val();
                    dept = clean_user_input(dept);
                    grocery_list.push({
                        "item": new_item,
                        "department": dept
                    });
                    print_grocery_list();
                }

            });
            reset_list_btn.on("click", function () {
                display_list.empty();
                display_list.append("Nothing in the list, add some items!");
            });
            new_department.on("keyup", function() {
                validate_input($(this));
            });
            add_department_btn.on("click", function () {
                var is_valid = validate_input(new_department);

                if (is_valid) {
                    var new_item = new_department.val();
                    new_item = clean_user_input(new_item);
                    departments.push(new_item);
                    load_department_selections();
                }

            });
            reset_list_btn.trigger("click");
            load_department_selections();
        }
    };
}(list_processor || {}));


$.when($.ready).then( function() {
    list_processor.setup_page();
});
