const itemForm = document.getElementById("item-form");
const itemInput = document.getElementById("item-input");
const itemList = document.getElementById("item-list");
const clearBtn = document.getElementById("clear");
const itemFilter = document.getElementById("filter");
// const items = itemList.querySelectorAll("li"); // ova na pocetok go stavivme vo global scope koga namavme items i zatoa
// vo checkUI() nema da se gledaat novo vnesenite items. Go premestuvame vo checkUI()
let isEditMode = false;
const formBtn = itemForm.querySelector("button"); // go selektirame button za da vo edit mode go promenime vo update

function displayItems() {
  let itemsFromStorage = getItemsFromStorage();
  itemsFromStorage.forEach((item) => addItemToDOM(item));

  checkUI(); // ne se gledaa Clear All btn i Filter zatoa pak ja povikavme f-cijata
}

function onAddItemSubmit(e) {
  e.preventDefault();
  const newItem = itemInput.value;

  //Validate Input
  if (newItem === "") {
    alert("Plese add an item");
    return;
  }

  //Check for edit mode  //tuka ke go otstranime stariot item od DOM i Local Storage taka sto ke moze da stavime nov
  if (isEditMode) {
    const itemToEdit = itemList.querySelector(".edit-mode"); // itemToEdit e li element

    removeItemFromStorage(itemToEdit.textContent);
    itemToEdit.classList.remove("edit-mode");
    itemToEdit.remove(); // remove from DOM
    isEditMode = false;
  } else {
    if (checkIfItemExists(newItem)) {
      alert("That item already exists!");
      return;
    }
  }

  //Create item DOM element
  addItemToDOM(newItem);

  // Add item to local storage
  addItemToStorage(newItem);

  checkUI();

  itemInput.value = "";
}

function addItemToDOM(item) {
  // ova e novo kreirana f-cija vo koja go zemame kodot od addItem() f-cijata koja ja preimenuvuvavme vo onAddItemSubmit()
  // Create list item
  const li = document.createElement("li");
  li.appendChild(document.createTextNode(item)); // masto newItem go stavame argumentot item

  const button = createButton("remove-item btn-link text-red");
  li.appendChild(button);

  // Add li to the DOM
  itemList.appendChild(li);
}

function createButton(classes) {
  const button = document.createElement("button");
  button.className = classes;
  const icon = createIcon("fa-solid fa-xmark");
  button.appendChild(icon);
  return button;
}

function createIcon(classes) {
  const icon = document.createElement("i");
  icon.className = classes;
  return icon;
}

// Kreirame f-cija za Locale Storage
function addItemToStorage(item) {
  let itemsFromStorage = getItemsFromStorage();

  //Add new item to array
  itemsFromStorage.push(item); // dodavame novi item vo LocalStorage

  // Convert to JSON string and set to local storage
  localStorage.setItem("items", JSON.stringify(itemsFromStorage));
}

// kreirame f-cija za da gi prikazeme items from local storage
function getItemsFromStorage() {
  let itemsFromStorage;

  if (localStorage.getItem("items") === null) {
    itemsFromStorage = [];
  } else {
    itemsFromStorage = JSON.parse(localStorage.getItem("items"));
  }
  return itemsFromStorage;
}

function onClickItem(e) {
  if (e.target.parentElement.classList.contains("remove-item")) {
    removeItem(e.target.parentElement.parentElement); //  ova f-cionira samo ako klikneme na <i> tagot x
  } else {
    // ova ke se odnesuva ako klikneme bilo kade vo <li> tagot osem na x
    // console.log(1); // 1
    setItemToEdit(e.target); // e.target e li tagot
  }
}

function checkIfItemExists(item) {
  const itemsFromStorage = getItemsFromStorage();
  return itemsFromStorage.includes(item);
}

function setItemToEdit(item) {
  isEditMode = true;

  itemList
    .querySelectorAll("li")
    .forEach((i) => i.classList.remove("edit-mode")); // ova go pravime za da se promeni color
  //samo na tekstot od ona li kade editirame. Ako sme kliknale na edno li za da editirame i klikneme na drugo prvoto da ja vrati svojata boja.

  // item.style.color = "#ccc"; // koga ke klikneme na li za editiranje bojata na tekstot da stane posvetla. Vaka ja menuvame direktno vo JS
  item.classList.add("edit-mode"); //vaka ja menuvame bojata ako imame klasa vo css
  formBtn.innerHTML = '<i class="fa-solid fa-pen"></i> Update Item';
  formBtn.style.backgroundColor = "#228B22";
  itemInput.value = item.textContent; // vo input tagot se postavuva tekstot od li na koj sme kliknale
}

function removeItem(item) {
  if (confirm("Are you sure?")) {
    // Remove item from DOM
    item.remove();

    //Remove item from storage
    removeItemFromStorage(item.textContent);

    checkUI();
  }
}

function removeItemFromStorage(item) {
  let itemsFromStorage = getItemsFromStorage();
  console.log(itemsFromStorage);

  // Filter out item to be removed
  itemsFromStorage = itemsFromStorage.filter((i) => i !== item);

  // Re-set to localstorage
  localStorage.setItem("items", JSON.stringify(itemsFromStorage));
}

function clearItems() {
  // console.log("works");  // works
  // Moze da go koristime slednoto
  // itemList.innerHTML = "";
  // Podobro e da se koristi slednoto:
  while (itemList.firstChild) {
    itemList.removeChild(itemList.firstChild);
  }

  // Clear from localStorage
  localStorage.removeItem("items");

  checkUI(); // koga gi briseme site items so clearBtn mora da se proveri za da ne se prikazuva Clear All btn i Filter
}

function filterItems(e) {
  const items = itemList.querySelectorAll("li");
  /*  items e NodeList zatoa sto selektirame so querySelector i moze da se 
  koristi forEach loop. Ako koristevme selectByTagName ke dobievme HTMLCollection i ke trebase na loop-ot da mu napravime 
  wrapp vo Array.from(items.forEach(item)) */
  const text = e.target.value.toLowerCase();
  // console.log(text); // ona sto go pisuvame vo Filter Items go dava vo console

  items.forEach((item) => {
    // console.log(item); // vo console gi prikazuva site <li> tagovi
    // Od item ni treba firstChild koj e TextNode
    const itemName = item.firstChild.textContent.toLowerCase(); // go stavame textContent za da iminjata ne se vo navodnici
    // console.log(itemName); // gi dobivame tekstovite koi se vo <li> Apples Orenage Juice Eggs...
    /* treba da gi sporedime text i itemName. Toa ke go napravime so if statement vo koj ke koristime itemName.indexOf(text)
    Ako nekoja bukva od text koj go vnesuvame vo Filter Items se sovpaga vo itemName indexOf ke dade true, a ako ne se 
    sovpaga dava -1 */
    if (itemName.indexOf(text) != -1) {
      // console.log(true); // ako vo Filter stavime a ke dobieme 2 true i 3 false zosto vo tri item nema a itn.
      item.style.display = "flex";
    } else {
      // console.log(false);
      item.style.display = "none";
    }
  });
}

//kreirame f-cija vo koja ke napravime deka ako nema li t.e. items da ne se prikazuvaat Filter Items i Clear All button.
function checkUI() {
  itemInput.value = "";

  // console.log(items); // ova ke dava length: 0 ako const items e vo global scope. Zatoa go stavame tuka vo f-cijata
  const items = itemList.querySelectorAll("li"); // od global scope go premestivme vo f-cijata
  if (items.length === 0) {
    clearBtn.style.display = "none";
    itemFilter.style.display = "none";
  } else {
    clearBtn.style.display = "block";
    itemFilter.style.display = "block";
  }
  // posle editiranje na nekoj item go vrakame button od Update Item na Add Item
  formBtn.innerHTML = '<i class="fa-solid fa-xmark"></i> Add Item';
  formBtn.style.backgroundColor = "#333";

  isEditMode = false;
}

//Site events koi se vo global scope gi stavame vo init()

function init() {
  // Event Listeners
  itemForm.addEventListener("submit", onAddItemSubmit); // imeto na f-cijata addItem go menuvame vo onAddItemSubmit zosto ke zacuvame vo DOM i vo LocalStorage
  itemList.addEventListener("click", onClickItem); // removeItem go zamenuvameso onClickitem zatoa sto pokraj klik na x za remove
  // ke imame i klik na li za edit na item
  clearBtn.addEventListener("click", clearItems);
  itemFilter.addEventListener("input", filterItems); // moze da se koristi i key, keydown i keyuper
  document.addEventListener("DOMContentLoaded", displayItems); // ovaa f-cija treba da bide prva

  checkUI(); // ako tuka ja povikuvame f-cijata taa ke se izvrsuva samo koga page loads. Nema da se izvrsuva koga vnesuvame items.
  //Zatoa ke mora da ja povikuvame i koga creirame li za da Clear All i Filter se prikazat povtorno.
}

init();
