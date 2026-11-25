const products = [
 {id:1,name:"Blue Pen",price:10,img:"https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=400"},
 {id:2,name:"Notebook",price:50,img:"https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=400"},
 {id:3,name:"Pencils",price:5,img:"https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400"},
 {id:4,name:"File Folder",price:30,img:"https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400"},
 {id:5,name:"Geometry Box",price:120,img:"https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400"},
 {id:6,name:"Calculator",price:250,img:"https://images.unsplash.com/photo-1587145820266-a5951ee6f620?w=400"},
 {id:7,name:"Highlighter Set",price:80,img:"https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400"},
 {id:8,name:"Sticky Notes",price:40,img:"https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=400"},
 {id:9,name:"Sketch Book",price:90,img:"https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400"},
 {id:10,name:"Marker Set",price:100,img:"https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400"},
 {id:11,name:"Pencil Pouch",price:70,img:"https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=400"},
 {id:12,name:"Eraser Pack",price:20,img:"https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400"},
 {id:13,name:"Ruler",price:15,img:"https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400"},
 {id:14,name:"Stapler",price:65,img:"https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=400"},
 {id:15,name:"Paper Clips",price:25,img:"https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=400"},
 {id:16,name:"Colour Pencils",price:95,img:"https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400"}
];

let currentUser=JSON.parse(localStorage.getItem("campusUser")||"null");
let orders=JSON.parse(localStorage.getItem("campusOrders")||"[]");
let cart=JSON.parse(localStorage.getItem("campusCart")||"[]");
let wishlist=JSON.parse(localStorage.getItem("campusWish")||"[]");
let pageHistory=[];

// જૂના user નો Cart નવા user ને ન દેખાય
const cartOwner=localStorage.getItem("campusCartOwner");

if(!currentUser || cartOwner!==currentUser.email){
 cart=[];
 wishlist=[];
 localStorage.removeItem("campusCart");
 localStorage.removeItem("campusWish");
 localStorage.removeItem("campusCartOwner");
}

function saveData(){
 localStorage.setItem("campusCart",JSON.stringify(cart));
 localStorage.setItem("campusWish",JSON.stringify(wishlist));
 localStorage.setItem("campusOrders",JSON.stringify(orders));

 if(currentUser){
  localStorage.setItem("campusCartOwner",currentUser.email);
 }
}

function clearShoppingData(){
 cart=[];
 wishlist=[];

 localStorage.removeItem("campusCart");
 localStorage.removeItem("campusWish");
 localStorage.removeItem("campusCartOwner");

 updateCart();
 updateWishlist();
 displayProducts();
 displayNewProducts();
}

function requireLogin(){
 if(!currentUser){
  showPage("login");
  return false;
 }
 return true;
}

function showPage(page){
 if(page!=="login"&&!requireLogin())return;

 const current=document.querySelector(".page.active");
 if(current&&current.id!==page)pageHistory.push(current.id);

 document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"));
 document.getElementById(page).classList.add("active");
 document.getElementById("message").textContent="";

 if(page==="cart")updateCart();
 if(page==="wishlist")updateWishlist();
 if(page==="history")updateHistory();
 if(page==="checkout")updateCheckout();

 window.scrollTo(0,0);
}

function goBack(){
 const previous=pageHistory.pop();

 if(previous&&document.getElementById(previous)){
  document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"));
  document.getElementById(previous).classList.add("active");
 }else{
  showPage("home");
 }

 window.scrollTo(0,0);
}

function notify(text){
 const box=document.getElementById("message");
 box.textContent=text;
 setTimeout(()=>{box.textContent="";},2500);
}

function updateUserArea(){
 const area=document.getElementById("userArea");

 if(currentUser){
  area.innerHTML=`<span class="user-name">Hi, ${currentUser.name}</span>
  <button onclick="logout()">Logout</button>`;
 }else{
  area.innerHTML=`<button onclick="showPage('login')">Login</button>`;
 }
}

function login(){
 const name=document.getElementById("studentName").value.trim();
 const email=document.getElementById("studentEmail").value.trim().toLowerCase();

 if(!name||!email.includes("@")){
  document.getElementById("loginMessage").textContent="Enter a valid name and email.";
  return;
 }

 // દરેક નવા login પર ખાલી Cart અને Wishlist
 cart=[];
 wishlist=[];

 localStorage.removeItem("campusCart");
 localStorage.removeItem("campusWish");
 localStorage.removeItem("campusCartOwner");

 currentUser={name,email};
 localStorage.setItem("campusUser",JSON.stringify(currentUser));

 pageHistory=[];
 updateUserArea();
 updateCart();
 updateWishlist();
 displayProducts();
 displayNewProducts();

 showPage("home");
 notify("Welcome to CampusCart, "+name+"!");
}

function logout(){
 currentUser=null;
 localStorage.removeItem("campusUser");

 clearShoppingData();

 pageHistory=[];
 updateUserArea();

 document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"));
 document.getElementById("login").classList.add("active");

 document.getElementById("studentName").value="";
 document.getElementById("studentEmail").value="";
 document.getElementById("loginMessage").textContent="";
}

function displayProducts(list=products){
 document.getElementById("productList").innerHTML=list.map(p=>{
  const inCart=cart.some(x=>x.id===p.id);
  const inWish=wishlist.some(x=>x.id===p.id);
  const qty=cart.find(x=>x.id===p.id)?.qty||0;

  return `<div class="card">
   <img src="${p.img}" alt="${p.name}">
   <h3>${p.name}</h3>
   <p>Price: ₹${p.price}</p>
   <div class="card-actions">
    <button class="${inCart?'added':''}" onclick="addCart(${p.id})">
     ${inCart?'Added ✓':'Add to Cart'}
    </button>
    <button class="wish-btn" onclick="toggleWish(${p.id})">
     ${inWish?'❤️ Wishlisted':'♡ Wishlist'}
    </button>
   </div>
   ${inCart?`<div class="quantity">
    <button onclick="changeQty(${p.id},-1)">−</button>
    <b>${qty}</b>
    <button onclick="changeQty(${p.id},1)">+</button>
   </div>`:""}
  </div>`;
 }).join("");
}

function displayNewProducts(){
 const area=document.getElementById("newProducts");
 if(!area)return;

 area.innerHTML=products.slice(-4).map(p=>`
  <div class="card">
   <img src="${p.img}" alt="${p.name}">
   <span class="new-tag">NEW</span>
   <h3>${p.name}</h3>
   <p>₹${p.price}</p>
   <div class="card-actions">
    <button onclick="addCart(${p.id})">Add to Cart</button>
    <button class="wish-btn" onclick="toggleWish(${p.id})">♡ Wishlist</button>
   </div>
  </div>
 `).join("");
}

function searchProducts(){
 const q=document.getElementById("search").value.toLowerCase();
 displayProducts(products.filter(p=>p.name.toLowerCase().includes(q)));
}

function addCart(id){
 if(!requireLogin())return;

 const item=cart.find(x=>x.id===id);

 if(item){
  notify("Already in your cart!");
 }else{
  cart.push({...products.find(p=>p.id===id),qty:1});
  notify("Added to Cart Successfully ✓");
 }

 saveData();
 updateCart();
 displayProducts();
 displayNewProducts();
}

function changeQty(id,amount){
 const item=cart.find(x=>x.id===id);
 if(!item)return;

 item.qty+=amount;

 if(item.qty<=0){
  cart=cart.filter(x=>x.id!==id);
 }

 saveData();
 updateCart();
 displayProducts();
 displayNewProducts();
}

function removeCart(id){
 cart=cart.filter(x=>x.id!==id);

 saveData();
 updateCart();
 displayProducts();
 displayNewProducts();

 notify("Product removed from Cart");
}

function updateCart(){
 document.getElementById("cartCount").textContent=
 cart.reduce((s,p)=>s+p.qty,0);

 document.getElementById("cartItems").innerHTML=cart.length?
 cart.map(p=>`<div class="cart-item">
  <div><b>${p.name}</b><br>₹${p.price} each</div>
  <div class="quantity">
   <button onclick="changeQty(${p.id},-1)">−</button>
   <b>${p.qty}</b>
   <button onclick="changeQty(${p.id},1)">+</button>
  </div>
  <b>₹${p.price*p.qty}</b>
  <button class="remove" onclick="removeCart(${p.id})">Remove</button>
 </div>`).join(""):"<p class='center'>Your cart is empty.</p>";

 document.getElementById("total").textContent=
 cart.reduce((s,p)=>s+p.price*p.qty,0);
}

function toggleWish(id){
 const exists=wishlist.some(p=>p.id===id);

 if(exists){
  wishlist=wishlist.filter(p=>p.id!==id);
 }else{
  wishlist.push(products.find(p=>p.id===id));
 }

 saveData();
 updateWishlist();
 displayProducts();
 displayNewProducts();

 notify(exists?"Removed from Wishlist":"Added to Wishlist ❤️");
}

function updateWishlist(){
 document.getElementById("wishlistItems").innerHTML=wishlist.length?
 wishlist.map(p=>`<div class="card">
  <img src="${p.img}" alt="${p.name}">
  <h3>${p.name}</h3>
  <p>₹${p.price}</p>
  <div class="card-actions">
   <button onclick="addCart(${p.id})">Add to Cart</button>
   <button class="remove" onclick="toggleWish(${p.id})">Remove</button>
  </div>
 </div>`).join(""):"<p class='center'>Your Wishlist is empty.</p>";
}

// દરેક email નો પહેલો order અને ₹99 કરતાં વધુ ખરીદી પર ₹20 OFF
function getDiscount(){
 if(!currentUser)return 0;

 const previousOrders=orders.filter(
  o=>o.user===currentUser.email
 );

 const subtotal=cart.reduce((s,p)=>s+p.price*p.qty,0);

 if(previousOrders.length===0&&subtotal>99){
  return 20;
 }

 return 0;
}

function updateCheckout(){
 const subtotal=cart.reduce((s,p)=>s+p.price*p.qty,0);
 const discount=getDiscount();
 const finalTotal=subtotal-discount;

 document.getElementById("checkoutSubtotal").textContent=subtotal;
 document.getElementById("discount").textContent=discount;
 document.getElementById("checkoutTotal").textContent=finalTotal;
}

function placeOrder(){
 if(!requireLogin())return;

 if(!cart.length){
  alert("Your cart is empty!");
  return;
 }

 const name=document.getElementById("customerName").value.trim();
 const phone=document.getElementById("customerPhone").value.trim();
 const address=document.getElementById("customerAddress").value.trim();
 const payment=document.getElementById("paymentMethod").value;

 if(!name||!phone||!address){
  alert("Please fill all delivery details.");
  return;
 }

 const now=Date.now();
 const subtotal=cart.reduce((s,p)=>s+p.price*p.qty,0);
 const discount=getDiscount();
 const total=subtotal-discount;

 orders.unshift({
  id:"CC"+now,
  user:currentUser.email,
  items:[...cart],
  subtotal:subtotal,
  discount:discount,
  total:total,
  payment:payment,
  address:address,
  date:new Date(now).toLocaleString(),
  eta:now+15*60*1000
 });

 cart=[];
 saveData();
 updateCart();

 document.getElementById("deliveryETA").textContent=
 "🚚 Arriving in 10–15 minutes";

 showPage("success");
}

function updateHistory(){
 const myOrders=orders.filter(o=>o.user===currentUser.email);
 const area=document.getElementById("orderList");

 area.innerHTML=myOrders.length?myOrders.map(o=>`
 <div class="order-card">
  <h3>Order #${o.id}</h3>
  <p>Order Time: ${o.date}</p>
  <p>Payment: ${o.payment}</p>
  <p>Delivery Address: ${o.address}</p>
  <p>Subtotal: ₹${o.subtotal??o.total}</p>
  <p>Discount: -₹${o.discount||0}</p>
  <h3>Final Total: ₹${o.total}</h3>
  <h3 class="eta" data-eta="${o.eta}">🚚 Calculating arrival time...</h3>
  <h4>Products:</h4>
  ${o.items.map(p=>`<p>${p.name} × ${p.qty}</p>`).join("")}
 </div>`).join(""):"<p class='center'>No orders yet.</p>";

 updateTimers();
}

function updateTimers(){
 document.querySelectorAll(".eta").forEach(el=>{
  const remaining=Number(el.dataset.eta)-Date.now();

  if(remaining<=0){
   el.textContent="🚚 Estimated delivery time reached (demo)";
  }else{
   el.textContent="🚚 Arriving in about "+Math.ceil(remaining/60000)+" minutes";
  }
 });
}

setInterval(updateTimers,30000);

updateUserArea();
updateCart();
updateWishlist();
displayProducts();
displayNewProducts();

if(currentUser){
 showPage("home");
}else{
 showPage("login");
}