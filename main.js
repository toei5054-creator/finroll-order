const menuItems = [
  { name: "Finroll S", price: 49, description: "6 ชิ้น + น้ำจิ้ม 1 ถ้วย", img: "images/finroll-s.jpg" },
  { name: "Finroll M", price: 69, description: "8 ชิ้น + น้ำจิ้ม 1 ถ้วย", img: "images/finroll-m.jpg" },
  { name: "Finroll L", price: 89, description: "10 ชิ้น + น้ำจิ้ม 2 ถ้วย", img: "images/finroll-l.jpg" },
  { name: "Finroll XL", price: 109, description: "12 ชิ้น + น้ำจิ้ม 2 ถ้วย", img: "images/finroll-xl.jpg" },
  { name: "น้ำจิ้มซีฟู้ด", price: 10, description: "1 ถ้วย (แยก)", img: "images/finroll-sauce.jpg" }
];

let cart = [];

// แสดงเมนู
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

// เพิ่มสินค้า
function addToCart(i) {
  cart.push(menuItems[i]);
  renderCart();
}

// แสดงตะกร้า
function renderCart() {
  const list = document.getElementById("cart-list");
  list.innerHTML = "";
  let total = 0;
  cart.forEach((item, index) => {
    total += item.price;
    const li = document.createElement("li");
    li.innerHTML = `${item.name} - ${item.price} บาท <button onclick="removeFromCart(${index})">ลบ</button>`;
    list.appendChild(li);
  });
  document.getElementById("total").textContent = `รวม: ${total} บาท`;
}

// ลบสินค้า
function removeFromCart(index) {
  cart.splice(index, 1);
  renderCart();
}

// ไปหน้าสรุป
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

// กลับไปแก้ไข
function goBack() {
  document.getElementById("step-summary").style.display = "none";
  document.getElementById("step-menu").style.display = "block";
}

// ชำระเงิน
function payNow() {
  const totalText = document.getElementById("summary-total").textContent;
  if (!totalText) {
    alert("ยังไม่มีรายการในตะกร้า");
    return;
  }

  if (liff.isLoggedIn()) {
    liff.sendMessages([
      {
        type: "text",
        text: `ออเดอร์ของคุณ: \n${cart.map(item => item.name).join(", ")}\n${totalText}`
      },
      {
        type: "text",
        text: "นี่คือ QR สำหรับชำระเงิน 👉 https://promptpay.io/0649402737"
      }
    ])
    .then(() => {
      alert("ส่งออเดอร์เรียบร้อย กรุณาชำระเงินตาม QR ที่ส่งให้");
      cart = [];
