import datetime
import operator
import os

EMPTY_LIST_MESSAGE = "\nNothing to do yet, add some items to the list.\n"
ITEM = "item"
DEPT = "department"
grocery_list = []
run_date = datetime.datetime.today()


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

    def get_item(self):
        return self.item

    def get_department(self):
        return self.department


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


def print_list(first_key, second_key=None):
    clear_screen()

    if len(grocery_list) > 0:

        if second_key:
            grocery_list.sort(key=operator.attrgetter(first_key, second_key))
        else:
            grocery_list.sort(key=operator.attrgetter(first_key))

        print("-" * 80)
        print(
            f"Grocery List for {run_date:%B %d, %Y}:"
        )
        print("-" * 80)

        for index, grocery_item in enumerate(grocery_list, start=1):
           print(f"\n{index}) {grocery_item.item} in {grocery_item.department}")

        print("-" * 80)
        print("\n")
    else:
        print(EMPTY_LIST_MESSAGE)


def write_to_file():

    if len(grocery_list) > 0:
        grocery_list.sort(key=operator.attrgetter(DEPT, ITEM))
        file_name = f"grocery_list_{run_date:%Y-%m-%d}.txt"

        with open(file_name, "w+") as grocery_file:
            grocery_file.write("-" * 80 + "\n")
            grocery_file.write(f"Grocery List for {run_date:%B %d, %Y}:\n")
            grocery_file.write("-" * 80 + "\n")
            current_dept = None

            for grocery_item in grocery_list:

                if grocery_item.department != current_dept:
                    current_dept = grocery_item.department

                    if not current_dept:
                        current_dept = "No Department Specified"

                    grocery_file.write(f"\n{current_dept.title()}\n")
                    grocery_file.write("-" * 40 + "\n")

                grocery_file.write(f"{grocery_item.item} [    ]\n")
    else:
        print(EMPTY_LIST_MESSAGE)


def add_to_list(new_item):

    if len(new_item) > 0:
        new_depart = input("What department is that in?: ")
        new_depart = new_depart.lower()
        grocery_list.append(
            GroceryItem(item=new_item, department=new_depart)
        )
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
            print_list(first_key=ITEM)
        elif next_item == "s":
            print_list(first_key=DEPT, second_key=ITEM)
        elif next_item == "w":
            write_to_file()
        else:
            add_to_list(new_item=next_item)



