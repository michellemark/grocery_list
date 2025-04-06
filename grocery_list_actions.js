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
    var print_list_btn = $("#print_list_btn");

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

    function remove_item(index) {
        grocery_list.splice(index, 1);
        display_grocery_list();
    }

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

        $(".delete-item").on("click", function () {
            var index = $(this).data("index");
            remove_item(index);
        });
    }

    function print_only_list() {
        if (grocery_list.length === 0) {
            alert("Nothing to print. Add some items to your grocery list first.");
            return;
        }

        // Create a new window for printing
        var printWindow = window.open('', '_blank', 'width=800,height=600');
        printWindow.document.write('<html><head><title>Grocery List</title>');

        // Add styling
        printWindow.document.write(`
        <style>
            body { 
                font-family: Arial, sans-serif; 
                padding: 20px; 
                margin: 0; 
            }
            h2 { 
                margin-top: 0; 
                margin-bottom: 20px; 
            }
            h4 { 
                margin-top: 15px; 
                margin-bottom: 5px; 
                font-size: 18px; 
                border-bottom: 1px solid #ccc;
                padding-bottom: 5px;
            }
            .list-item { 
                display: flex; 
                align-items: center; 
                margin-bottom: 8px; 
            }
            .checkbox { 
                display: inline-block; 
                width: 16px; 
                height: 16px; 
                border: 1px solid #000; 
                margin-right: 10px; 
            }
            .department { 
                margin-top: 15px; 
            }
        </style>
    `);

        printWindow.document.write('</head><body>');
        printWindow.document.write('<h2>Grocery List</h2>');

        // Sort the grocery list by department and then by item name
        var sortedList = [...grocery_list].sort(function (a, b) {
            return a.department.localeCompare(b.department) || a.item.localeCompare(b.item);
        });

        // Group items by department
        var departmentGroups = {};

        sortedList.forEach(function (item) {
            var dept = item.department || "No Department Specified";
            if (!departmentGroups[dept]) {
                departmentGroups[dept] = [];
            }
            departmentGroups[dept].push(item.item);
        });

        var printContent = '<div id="print_content">';
        var deptNames = Object.keys(departmentGroups).sort();

        // Add each department and its items
        deptNames.forEach(function (dept) {
            printContent += '<div class="department">';
            printContent += '<h4>' + dept + '</h4>';

            departmentGroups[dept].forEach(function (item) {
                printContent += '<div class="list-item"><div class="checkbox"></div>' + item + '</div>';
            });

            printContent += '</div>';
        });

        printContent += '</div>';

        printWindow.document.write(printContent);
        printWindow.document.write('</body></html>');
        printWindow.document.close();

        // Wait for content to load
        setTimeout(function () {
            printWindow.focus();
            printWindow.print();
            // Uncomment the line below when you're satisfied with the output
            // printWindow.close();
        }, 500);
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

$(function () {
    list_processor.setup_page();
});
