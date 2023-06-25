document.addEventListener('DOMContentLoaded', () => {
  // This event listener is triggered when the DOM content is loaded and ready to be manipulated.

  // Get the necessary DOM elements
  const todoInput = document.getElementById('todo-input');
  // Retrieve the input field for adding new todo items by its ID

  const todoItems = document.querySelector('.todo-items');
  // Retrieve the container for the todo items using a CSS selector

  const itemsLeft = document.querySelector('.items-left');
  // Retrieve the element for displaying the number of items left

  const itemsStatuses = document.querySelector('.items-statuses');
  // Retrieve the container for status filters

  const clearCompleted = document.querySelector('.items-clear');
  // Retrieve the element for clearing completed items

  const themeToggle = document.querySelector('.theme');
  // Retrieve the element for toggling the theme

  const body = document.querySelector('body'); // Get the body element


  //const body = document.body;
  // Retrieve the body element

  // Event listeners
  const form = document.querySelector('form');
  // Retrieve the form element

  form.addEventListener('submit', addItem);
  // Add an event listener for the form submission, calling the addItem function

  itemsStatuses.addEventListener('click', filterItems);
  // Add an event listener for clicking on the status filters, calling the filterItems function

  clearCompleted.addEventListener('click', clearCompletedItems);
  // Add an event listener for clicking on the "Clear Completed" element, calling the clearCompletedItems function

  themeToggle.addEventListener('click', toggleTheme);
  // Add an event listener for clicking on the theme toggle, calling the toggleTheme function

  todoItems.addEventListener('click', handleItemClick);
  // Add an event listener for clicking on individual todo items, calling the handleItemClick function

  todoItems.addEventListener('dragstart', handleDragStart);
  // Add an event listener for the drag start event on todo items, calling the handleDragStart function

  todoItems.addEventListener('dragover', handleDragOver);
  // Add an event listener for the drag over event on todo items, calling the handleDragOver function

  todoItems.addEventListener('drop', handleDrop);
  // Add an event listener for the drop event on todo items, calling the handleDrop function

  themeToggle.addEventListener('click', toggleTheme);
  // Add an event listener for clicking on the theme toggle, calling the toggleTheme function

  // Initialize the items counter
  let counter = 0;
  // Declare a variable to keep track of the number of items

  // Function to add a new todo item
  function addItem(event) {
    event.preventDefault();
    // Prevent the default form submission behavior

    const todoText = todoInput.value.trim();
    // Get the trimmed value of the todo input field

    if (todoText !== '') {
      // Check if the input is not empty

      const todoItem = createTodoItem(todoText);
      // Create a new todo item element using the createTodoItem function

      todoItems.appendChild(todoItem);
      // Append the new todo item to the todo items container

      updateItemsCounter(1);
      // Update the items counter by incrementing it

      todoInput.value = '';
      // Clear the todo input field
    }
  }

  // Function to create a new todo item
  function createTodoItem(text) {
    const todoItem = document.createElement('div');
    // Create a new div element for the todo item

    todoItem.classList.add('todo-item');
    // Add the 'todo-item' class to the todo item div

    todoItem.draggable = true;
    // Make the todo item draggable

    return todoItem;
    // Return the created todo item
  }

  // Function to handle the click on an item
  function handleItemClick(event) {
    const target = event.target;
    // Get the clicked element

    const checkMark = target.closest('.check-mark');
    // Find the closest ancestor element with the class 'check-mark'

    if (checkMark) {
      // If a check-mark element is clicked

      checkMark.classList.toggle('checked');
      // Toggle the 'checked' class of the check-mark element

      const todoItem = checkMark.closest('.todo-item');
      // Find the closest ancestor element with the class 'todo-item'

      todoItem.querySelector('.todo-text').classList.toggle('checked');
      // Toggle the 'checked' class of the todo text element inside the todo item

      const checkBox = checkMark.parentElement;
      // Get the parent element of the check-mark, which is the checkbox div

      checkBox.classList.toggle('checked');
      // Toggle the 'checked' class of the checkbox div

      updateItemsCounter(checkMark.classList.contains('checked') ? -1 : 1);
      // If the check-mark has the 'checked' class, decrement the items counter, otherwise, increment it
    }
  }

  themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode'); // Toggle the 'dark-mode' class on the body element
  });

  // Function to filter items based on status
  function filterItems(event) {
    const target = event.target;
    // Get the clicked element

    if (target.classList.contains('active')) {
      showAllItems();
      // If the clicked element has the 'active' class, show all items
    } else if (target.textContent === 'Active') {
      showActiveItems();
      // If the clicked element has the text content 'Active', show only active items
    } else if (target.textContent === 'Completed') {
      showCompletedItems();
      // If the clicked element has the text content 'Completed', show only completed items
    }
  }

  // Function to show all items
  function showAllItems() {
    Array.from(todoItems.children).forEach(item => (item.style.display = 'flex'));
    // Convert the todo items container's children to an array and iterate over each item
    // Set the display style of each item to 'flex' to show them
  }

  // Function to show active items
  function showActiveItems() {
    Array.from(todoItems.children).forEach(item => {
      const checked = item.querySelector('.check-mark').classList.contains('checked');
      // Check if the item is checked

      item.style.display = checked ? 'none' : 'flex';
      // If the item is checked, set the display style to 'none' to hide it, otherwise, set it to 'flex' to show it
    });
  }

  // Function to show completed items
  function showCompletedItems() {
    Array.from(todoItems.children).forEach(item => {
      const checked = item.querySelector('.check-mark').classList.contains('checked');
      // Check if the item is checked

      item.style.display = checked ? 'flex' : 'none';
      // If the item is checked, set the display style to 'flex' to show it, otherwise, set it to 'none' to hide it
    });
  }

  // Function to toggle between light and dark mode

  const prefersDarkTheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
  // Check if the user prefers dark theme using the matchMedia API

  if (prefersDarkTheme) {
    toggleTheme();
    // If the user prefers dark theme, toggle the theme initially
  }

  function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    // Toggle the 'dark-theme' class on the body element

    themeToggle.innerHTML = `
      <img src="assets/${document.body.classList.contains('dark-theme') ? 'icon-moon.svg' : 'icon-sun.svg'}">
    `;
    // Change the inner HTML of the theme toggle element based on the current theme

    if (document.body.classList.contains('dark-theme')) {
      todoItems.style.backgroundImage = 'url("assets/dark-background.jpg")';
    } else {
      todoItems.style.backgroundImage = 'url("assets/light-background.jpg")';
    }
    // Set the background image of the todo items container based on the current theme
  }

  // Variables for drag and drop functionality
  let draggingItem = null;
  // Declare a variable to keep track of the dragging item

  // Function to handle drag start
  function handleDragStart(event) {
    draggingItem = event.target.closest('.todo-item');
    // Set the dragging item to the closest ancestor element with the class 'todo-item'
  }

  // Function to handle drag over
  function handleDragOver(event) {
    event.preventDefault();
    // Prevent the default drag over behavior
  }

  // Function to handle drop
  function handleDrop(event) {
    const dropTarget = event.target.closest('.todo-item');
    // Set the drop target to the closest ancestor element with the class 'todo-item'

    if (draggingItem && dropTarget && draggingItem !== dropTarget) {
      // If there is a dragging item, drop target exists, and they are not the same

      const items = Array.from(todoItems.children);
      // Convert the todo items container's children to an array

      const draggingIndex = items.indexOf(draggingItem);
      // Get the index of the dragging item in the array

      const dropIndex = items.indexOf(dropTarget);
      // Get the index of the drop target in the array

      if (draggingIndex >= 0 && dropIndex >= 0) {
        // If both indexes are valid

        if (draggingIndex < dropIndex) {
          todoItems.insertBefore(draggingItem, dropTarget.nextSibling);
          // Move the dragging item to be positioned after the drop target
        } else {
          todoItems.insertBefore(draggingItem, dropTarget);
          // Move the dragging item to be positioned before the drop target
        }
      }
    }
    draggingItem = null;
    // Reset the dragging item variable
  }

 
    // Get elements
    var addTodoButton = document.getElementById('add-todo-button');
    
    // Add new todo item
    function addItem(event) {
        event.preventDefault();
        var inputValue = todoInput.value;
        if (inputValue) {
            var newTodoItem = document.createElement('div');
            newTodoItem.classList.add('todo-item');
            newTodoItem.innerHTML = `
                <div class="check">
                    <div class="check-mark">
                        <img src="assets/icon-check.svg" alt="">
                    </div>
                </div>
                <div class="todo-item-text">${inputValue}</div>
                <button class="delete-todo">Delete</button>
            `;
            todoItems.appendChild(newTodoItem);
            todoInput.value = '';
            updateItemsLeft();
        }
    }
    
   // Update number of items left
function updateItemsLeft() {
  var totalItems = document.querySelectorAll('.todo-item').length;
  itemsLeft.textContent = totalItems + (totalItems === 1 ? ' item' : ' items') + ' left';
}


// Function to clear completed items
function clearCompletedItems() {
  const completedItems = Array.from(todoItems.children).filter(item => {
    return item.querySelector('.check-mark').classList.contains('checked');
  });

  completedItems.forEach(item => {
    item.remove();
  });

  const completedCount = completedItems.length;
  counter -= completedCount;
  updateItemsLeft();

}

   // Event listener for the delete button
todoItems.addEventListener('click', function(event) {
    if (event.target.classList.contains('delete-todo')) {
        var todoItem = event.target.closest('.todo-item');
        if (todoItem) {
            todoItem.remove();
            updateItemsLeft();
        }
    }
});



});




