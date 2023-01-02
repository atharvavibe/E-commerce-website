
const parentNode = document.getElementById('music-content');
const displayPagination =  document.getElementById('pagination')
var currentPage = 1
const limit = 3




window.addEventListener('DOMContentLoaded', () => {
    console.log('loaded')
    const page = 1
    axios.get(`http://localhost:3000/admin/products?page=${page}`).then((data) => {
     const products = data.data.data 
     showPagination(products)
    })
});

function showPagination(products){
    currentPage--;
   
   console.log( products)
   const totalItems = products.length
   let start = limit * currentPage
   let end = start + limit
   let paginatedItems = products.slice(start, end)
   

 const parentSection = document.getElementById('products');
 paginatedItems.forEach(product => {
    const productHtml = `
    <div id="album-${product.id}" class="secondary-container">
    <div class="image-container">
        <h3 class="prod-title">${product.title}</h3>
            <img class="prod-images" src=${product.imageUrl} alt="">
                        <div class="prod-details">
            <span class="price-tag">$${product.price}</span>
            <button class="shop-item-button" type='button'>ADD TO CART</button>
        </div>
    </div>`
 parentSection.innerHTML += productHtml
}); 

 setupPagination(products, displayPagination, limit)
}
 

function setupPagination(items, wrapper, limit){
    wrapper.innerText= "";
    console.log(displayPagination)

    var page_count = Math.ceil(items.length / limit)
    for(var i = 1; i<=page_count; i++){
       var btn = paginationBtn(i, items);
       wrapper.appendChild(btn)
    }
}

function paginationBtn(page, items){
    console.log(page)
    var button = document.createElement('button')
    button.classList.add("pageNo")
    button.innerText = page

    if(currentPage == page) button.classList.add('active')

    button.addEventListener('click', function (){
        currentPage = page
        showPagination(items)
    })

    return button
}

// function listProduct(data){
//     if(data.request.status === 200){
//         const products = data.data.data;
//         // console.log(products.length, products)
//         // const pageCount = Math.ceil(products.length/limit)
//         // let currentPage;
//         const url = window.location.href;
//         // const parentSection = document.getElementById('products');
//         // products.forEach(product => {
//         //     const productHtml = `
//         //     <div id="album-${product.id}" class="secondary-container">
//         //     <div class="image-container">
//         //         <h3 class="prod-title">${product.title}</h3>
//         //             <img class="prod-images" src=${product.imageUrl} alt="">
//         //                         <div class="prod-details">
//         //             <span class="price-tag">$${product.price}</span>
//         //             <button class="shop-item-button" type='button'>ADD TO CART</button>
//         //         </div>
//         //     </div>`
//         // parentSection.innerHTML += productHtml
//         // }); 
//     }
// }

document.addEventListener('click', e => {
 
          if(e.target.className == 'cart-bottom-btn' || e.target.className =='cart-holder'){
            document.querySelector('#cart').style = "display:block";
          }

          if (e.target.className=='cancel'){
            document.querySelector('#cart').style = "display:none;"
        }

        if(e.target.className == 'shop-item-button'){
            const prodId = Number(e.target.parentNode.parentNode.id.split('-')[1]);
         axios.post('http://localhost:3000/cart', { productId: prodId}).then(data => {
            if(data.data.error){
                throw new Error('Unable to add product');
            }
            showNotification(data.data.data, false);
        })
        .catch(err => {
            console.log(err);
            showNotification(err, true);
        });
            var btn = e.target;
            var shopItem = btn.parentElement.parentElement;
            var title = shopItem.getElementsByClassName('prod-title')[0].innerText;
            var  price = shopItem.getElementsByClassName('price-tag')[0].innerText;
            var imageSrc = shopItem.getElementsByClassName('prod-images')[0].src;
            addItemToCart(title, price, imageSrc);
            updateCartTotal();
        }
        
        if(e.target.className == 'btn btn-danger'){
            var buttonClicked = e.target;
            buttonClicked.parentElement.parentElement.remove();
            updateCartTotal();
        }
      



});




function addItemToCart(title, price, imageSrc){
    var cartRow = document.createElement('div');
        cartRow.classList.add('cart-row');
        var cartItems = document.getElementsByClassName('cart-items')[0];
        cartItemNames = cartItems.getElementsByClassName('cart-item-title')
        for(var i =0; i < cartItemNames.length; i++){
            if(cartItemNames[i].innerText == title){
                alert("This item is already added to cart");
                return
            }
        }
    
        var cartRowContents = `<div class="cart-item cart-column">
        <img class="cart-item-image"
            src="${imageSrc}" width="100"
            height="100">
        <span class="cart-item-title">${title}</span>
        </div>
        <span class="cart-price cart-column">${price}</span>
       <div class="cart-quantity cart-column">
        <input class="cart-quantity-input" type="number" value="1">
        <button class="btn btn-danger" type="button">REMOVE</button>




      </div>`
        cartRow.innerHTML = cartRowContents;
        cartItems.append(cartRow);
        // cartRow.getElementsByClassName('btn-danger')[0].addEventListener('click', removeCartItem);
        cartRow.getElementsByClassName('cart-quantity-input')[0].addEventListener('change',quantityChanged);
    
}

function showNotification(message, iserror){
    const container = document.getElementById('container');
    const notification = document.createElement('div');
    notification.style.backgroundColor = iserror ? 'red' : 'green';
    notification.classList.add('notification');
    notification.innerHTML = `<h4>Added to cart<h4>`;
    container.appendChild(notification);
    setTimeout(()=>{
        notification.remove();
    },2500)
}

function updateCartTotal(){
        var cartItemContainer = document.getElementsByClassName('cart-items')[0];
        // console.log(cartItemContainer);
        var cartRows = cartItemContainer.getElementsByClassName('cart-row');
        // console.log(cartRows);
        var total = 0;
        for(var i=0 ; i< cartRows.length; i++){
            var cartRow = cartRows[i];
            // console.log(cartRows.length);
            var priceElement = cartRow.getElementsByClassName('cart-price')[0];
            // console.log(priceElement);
            var quantityElement = cartRow.getElementsByClassName('cart-quantity-input')[0];
            // console.log(quantityElement);
            var price = parseFloat(priceElement.innerText.replace('$', ''));
            // console.log(price);
            var quantity = quantityElement.value;
            // console.log(quantity);
            var cartQuantity = document.getElementById('cartQuantity');
            total = total + price * quantity;
            cartQuantity.innerText = cartRows.length;
        }
         total = Math.round(total*100)/100  // to round off the price to 2 decimal places
    
        document.getElementsByClassName('cart-total-price')[0].innerText = '$' + total;
}
   
function removeCartItem(event){
    var buttonClicked = event.target;
    buttonClicked.parentElement.parentElement.remove();
    updateCartTotal();
}

function quantityChanged(event) {
    var input = event.target
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1
    }
    updateCartTotal()
}