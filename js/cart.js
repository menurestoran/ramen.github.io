// Inisialisasi keranjang
let cart = [];

// Fungsi untuk memperbarui tampilan keranjang
function updateCart() {
    const cartItems = document.getElementById('cartItems');
    const totalPriceElement = document.getElementById('totalPrice');
    cartItems.innerHTML = ''; // Kosongkan keranjang
    let totalPrice = 0;

    cart.forEach((item, index) => {
        totalPrice += item.harga * item.jumlah;

        const cartItem = document.createElement('div');
        cartItem.className = "flex justify-between items-center border-b pb-2";
        cartItem.innerHTML = `
            <div>
                <p class="font-semibold">${item.nama_menu}</p>
                <p class="text-sm text-gray-500">Harga: Rp ${item.harga.toLocaleString('id-ID')}</p>
                <p class="text-sm text-gray-500">Jumlah: ${item.jumlah}</p>
            </div>
            <div class="flex space-x-2">
                <button class="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition" onclick="updateItemQuantity(${index}, 'increase')">+</button>
                <button class="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition" onclick="updateItemQuantity(${index}, 'decrease')">-</button>
            </div>
        `;
        cartItems.appendChild(cartItem);
    });

    totalPriceElement.textContent = `Total: Rp ${totalPrice.toLocaleString('id-ID')}`;
}

// Tambahkan item ke keranjang
function addToCart(menu) {
    const existingItemIndex = cart.findIndex(item => item.id === menu.id);

    if (existingItemIndex > -1) {
        cart[existingItemIndex].jumlah += 1;
    } else {
        cart.push({ ...menu, jumlah: 1 });
    }

    console.log("Item added to cart:", cart); // Debugging: Tampilkan isi keranjang
    updateCart(); // Perbarui tampilan keranjang
    showCart(); // Tampilkan keranjang
}

// Perbarui jumlah item
function updateItemQuantity(index, action) {
    if (action === 'increase') {
        cart[index].jumlah += 1;
    } else if (action === 'decrease') {
        cart[index].jumlah -= 1;

        if (cart[index].jumlah <= 0) {
            cart.splice(index, 1); // Hapus item jika jumlah <= 0
        }
    }

    updateCart();
}

// Tampilkan dan sembunyikan keranjang
function showCart() {
    document.getElementById('cartModal').classList.remove('hidden');
}

function hideCart() {
    document.getElementById('cartModal').classList.add('hidden');
}

// Konfirmasi pesanan
document.getElementById('confirmOrder').addEventListener('click', () => {
    console.log('Pesanan dikonfirmasi:', cart);

    // Reset keranjang setelah konfirmasi
    cart = [];
    updateCart();
    hideCart();
});

// Tutup modal keranjang
document.getElementById('closeCart').addEventListener('click', hideCart);

// Tambahkan fungsi addToCart pada tombol "Pesan"
document.addEventListener('DOMContentLoaded', async () => {
    const restoContainer = document.getElementById('resto');

    try {
        const response = await fetch('https://asia-southeast2-menurestoran-443909.cloudfunctions.net/menurestoran/data/menu_ramen/byoutletid?outlet_id=6776b3258a04e2a3fbd9b0e1');
        const data = await response.json();

        data.forEach(menuramen => {
            const card = document.createElement('div');
            card.className = "bg-white shadow-md rounded-lg overflow-hidden";

            const deskripsi = menuramen.deskripsi || "Tidak ada deskripsi tersedia.";
            const gambar = menuramen.gambar || 'path/to/default/image.jpg';
            const harga = menuramen.harga || 0;

            card.innerHTML = `
                <img src="${gambar}" alt="${menuramen.nama_menu}" class="w-full h-40 object-cover">
                <div class="p-4">
                    <h3 class="text-lg font-bold text-gray-800">${menuramen.nama_menu}</h3>
                    <p class="text-sm text-gray-600">Harga: Rp ${harga.toLocaleString('id-ID')}</p>
                    <p class="text-sm text-gray-600">Deskripsi: ${deskripsi}</p>
                    <button class="mt-4 px-4 py-2 bg-blue-500 text-white text-sm rounded-lg shadow-md hover:bg-blue-600 transition" onclick="addToCart(${JSON.stringify({
                        id: menuramen.id,
                        nama_menu: menuramen.nama_menu,
                        harga: menuramen.harga
                    })})">Pesan</button>
                </div>
            `;

            restoContainer.appendChild(card);
        });

    } catch (error) {
        console.error('Error:', error);
    }
});
