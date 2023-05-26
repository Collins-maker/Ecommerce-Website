const all_products_container=document.getElementById("all_products");
const popup_pro_container = document.createElement('div');
popup_pro_container.classList.add('popup_pro_container');
// const all_products=[];

//create product card for each product using the product details...
function createProductCard(product){
    const img=document.createElement("img");
    img.setAttribute("src", product.image);

    const product_title=document.createElement("h4");
    product_title.innerText=product.title;
    
    const category=document.createElement("span")
    category.innerText=product.category;

    const price=document.createElement("p");
    price.innerHTML=`price: <span>$${product.price}</span>` ;

    const add_to_cart_button =document.createElement("button")
    add_to_cart_button.innerText="Add to Cart";
    add_to_cart_button.classList.add("add_to_cart");

    const view_product_button =document.createElement("button");
    view_product_button.innerText="view product";
    view_product_button.classList.add("view_product")


    const product_card=document.createElement("div");
    product_card.classList.add("product");

    product_card.append(img, product_title, category, price, add_to_cart_button, view_product_button);

    //Adding event listener to handle add to cart click event
    add_to_cart_button.addEventListener("click", () =>{
        addToCart(product.id);
    });

     

    view_product_button.addEventListener("click", () =>{
      showProductDetails(product);
  });
    return product_card 
  
}

// Show product details in a pop-up screen
async function showProductDetails(product) {
  const productDetails = await fetch(`${base_url}/${product.id}`);
  const productData = await productDetails.json();

  const popup_pro_content = document.createElement('div');
  popup_pro_content.classList.add('popup_pro_content');

  const closeButton = document.createElement('button');
  closeButton.innerText = 'Close';
  closeButton.classList.add('close-button');

  const img = document.createElement('img');
  img.setAttribute('src', productData.image);

  const title = document.createElement('h4');
  title.innerText = productData.title;

  const category = document.createElement('p');
  category.innerText = `Category: ${productData.category}`;

  const price = document.createElement('p');
  price.innerText = `Price: $${productData.price}`;

  const description = document.createElement('p');
  description.innerText = `Description: ${productData.description}`;

  const productId = document.createElement('p');
  productId.innerText = `Product ID: ${productData.id}`;

  popup_pro_content.append(closeButton, img, title, category, price, description, productId);
  popup_pro_container.innerHTML = '';
  popup_pro_container.appendChild(popup_pro_content);
  document.body.appendChild(popup_pro_container);

  closeButton.addEventListener('click', () => {
    document.body.removeChild(popup_pro_container);
  });
}





const base_url = "https://fakestoreapi.com/products"

async function getAllProducts(){
    try {
        let result= await fetch(base_url);
        let all_products= await result.json();
        return all_products;
    } catch (error) {
        console.log(error)  
    }
    console.log("Method getAllproducts executed");
}

let all_products=[];
async function mountAllProducts(){

    all_products=await getAllProducts();

   if (all_products && all_products.length> 0) {
    let product_cards=all_products.map(product=>createProductCard(product));
    all_products_container.append(...product_cards);
    
   }
   else {
    const errorElement=document.createElement("h4")
    errorElement.innerText="No products found";
    errorElement.style.color="red";
    product_container.appendChild(errorElement);
   }
   console.log("mountAllProducts executed");
}



//create a cart container
const cartIcon = document.querySelector('.fa-cart-arrow-down');

const cartItemCount = document.querySelector('.cart small');
const cartContainer = document.createElement('div');
cartContainer.classList.add('cart-container');

//add ivent listiner to cart icon
cartIcon.addEventListener('click', showCartPopup);


// Add the cart container to the document body
document.body.appendChild(cartContainer);

// Create a cart for product arrays
let cart = [];

// Retrieve cart data from local storage, if available
const storedCart = localStorage.getItem('cart');
if (storedCart) {
  cart = JSON.parse(storedCart);
}

// ...

// Add to Cart function
function addToCart(productId) {
  const existingProduct = cart.find(item => item.id === productId);

  if (existingProduct) {
    existingProduct.quantity += 1;
  } else {
    const product = all_products.find(item => item.id === productId);
    if (product) {
      cart.push({
        id: product.id,
        title: product.title,
        price: product.price,
        quantity: 1
      });
    }
  }

  // Update the cart data in local storage
  localStorage.setItem('cart', JSON.stringify(cart));

  // Update the cart display
  updateCartDisplay();

  console.log("added to cart");
}

// ...

// Update cart display
function updateCartDisplay() {
  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
  cartItemCount.textContent = itemCount;
}


// updateCartDisplay();


// Show cart pop-up function
function showCartPopup() {
  const popupContainer = document.createElement('div');
  popupContainer.classList.add('popup-container');

  const closeButton = document.createElement('button');
  closeButton.innerText = 'Close';
  closeButton.classList.add('close-button');

  const cartItemsContainer = document.createElement('div');
  cartItemsContainer.classList.add('cart-items-container');

  // Retrieve the cart data from local storage
  const storedCart = localStorage.getItem('cart');

  if (storedCart) {
    const cartItems = JSON.parse(storedCart);

    if (cartItems.length > 0) {
      // Iterate over the cart items and create a display for each item
      cartItems.forEach(item => {
        const product = all_products.find(product => product.id === item.id);

        if (product) {
          const cartItem = document.createElement('div');
          cartItem.classList.add('cart-item');

          const img = document.createElement('img');
          img.setAttribute('src', product.image);

          const title = document.createElement('h4');
          title.innerText = product.title;

          const price = document.createElement('p');
          price.innerHTML = `Price: <span>$${product.price}</span>`;

          const quantity = document.createElement('p');
          quantity.innerText = `Quantity: ${item.quantity}`;

          const incrementButton = document.createElement('button');
          incrementButton.innerText = '+';
          incrementButton.classList.add('increment-button');

          const decrementButton = document.createElement('button');
          decrementButton.innerText = '-';
          decrementButton.classList.add('decrement-button');

          const removeButton = document.createElement('button');
          removeButton.innerText = 'Remove';
          removeButton.classList.add('remove-button');

          // Add event listener to the increment button
          incrementButton.addEventListener('click', () => {
            incrementCartItem(item.id);
          });

          // Add event listener to the decrement button
          decrementButton.addEventListener('click', () => {
            decrementCartItem(item.id);
          });

          // Add event listener to the remove button
          removeButton.addEventListener('click', () => {
            removeCartItem(item.id);
          });

          cartItem.append(img, title, price, quantity, incrementButton, decrementButton, removeButton);
          cartItemsContainer.appendChild(cartItem);
        }
      });
    } else {
      // Handle the case when the cart is empty
      const emptyCartMessage = document.createElement('p');
      emptyCartMessage.innerText = 'Cart is empty';
      cartItemsContainer.appendChild(emptyCartMessage);
    }
  } else {
    // Handle the case when the cart is empty
    const emptyCartMessage = document.createElement('p');
    emptyCartMessage.innerText = 'Cart is empty';
    cartItemsContainer.appendChild(emptyCartMessage);
  }

  popupContainer.appendChild(closeButton);
  popupContainer.appendChild(cartItemsContainer);

  document.body.appendChild(popupContainer);

  closeButton.addEventListener('click', () => {
    document.body.removeChild(popupContainer);
  });
}

// Increment cart item quantity
function incrementCartItem(productId) {
  const cartItem = cart.find(item => item.id === productId);

  if (cartItem) {
    cartItem.quantity += 1;
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
    
  }
}

// Decrement cart item quantity
function decrementCartItem(productId) {
  const cartItem = cart.find(item => item.id === productId);

  if (cartItem) {
    if (cartItem.quantity > 1) {
      cartItem.quantity -= 1;
      localStorage.setItem('cart', JSON.stringify(cart));
    } else {
      // If the quantity becomes 0 or negative, remove the item from the cart
      removeCartItem(productId);
      return;
    }

    updateCartDisplay();
    
  }
}

// Remove cart item
function removeCartItem(productId) {
  const cartItemIndex = cart.findIndex(item => item.id === productId);

  if (cartItemIndex !== -1) {
    cart.splice(cartItemIndex, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
    // showCartPopup(); // Update the cart display after removing item
  }
}

///category function
// Get unique categories from all products
function getUniqueCategories() {
  const categories = all_products.map(product => product.category);
  return [...new Set(categories)];
}

// Create category tab
function createCategoryTab() {
  const categoryTab = document.createElement('div');
  categoryTab.classList.add('category-tab');

  const categoryList = document.createElement('ul');
  categoryList.classList.add('category-list');

  // Add "All" category option
  const allCategoryOption = document.createElement('li');
  allCategoryOption.innerText = 'All';
  allCategoryOption.addEventListener('click', () => filterProductsByCategory(null));
  categoryList.appendChild(allCategoryOption);

  // Add individual category options
  const uniqueCategories = getUniqueCategories();
  uniqueCategories.forEach(category => {
    const categoryOption = document.createElement('li');
    categoryOption.innerText = category;
    categoryOption.addEventListener('click', () => filterProductsByCategory(category));
    categoryList.appendChild(categoryOption);
  });

  categoryTab.appendChild(categoryList);
  document.body.appendChild(categoryTab);
}





// Function to fetch all available categories
async function getAllCategories() {
  try {
    const response = await fetch(`${base_url}/categories`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    return [];
  }
}

// Function to filter products by category
function filterProductsByCategory(category) {
  const filteredProducts = all_products.filter(product => {
    if (category === '') {
      return true; // Show all products when no category is selected
    } else {
      return product.category === category;
    }
  });

  // Clear existing products from the container
  all_products_container.innerHTML = '';

  if (filteredProducts.length > 0) {
    const productCards = filteredProducts.map(product => createProductCard(product));
    all_products_container.append(...productCards);
  } else {
    const noProductsMessage = document.createElement('h4');
    noProductsMessage.innerText = 'No products found in the selected category';
    all_products_container.appendChild(noProductsMessage);
  }
}

// Async function to create the category filter select options
async function createCategoryFilterSelect() {
  const categoryFilterContainer = document.createElement('div');
  categoryFilterContainer.classList.add('category-filter-container');

  const categoryFilterLabel = document.createElement('label');
  categoryFilterLabel.setAttribute('for', 'category-filter');
  categoryFilterLabel.textContent = 'Filter by Category: ';
  categoryFilterContainer.appendChild(categoryFilterLabel);

  const categoryFilterSelect = document.createElement('select');
  categoryFilterSelect.setAttribute('id', 'category-filter');

  // Fetch all available categories
  const categories = await getAllCategories();

  // Add "All" category option
  const allCategoryOption = document.createElement('option');
  allCategoryOption.value = '';
  allCategoryOption.textContent = 'All';
  categoryFilterSelect.appendChild(allCategoryOption);

  // Add individual category options
  categories.forEach(category => {
    const categoryOption = document.createElement('option');
    categoryOption.value = category;
    categoryOption.textContent = category;
    categoryFilterSelect.appendChild(categoryOption);
  });

  // Add event listener to filter products when option is selected
  categoryFilterSelect.addEventListener('change', (event) => {
    const selectedCategory = event.target.value;
    filterProductsByCategory(selectedCategory);
  });

  categoryFilterContainer.appendChild(categoryFilterSelect);

  document.body.insertBefore(categoryFilterContainer, document.body.firstChild);
}




// Call the createCategoryFilterSelect function to generate the category filter select options
createCategoryFilterSelect();



  
mountAllProducts();

// Call the createCategoryTab function to generate the category tab
// createCategoryTab();