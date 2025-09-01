const menuItems = [
  { name: "Finroll S", price: 49, description: "6 ชิ้น + น้ำจิ้ม 1 ถ้วย", img: "images/finroll-s.jpg" },
  { name: "Finroll M", price: 69, description: "8 ชิ้น + น้ำจิ้ม 1 ถ้วย", img: "images/finroll-m.jpg" },
  { name: "Finroll L", price: 89, description: "10 ชิ้น + น้ำจิ้ม 2 ถ้วย", img: "images/finroll-l.jpg" },
  { name: "Finroll XL", price: 109, description: "12 ชิ้น + น้ำจิ้ม 2 ถ้วย", img: "images/finroll-xl.jpg" },
  { name: "น้ำจิ้มซีฟู้ด", price: 10, description: "1 ถ้วย (แยก)", img: "images/finroll-sauce.jpg" }
];

let cart = [];

function renderMenu() {
  const menu = document.getElementById("menu");
  menu.innerHTML = "";
  menuItems.forEach((item, i) => {
    const card = document.createElement("div");
    card.className = "menu-item";
    card.innerHTML = `
      <img src="${item.img}" alt="${item.name}">
      <div class="info">
        <h3>${item.name}</h3>
        <p>${item.description}</p>
        <p><strong>${item.price} บาท</strong></p>
      </div>
      <button onclick="addToCart(${i})">เพิ่มใส่ตะกร้า</button>
    `;
    menu.appendChild(card);
  });
}

function addToCart(i) {
  cart.push(menuItems[i]);
  renderCart();
}

function renderCart() {
  const list = document.getElementById("cart-list");
  list.innerHTML = "";
  let total = 0;
  cart.forEach(item => {
    total += item.price;
    const li = document.createElement("li");
    li.textContent = `${item.name} - ${item.price} บาท`;
    list.appendChild(li);
  });
  document.getElementById("total").textContent = `รวม: ${total} บาท`;
}

// เรียก renderMenu เมื่อโหลดหน้า
window.onload = renderMenu;

function goToSummary() {
  document.getElementById("step-menu").style.display = "none";
  document.getElementById("step-summary").style.display = "block";

  const summaryList = document.getElementById("summary-list");
  summaryList.innerHTML = "";
  let total = 0;
  cart.forEach(item => {
    total += item.price;
    const li = document.createElement("li");
    li.textContent = `${item.name} — ${item.price} บาท`;
    summaryList.appendChild(li);
  });

  document.getElementById("summary-total").textContent = `ยอดรวมทั้งหมด: ${total} บาท`;

  const qrUrl = `https://promptpay.io/0649402737/${total}`;
  document.getElementById("summary-qrcode").innerHTML = `<img src="${qrUrl}" alt="QR PromptPay" width="200" />`;
}

function goBack() {
  document.getElementById("step-summary").style.display = "none";
  document.getElementById("step-menu").style.display = "block";
}
