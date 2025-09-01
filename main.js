let cart = [];
let customerName = "";

// ================== LIFF Init ==================
document.addEventListener("DOMContentLoaded", function () {
  liff.init({ liffId: "2008027808-5xNdW2mQ" })
  .then(() => {
    if (!liff.isLoggedIn()) {
      liff.login();
    } else {
      liff.getProfile().then(profile => {
        customerName = profile.displayName;
        console.log("Hello,", customerName);
      });
    }
  })
  .catch(err => console.error("LIFF init error", err));

  renderMenu();
});

// ================== เมนูสินค้า ==================
const menuItems = [
  { name: "Finroll S", price: 49, description: "6 ชิ้น + น้ำจิ้ม 1 ถ้วย", img: "images/finroll-s.jpg" },
  { name: "Finroll M", price: 69, description: "8 ชิ้น + น้ำจิ้ม 1 ถ้วย", img: "images/finroll-m.jpg" },
  { name: "Finroll L", price: 89, description: "10 ชิ้น + น้ำจิ้ม 2 ถ้วย", img: "images/finroll-l.jpg" },
  { name: "Finroll XL", price: 109, description: "12 ชิ้น + น้ำจิ้ม 2 ถ้วย", img: "images/finroll-xl.jpg" },
  { name: "น้ำจิ้มซีฟู้ด", price: 10, description: "1 ถ้วย (แยก)", img: "images/finroll-sauce.jpg" }
];

function renderMenu() {
  const menu = document.getElementById("menu");
  menu.innerHTML = "";
  menuItems.forEach((item, i) => {
    const card = document.createElement("div");
    card.className = "bg-white rounded-xl shadow hover:shadow-lg overflow-hidden";
    card.innerHTML = `
      <img src="${item.img}" alt="${item.name}" class="w-full h-40 object-cover">
      <div class="p-3">
        <h3 class="font-bold text-lg">${item.name}</h3>
        <p class="text-sm text-gray-600">${item.description}</p>
        <p class="font-semibold text-green-600 mt-1">${item.price} บาท</p>
        <button class="w-full bg-green-600 text-white py-2 rounded-lg mt-2 hover:bg-green-700" onclick="addToCart(${i})">เพิ่มใส่ตะกร้า</button>
      </div>
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
  cart.forEach((item, index) => {
    total += item.price;
    const li = document.createElement("li");
    li.className = "flex justify-between items-center";

    li.innerHTML = `
      <span>${item.name} - ${item.price} บาท</span>
      <button class="text-red-500 ml-2" onclick="removeFromCart(${index})">❌</button>
    `;

    list.appendChild(li);
  });
  document.getElementById("total").textContent = `รวม: ${total} บาท`;
}
function removeFromCart(index) {
  cart.splice(index, 1); // ลบสินค้าออกจาก array
  renderCart(); // render ใหม่
}
// ================== สรุปรายการ ==================
function goToSummary() {
  document.getElementById("step-menu").classList.add("hidden");
  document.getElementById("step-summary").classList.remove("hidden");

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
  document.getElementById("summary-qrcode").innerHTML = `<img src="${qrUrl}" alt="QR PromptPay" class="mx-auto rounded-lg shadow mt-2" width="200" />`;

  // ปุ่ม "ฉันชำระเงินแล้ว"
  const btnPaid = document.createElement("button");
  btnPaid.textContent = "✅ ฉันชำระเงินแล้ว";
  btnPaid.className = "w-full bg-green-600 text-white py-2 rounded-lg mt-4 hover:bg-green-700";
  btnPaid.onclick = () => {
    let orderText = `🍣 รายการสั่งซื้อ FinRoll\n👤 ลูกค้า: ${customerName}\n\n`;
    cart.forEach(item => {
      orderText += `- ${item.name} ${item.price} บาท\n`;
    });
    orderText += `\n💵 ยอดรวมทั้งหมด: ${total} บาท\n\nลูกค้าแจ้งว่าได้ชำระเงินแล้ว ✅`;

    liff.sendMessages([{ type: "text", text: orderText }])
    .then(() => {
      alert("ส่งออเดอร์ + แจ้งชำระเงินแล้วไปที่ LINE เรียบร้อย ✅");
      cart = [];
      renderCart();
      goBack();
    })
    .catch(err => console.error("ส่งข้อความไม่สำเร็จ", err));
  };

  document.getElementById("summary-qrcode").appendChild(btnPaid);
}

function goBack() {
  document.getElementById("step-summary").classList.add("hidden");
  document.getElementById("step-menu").classList.remove("hidden");
}

