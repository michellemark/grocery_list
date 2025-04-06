var list_processor = (function () {
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
    var print_list_btn = $("#print_list_btn"); // Reference the existing print button

    function clean_user_input(value) {
        value = value.replace(/[^a-zA-Z0-9\s\/\-_]/, "");

        return value.replace(/\w\S*/g, function (word) {
            return word.charAt(0).toUpperCase() + word.substr(1).toLowerCase();
        });
    }

    function load_department_selections() {
        department_selection.empty();
        departments.sort();

        for (var i = 0; i < departments.length; i++) {
            var item = departments[i];
            item = clean_user_input(item);
            var option;

            if (i === 0) {
                option = new Option(item, item, true, true);
            } else {
                option = new Option(item, item);
            }
            department_selection.append(option);
        }
    }

    // Remove an item from the grocery list
    function remove_item(index) {
        grocery_list.splice(index, 1);
        display_grocery_list(); // Updated function name
    }

    // Renamed from print_grocery_list to display_grocery_list
    function display_grocery_list() {
        display_list.empty();

        if (grocery_list.length === 0) {
            display_list.append("Nothing in the list, add some items!");
            return;
        }

        grocery_list.sort(function (a, b) {
            return a.department.localeCompare(b.department) || a.item.localeCompare(b.item);
        });

        var current_department = null;

        for (var i = 0; i < grocery_list.length; i++) {
            var next_item = grocery_list[i];

            if (next_item.department !== current_department) {
                if (next_item.department) {
                    current_department = next_item.department;
                } else {
                    current_department = "No Department Specified";
                }

                display_list.append("<h4 class='mt-4'>" + current_department + "</h4>");
            }

            // Add item with checkbox for print and trash icon for screen
            display_list.append(
                "<div class='d-flex align-items-center'>" +
                "<div class='checkbox-container'>" +
                "<div class='checkbox-print'></div>" +
                "<span class='ps-3 flex-grow-1'>" + next_item.item + "</span>" +
                "</div>" +
                "<button class='btn btn-sm text-danger delete-item' data-index='" + i + "'>" +
                "<i class='fa fa-trash'></i>🗑️" +
                "</button>" +
                "</div>"
            );
        }

        // Set up delete button handlers
        $(".delete-item").on("click", function () {
            var index = $(this).data("index");
            remove_item(index);
        });
    }

    // New function to handle printing only the grocery list
    function print_only_list() {
        if (grocery_list.length === 0) {
            alert("Nothing to print. Add some items to your grocery list first.");
            return;
        }

        $("#display_list .d-flex").each(function () {
            if ($(this).find('.checkbox-print').length === 0) {
                $(this).prepend('<div class="checkbox-print"></div>');
            }
        });

        window.print();
    }

    function validate_input(text_input) {
        var is_valid = false;

        if (text_input.val().length >= 1) {
            is_valid = true;
            text_input.removeClass("is-invalid");
            text_input.addClass("is-valid");
        } else {
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
                    display_grocery_list(); // Updated function name

                    // Clear the input field after adding item
                    item_entry.val('');
                    item_entry.removeClass('is-valid');
                }
            });

            reset_list_btn.on("click", function () {
                grocery_list = [];
                display_list.empty();
                display_list.append("Nothing in the list, add some items!");
                item_entry.val('');
                item_entry.removeClass('is-valid is-invalid');
                new_department.val('');
                new_department.removeClass('is-valid is-invalid');
            });

            new_department.on("keyup", function () {
                validate_input($(this));
            });

            add_department_btn.on("click", function () {
                var is_valid = validate_input(new_department);

                if (is_valid) {
                    var new_item = new_department.val();
                    new_item = clean_user_input(new_item);

                    // Check if department already exists
                    if (departments.indexOf(new_item) === -1) {
                        departments.push(new_item);
                        load_department_selections();

                        // Clear the input field after adding department
                        new_department.val('');
                        new_department.removeClass('is-valid');
                    } else {
                        alert("This department already exists!");
                    }
                }
            });

            print_list_btn.on("click", function () {
                print_only_list();
            });

            // Initialize page
            reset_list_btn.trigger("click");
            load_department_selections();
        }
    };
}(list_processor || {}));

// jQuery ready syntax
$(function () {
    list_processor.setup_page();
});
