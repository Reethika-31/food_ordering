let buttonsElements = [];
let cart = [];
const cartItems = document.querySelector(".nav-cart");
const cartOverlay = document.querySelector(".cart-overlay");
const cartWindowClose = document.querySelector(".btn-close-cart");
const clearCartBtn = document.querySelector(".btn-clear-cart");

const cartContent = document.querySelector(".cart-content");
class Products {

  async getAllProducts() {
    try {
      let result = await fetch("https://www.app.tutorjoes.in/mobile/getAllFood");
      let data = await result.json();
      let products = data.items;
      products = products.map(item => {
        const { ID, NAME, PIC, SHOP, AMT, FTYPE, LATEST } = item;
        return { ID, NAME, PIC, SHOP, AMT, FTYPE, LATEST };
      });
      return (products);
    } catch (err) {
      console.log(err);
    }

  }

  latestProducts() {
    try {

      let products = Storage.getAllProducts();
      //console.log(products);
      const latestPros = products.filter((product) => {
        return product.LATEST == "Yes";
      });
      //console.table(latestPros);
      return latestPros;
    } catch (err) {
      console.log(err);
    }
  }

  loadProductsByType(type) {
    try {

      let products = Storage.getAllProducts();
      const selectProducts = products.filter((product) => {
        return product.FTYPE == type;
      });
      return selectProducts;
    } catch (err) {
      console.log(err);
    }
  }

  loadProductUserInterFace(products, title) {
    try {


      let result = '';
      let fav_products = Storage.getFavLocal();
      let active = "";
      products.forEach(product => {
        active = fav_products.includes(product.ID) ? "active" : "";
        result += `
       <div class="product">
                  <div class="img-container">
                      <img src="https://www.app.tutorjoes.in/img/food/${product.PIC}" alt="${product.NAME}" class="product-img" />
                  </div>
                    <h3>${product.NAME}</h3>
                    <h4>${product.SHOP}</h4>
                    <h5><span>${product.FTYPE}</span> Rs.${product.AMT}</h5>
                    <button class="btn-item" data-id="${product.ID}">
                      <i class="fa fa-shopping-cart"></i>
                      add to cart
                    </button>
                    <button class="btn-fav fa fa-heart ${active}"  data-id="${product.ID}"></button>
              </div>
       `;


      });
      const productsDOM = document.querySelector(".products-container");
      const titleDOM = document.getElementById("txtFoodType");
      productsDOM.innerHTML = result;
      titleDOM.innerHTML = title;

    } catch (err) {
      console.log(err);
    }
  }

  loadFavProducts(fids) {
    try {

      let products = Storage.getAllProducts();
      const selectProducts = products.filter((product) => {
        if (fids.includes(product.ID)) {
          return product;
        }
      });
      return selectProducts;
    } catch (err) {
      console.log(err);
    }
  }

  cartAction() {
    let buttons = [...document.querySelectorAll(".btn-item")];
    buttonsElements = buttons;
    //console.log(buttonsElements);
    buttons.forEach(button => {
      let id = button.dataset.id;
      //console.log(id);
      let inCart = cart.find(item => item.ID === id);
      if (inCart) {
        button.innerText = "In Cart";
        button.disabled = true;
      }

      button.addEventListener("click", event => {
        // disable button
        event.target.innerText = "In Cart";
        event.target.disabled = true;
        // add to cart
        let cartItem = { ...Storage.getProductById(id), QTY: 1 };
        cart = [...cart, cartItem];
        Storage.saveCart(cart);
        this.setCartValues(cart);
        this.addCartItem(cartItem);
        this.showCart();
      });

    });
  }

  setCartValues(cart) {
    let tempTotal = 0;
    let itemsTotal = 0;
    cart.map(item => {
      tempTotal += item.AMT * item.QTY;
      itemsTotal += item.QTY;
    });

    const cartItems = document.querySelector(".cart-items");
    const cartTotal = document.querySelector(".cart-total");

    cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
    cartItems.innerText = itemsTotal;
  }


  addCartItem(item) {
    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `<!-- cart item -->
            <!-- item image -->
            <img src=https://www.app.tutorjoes.in/img/food/${item.PIC} alt="product" />
            <!-- item info -->
            <div>
              <h4>${item.NAME}</h4>
              <h5>Rs.${item.AMT}</h5>
              <span class="remove-item" data-id=${item.ID}>remove</span>
            </div>
            <!-- item functionality -->
            <div>
                <i class="fa fa-plus" data-id=${item.ID}></i>
              <p class="item-amount">
                ${item.QTY}
              </p>
                <i class="fa fa-minus" data-id=${item.ID}></i>
            </div>
          <!-- cart item -->
    `;
    cartContent.appendChild(div);
  }

  showCart() {
    cartOverlay.classList.add("cart-overlay-show");
  }

  init() {
    clearCartBtn.addEventListener("click", () => {
      this.clearCart();
    });

    cartItems.addEventListener('click', () => {
      cartOverlay.classList.add("cart-overlay-show");
    });

    cartWindowClose.addEventListener('click', () => {
      cartOverlay.classList.remove("cart-overlay-show");
    });

    cartContent.addEventListener("click", event => {
      if (event.target.classList.contains("remove-item")) {
        let removeItem = event.target;
        let id = removeItem.dataset.id;
        cartContent.removeChild(removeItem.parentElement.parentElement);
        // remove item
        this.removeItem(id);
      } else if (event.target.classList.contains("fa-plus")) {
        let addAmount = event.target;
        let id = addAmount.dataset.id;
        let tempItem = cart.find(item => item.ID === id);
        tempItem.QTY = tempItem.QTY + 1;
        Storage.saveCart(cart);
        this.setCartValues(cart);
        addAmount.nextElementSibling.innerText = tempItem.QTY;
      } else if (event.target.classList.contains("fa-minus")) {
        let lowerAmount = event.target;
        let id = lowerAmount.dataset.id;
        let tempItem = cart.find(item => item.ID === id);
        tempItem.QTY = tempItem.QTY - 1;
        if (tempItem.QTY > 0) {
          Storage.saveCart(cart);
          this.setCartValues(cart);
          lowerAmount.previousElementSibling.innerText = tempItem.QTY;
        } else {
          cartContent.removeChild(lowerAmount.parentElement.parentElement);
          this.removeItem(id);
        }
      }
    });

  }

  clearCart() {
    // console.log(this);
    let cartItems = cart.map(item => item.ID);
    //console.log(cartItems);
    cartItems.forEach(ID => this.removeItem(ID));
    //console.log(cartContent.children.length);
    while (cartContent.children.length > 0) {
      cartContent.removeChild(cartContent.children[0]);
    }
    cartOverlay.classList.remove("cart-overlay-show");
  }


  removeItem(id) {
    cart = cart.filter(item => item.ID !== id);
    this.setCartValues(cart);
    Storage.saveCart(cart);
    let button = this.getSingleButton(id);
    button.disabled = false;
    button.innerHTML = `<i class="fa fa-shopping-cart"></i> Add To Cart`;

  }
  getSingleButton(id) {
    return buttonsElements.find(button => button.dataset.id === id);
  }


}

class Storage {
  static saveAllProducts(products) {
    localStorage.setItem("products", JSON.stringify(products));
  }

  static getAllProducts() {
    let products = JSON.parse(localStorage.getItem("products"));
    return products;
  }

  static getProductById(id) {
    let products = JSON.parse(localStorage.getItem("products"));
    return products.find(product => product.ID === id);
  }
  static addFav(id) {
    const fids = this.getFavLocal();
    if (fids.indexOf(id) !== -1) {
      alert("Already Added..!");
    }
    else {
      localStorage.setItem("fav-ids", JSON.stringify([...fids, id]));
    }
  }

  static removeFav(fid) {
    const fids = this.getFavLocal();
    localStorage.setItem(
      "fav-ids",
      JSON.stringify(fids.filter((id) => id !== fid))
    );
  }

  static getFavLocal() {
    const favIds = JSON.parse(localStorage.getItem("fav-ids"));
    return favIds === null ? [] : favIds;

  }

  static saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }
  static getCart() {
    return localStorage.getItem("cart")
      ? JSON.parse(localStorage.getItem("cart"))
      : [];
  }

}

document.addEventListener("DOMContentLoaded", () => {

  const productObj = new Products();
  //Get all PRoducts
  //products.getAllProducts().then(data => console.log(data));  //Check

  productObj.init();

  const menu_container = document.querySelector(".menu-item");
  const product_container = document.querySelector(".products-container");



  //console.log(menu_container);
  productObj.getAllProducts().then(products => {
    Storage.saveAllProducts(products);
  }).then(() => {
    latest_products = productObj.latestProducts();
    productObj.loadProductUserInterFace(latest_products, "Latest Products");
    productObj.cartAction();


    // Menu Bar Coding
    menu_container.addEventListener("click", event => {
      if (event.target.classList.contains("menu")) {
        let selectMenu = event.target;
        if (selectMenu.dataset.id == "latest") {
          latest_products = productObj.latestProducts();
          productObj.loadProductUserInterFace(latest_products, "Latest Products");
        }
        else if (selectMenu.dataset.id == "fav") {
          fav_products = productObj.loadFavProducts(Storage.getFavLocal());
          productObj.loadProductUserInterFace(fav_products, "Fav Products");
        }
        else {
          menu_products = productObj.loadProductsByType(selectMenu.dataset.id);
          productObj.loadProductUserInterFace(menu_products, selectMenu.dataset.title);
        }
      }
      //Cart Actiom
      productObj.cartAction();

    });

    //Fav Items Selection

    product_container.addEventListener("click", event => {
      if (event.target.classList.contains("btn-fav")) {
        let selectButton = event.target;
        //console.log(selectButton.dataset.id);
        if (selectButton.classList.contains("active")) {
          Storage.removeFav(selectButton.dataset.id);
          selectButton.classList.remove("active");
        } else {
          Storage.addFav(selectButton.dataset.id);
          selectButton.classList.add("active");
        }
      }
    });

  });

});