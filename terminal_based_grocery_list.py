import datetime
import operator
import os

EMPTY_LIST_MESSAGE = "\nNothing to show yet, add something to the list.\n"
grocery_list = []


class GroceryItem:

    def __init__(self, item, department):
        self.item = item
        self.department = department

    def __eq__(self, other):
        return self.item == other.item and self.department == other.department

    def __ne__(self, other):
        return self.item != other.item or self.department != other.department

    def __gt__(self, other):
        return (self.department, self.item) > (other.department, other.item)

    def __lt__(self, other):
        return (self.department, self.item) < (other.department, other.item)

    def __ge__(self, other):
        return (self.department, self.item) > (other.department, other.item) or (
                    self.item == other.item and self.department == other.department)

    def __le__(self, other):
        return (self.department, self.item) < (other.department, other.item) or (
                self.item == other.item and self.department == other.department)


def clear_screen():
    os.system("cls" if os.name == "nt" else "clear")


def print_menu():
    clear_screen()
    print("-" * 80)
    print("Let's make a Grocery List! :)\n"
          "Keep entering new items to pick up at the store or:\n"
          "\tS Show the grocery list by department\n"
          "\tA to Show the grocery list alphabetically by item names\n"
          "\tW to Write the list to a file, (always by department)\n"
          "\tH or Help will show this menu again\n"
          "\tQ or Quit will end the program")
    print("-" * 80)


def get_list(first_key, second_key=None):
    return_list = ""

    if len(grocery_list) > 0:

        if second_key:
            grocery_list.sort(key=operator.attrgetter(first_key, second_key))
        else:
            grocery_list.sort(key=operator.attrgetter(first_key))
            
        today = datetime.datetime.today()
        return_list += ("-" * 80)
        return_list += f"\nGrocery List for {today:%B %d, %Y}:\n"
        return_list += ("-" * 80)

        for index, grocery_item in enumerate(grocery_list, start=1):
            return_list += f"\n{index}) {grocery_item.item} in {grocery_item.department}"

        return_list += "\n"
        return_list += ("-" * 80)
        return_list += "\n"

    return return_list


def print_list(first_key, second_key=None):
    clear_screen()
    print_list = get_list(first_key, second_key)

    if len(print_list) > 0:
        print(print_list)
    else:
        print(EMPTY_LIST_MESSAGE)


def print_list_by_item():
    print_list(first_key="item")


def print_list_by_department():
    print_list(first_key="department", second_key="item")


def write_to_file():
    file_list = get_list(first_key="department", second_key="item")
    today = datetime.datetime.today()
    file_name = f"grocery_list_{today:%Y-%m-%d}.txt"

    with open(file_name, "w+") as grocery_file:
        grocery_file.write(file_list)


def add_to_list(new_item):

    if len(new_item) > 0:
        department = input("What department is that in?: ")
        department = department.lower()
        grocery_list.append(GroceryItem(item=new_item, department=department))
    else:
        print("You forgot to enter a new item for the list, try again.")


if __name__ == "__main__":
    print_menu()
    keep_running = True

    while keep_running:
        next_item = input("Enter an item for the list (or s|a|w|h|q): ")
        next_item = next_item.lower()

        if next_item in ["q", "quit"]:
            keep_running = False
        elif next_item in ["h", "help"]:
            print_menu()
        elif next_item == "a":
            print_list_by_item()
        elif next_item == "s":
            print_list_by_department()
        elif next_item == "w":
            write_to_file()
        else:
            add_to_list(new_item=next_item)



