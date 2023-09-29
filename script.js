const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const itemList = document.getElementById('item-list');

function addItem(e) {
  e.preventDefault();
  const newItem = itemInput.value;

  //Validate Input
  if (newItem === '') {
    alert('Plese add an item');
    return;
  }
  //   console.log('success');

  // Create list item
  const li = document.createElement('li');
  li.appendChild(document.createTextNode(newItem));
  //   console.log(li); // <li>milk</li>

  const button = createButton('remove-item btn-link text-red');

  // console.log(button); // <button class="remove-item btn-link text-red"></button>  pred da kreirame icon
  /* otkako ke kreirame icon
    <button class="remove-item btn-link text-red"><i class="fa-solid fa-xmark"></i></button> */

  li.appendChild(button);
  itemList.appendChild(li);
  itemInput.value = '';
}

function createButton(classes) {
  const button = document.createElement('button');
  button.className = classes;
  const icon = createIcon('fa-solid fa-xmark');
  button.appendChild(icon);
  return button;
}

function createIcon(classes) {
  const icon = document.createElement('i');
  icon.className = classes;
  return icon;
}

// Event Listeners
itemForm.addEventListener('submit', addItem);
