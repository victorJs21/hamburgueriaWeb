const menu = document.getElementById("menu")
const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartItemsContainer = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const checkoutBtn = document.getElementById("checkout-btn")
const closeModalBtn = document.getElementById("close-modal-btn")
const cartCounter = document.getElementById("cart-count")
const addressInput = document.getElementById("address")
const addressWarn = document.getElementById("address-warn")


let cart = [];

//abrir o modal
cartBtn.addEventListener("click", function() {
    cartModal.style.display = "flex"
    updateCartModal();
})

//Fechar o modal quando clicar fora
cartModal.addEventListener("click", function(event){
   if(event.target === cartModal){
    cartModal.style.display = "none"
   }
}) 

closeModalBtn.addEventListener("click", function(){
    cartModal.style.display = "none"
})

menu.addEventListener("click", function(event) {
    //console.log(event.target)

    let parentButton = event.target.closest(".add-to-cart-btn")
    //console.log(parentButton)
    if(parentButton){
      const nome =  parentButton.getAttribute("data-name")
       const price = parseFloat(parentButton.getAttribute("data-price"))
        addToCart(nome,price)
      
    }
 
    
})

//Função add no carrinho
function addToCart(nome,price){
const exeistingItem = cart.find(item => item.nome === nome)

    if(exeistingItem){
        //se o item jé exciste AUMENTA a quantidade + 1
        exeistingItem.quantity += 1.
        console.log(exeistingItem)

    }else{

        cart.push({
            nome, 
            price,
            quantity: 1,
        });

    }

    updateCartModal()
}

//atualiza o carrinho
function updateCartModal(){
    cartItemsContainer.innerHTML=""
    let total = 0;

    cart.forEach(item =>{
      const cartItemElement = document.createElement("div");
    cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col")

    cartItemElement.innerHTML = `  
      <div class="flex items-center justify-between">
        <div>
        <p class="font-medium">${item.nome}
        <p>Qtd: ${item.quantity}
        <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}     
    </div>

    <div>
        <button class="remove-from-cart-btn" data-nome="${item.nome}">
            remover
        </button>
     </div>
    </div>
      ` 
        total += item.price * item.quantity;

      cartItemsContainer.appendChild(cartItemElement)
    
    })

    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    cartCounter.innerHTML = cart.length;
}


// FUNÇÃO PARA REMOVER ITENS DO CARRINHO
cartItemsContainer.addEventListener("click", function(event){
    if(event.target.classList.contains("remove-from-cart-btn")){
        const nome = event.target.getAttribute("data-nome")
  
        removeItemCart(nome);

    }

})

function removeItemCart(nome){
    const index = cart.findIndex(item => item.nome === nome);

    if(index !== -1 ){
    const item = cart[index];
    

    if(item.quantity > 1){
        item.quantity -= 1;
        updateCartModal();
        return;
    }

    cart.splice(index, 1);
    updateCartModal();
    }


}


addressInput.addEventListener("input", function(event){
    let inputValue = event.target.value;

    if(inputValue !== ""){
        addressInput.classList.remove("border-red-500")
        addressWarn.classList.add("hidden")
    }
    
    //

})

checkoutBtn.addEventListener("click", function(){

    const isOpen = checkRestaurantOpen();
    if(!isOpen){
        
        Toastify({
  text: "Ops o restaurante está fechado!",
  duration: 3000,
  close: true,
  gravity: "top", // `top` or `bottom`
  position: "right", // `left`, `center` or `right`
  stopOnFocus: true, // Prevents dismissing of toast on hover
  style: {
    background:" #e2266ed7", 
     },
    }).showToast();

    return;
    }

    if(cart.length === 0) return;
    if(addressInput.value === ""){
        addressWarn.classList.remove("hidden")
        addressInput.classList.add("border-red-500")
        return;
    }

// enviar para API do whats
    const cartItems = cart.map((item)=>{
        return(
            ` ${item.nome} Quantidade: (${item.quantity}) Preço: R$${item.price} |`
        )
    }).join("")
    
    const message = encodeURIComponent(cartItems)
    const phone ="+5522992330986"

    window.open(`https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`, "_blank")

    cart =[];
    updateCartModal();
})

//Verificar Horario
function checkRestaurantOpen(){
    const data = new Date();
    const hora = data.getHours();
    
    return hora >= 19 || hora < 2//TRUE
}

const spanItem = document.getElementById("date-span")
const isOpen= checkRestaurantOpen()

if(isOpen){
spanItem.classList.remove("bg-red-500")
spanItem.classList.add("bg-green-600")
}else{
    spanItem.classList.remove("bg-green-600")
    spanItem.classList.add("bg-red-500")
}