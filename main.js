const menuItems = [
  { name: "Finroll S", price: 49, description: "6 ชิ้น + น้ำจิ้ม 1 ถ้วย", img: "images/finroll-s.jpg" },
  { name: "Finroll M", price: 69, description: "8 ชิ้น + น้ำจิ้ม 1 ถ้วย", img: "images/finroll-m.jpg" },
  { name: "Finroll L", price: 89, description: "10 ชิ้น + น้ำจิ้ม 2 ถ้วย", img: "images/finroll-l.jpg" },
  { name: "Finroll XL", price: 109, description: "12 ชิ้น + น้ำจิ้ม 2 ถ้วย", img: "images/finroll-xl.jpg" },
  { name: "น้ำจิ้มซีฟู้ด", price: 10, description: "1 ถ้วย (แยก)", img: "images/finroll-sauce.jpg" }
];

let cart = [];
let deliveryPlace = "";

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

function removeFromCart(index) {
  cart.splice(index, 1);
  renderCart();
}

function renderCart() {
  const list = document.getElementById("cart-list");
  list.innerHTML = "";
  let total = 0;
  cart.forEach((item, index) => {
    total += item.price;
    const li = document.createElement("li");
    li.innerHTML = `${item.name} - ${item.price} บาท 
      <button class="remove-btn" onclick="removeFromCart(${index})">x</button>`;
    list.appendChild(li);
  });
  document.getElementById("total").textContent = `รวม: ${total} บาท`;
}

function toggleOtherInput(value) {
  const otherInput = document.getElementById("delivery-other");
  if (value === "อื่นๆ") {
    otherInput.style.display = "block";
  } else {
    otherInput.style.display = "none";
  }
}

function goToSummary() {
  const deliverySelect = document.getElementById("delivery-select").value;
  const deliveryOther = document.getElementById("delivery-other").value.trim();
  deliveryPlace = deliverySelect === "อื่นๆ" ? deliveryOther : deliverySelect;

  if (!deliveryPlace) {
    alert("กรุณาเลือกสถานที่จัดส่ง");
    return;
  }

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
  document.getElementById("summary-qrcode").innerHTML = `<img src="${qrUrl}" width="200"/>`;
}

function goBack() {
  document.getElementById("step-summary").style.display = "none";
  document.getElementById("step-menu").style.display = "block";
}

function sendOrder() {
  let total = cart.reduce((sum, item) => sum + item.price, 0);
  let orderText = "📋 รายการสินค้า\n\n";  // ← แก้ข้อความจาก “ออเดอร์ใหม่” เป็น “รายการสินค้า”

  cart.forEach(item => {
    orderText += `- ${item.name}  ${item.price} บาท\n`;
  });

  orderText += `\n💵 รวมทั้งหมด: ${total} บาท\n`;
  orderText += `🚚 สถานที่จัดส่ง: ${deliveryPlace}`;

  if (liff.isInClient()) {
    liff.sendMessages([{ type: "text", text: orderText }])
      .then(() => {
        alert("ส่งออเดอร์เรียบร้อย ✅");
        cart = [];
        renderCart();
        goBack();
      })
      .catch(err => console.error("ส่งไม่สำเร็จ:", err));
  } else {
    alert("กรุณาเปิดจาก LINE App เพื่อส่งออเดอร์");
  }
}

// เมื่อโหลดหน้า
window.onload = renderMenu;
