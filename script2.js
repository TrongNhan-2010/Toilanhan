// ===== 1. HIỆU ỨNG CUỘN MƯỢT KHI NHẤN MENU =====
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===== 2. THAY ĐỔI THANH ĐIỀU HƯỞNG KHI CUỘN =====
window.addEventListener('scroll', function() {
    const nav = document.querySelector('nav');
    if (window.scrollY > 50) {
        nav.style.backgroundColor = 'rgba(8, 8, 10, 0.95)';
        nav.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
    } else {
        nav.style.backgroundColor = 'rgba(15, 15, 19, 0.8)';
        nav.style.boxShadow = 'none';
    }
});

// ===== 3. MENU DI ĐỘNG - ✅ ĐÃ SỬA HOÀN TOÀN, BẤM ĐƯỢC MỌI LÚC =====
// Dùng cách này chắc chắn không bị lỗi, dù menu thay đổi nội dung
document.addEventListener('click', function(e) {
    // Kiểm tra xem có bấm vào nút 3 gạch hay không
    if (e.target.closest('.menu-btn')) {
        const navLinks = document.querySelector('.nav-links');
        const hienTai = window.getComputedStyle(navLinks).display;
        
        if (hienTai === 'flex') {
            // Đang hiện → Ẩn
            navLinks.style.display = 'none';
        } else {
            // Đang ẩn → Hiện + Định dạng lại
            navLinks.style.display = 'flex';
            navLinks.style.position = 'absolute';
            navLinks.style.top = '100%';
            navLinks.style.left = '0';
            navLinks.style.right = '0';
            navLinks.style.backgroundColor = 'var(--dark)';
            navLinks.style.flexDirection = 'column';
            navLinks.style.padding = '1rem 1.5rem';
            navLinks.style.gap = '1rem';
            navLinks.style.zIndex = '9999';
        }
    }
});

// ===== 4. HIỆU ỨNG XUẤT HIỆN KHI CUỘN =====
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Áp dụng cho sản phẩm
document.querySelectorAll('.product-card').forEach(card => {
    observer.observe(card);
});

// ===== 5. KIỂM TRA TRẠNG THÁI ĐĂNG NHẬP & THAY ĐỔI MENU =====
window.addEventListener('DOMContentLoaded', function() {
    const tenDangNhap = localStorage.getItem('nguoiDangNhap');
    const khuVucChuaDN = document.getElementById('chuaDangNhap');
    const khuVucDaDN = document.getElementById('daDangNhap');
    const hienTen = document.getElementById('tenNguoiDung');
    const nutDangXuat = document.getElementById('btnDangXuat');

    if (tenDangNhap) {
        // ✅ Đã đăng nhập: Ẩn Đăng ký/Đăng nhập, Hiện Tên + Đăng xuất
        khuVucChuaDN.style.display = 'none';
        khuVucDaDN.style.display = 'flex';
        hienTen.textContent = tenDangNhap;
    } else {
        // ❌ Chưa đăng nhập: Hiện Đăng ký/Đăng nhập
        khuVucChuaDN.style.display = 'flex';
        khuVucDaDN.style.display = 'none';
    }

    // ✅ Chức năng Đăng xuất
    nutDangXuat?.addEventListener('click', function(e) {
        e.preventDefault();
        localStorage.removeItem('nguoiDangNhap'); // Xóa trạng thái
        alert('✅ Đã đăng xuất thành công!');
        window.location.href = 'NhanTapCode.html'; // Tải lại trang
    });

    // ===== Tải dữ liệu bài viết khi vào trang chủ =====
    taiDuLieuBaiViet();

    // ===== Tải thông tin nếu ở trang cá nhân =====
    if (window.location.pathname.includes('canhan.html')) {
        taiThongTinCaNhan();
    }
});

// ===== 6. QUẢN LÝ DỮ LIỆU BÀI VIẾT - LIKE - BÌNH LUẬN =====
function layDanhSachBaiViet() {
    return JSON.parse(localStorage.getItem('danhSachBaiViet')) || [];
}
function luuDanhSachBaiViet(data) {
    localStorage.setItem('danhSachBaiViet', JSON.stringify(data));
}

// ===== 7. ĐĂNG ẢNH MỚI =====
function dangAnh(event) {
    event.preventDefault();
    const nguoiDang = localStorage.getItem('nguoiDangNhap');
    if (!nguoiDang) return alert('❌ Bạn cần đăng nhập để đăng ảnh!');

    const tieuDe = document.getElementById('tieuDeBaiViet').value.trim();
    const file = document.getElementById('fileAnh').files[0];
    if (!tieuDe || !file) return alert('❌ Vui lòng điền tiêu đề và chọn ảnh!');

    const reader = new FileReader();
    reader.onload = function(e) {
        const ds = layDanhSachBaiViet();
        ds.unshift({
            id: Date.now(),
            nguoiDang: nguoiDang,
            tieuDe: tieuDe,
            anh: e.target.result,
            luotLike: 0,
            daLike: [],
            binhLuan: []
        });
        luuDanhSachBaiViet(ds);
        alert('✅ Đăng ảnh thành công!');
        document.getElementById('formDangAnh').reset();
        taiDuLieuBaiViet();
    };
    reader.readAsDataURL(file);
}

// ===== 8. TẢI & HIỂN THỊ BÀI VIẾT =====
function taiDuLieuBaiViet() {
    const khuVuc = document.getElementById('khuVucBaiViet');
    if (!khuVuc) return;
    const ds = layDanhSachBaiViet();
    const nguoiHienTai = localStorage.getItem('nguoiDangNhap');

    khuVuc.innerHTML = '';
    ds.forEach(bv => {
        const daLike = bv.daLike.includes(nguoiHienTai);
        khuVuc.innerHTML += `
        <div class="bai-viet">
            <div class="tieu-de-bai-viet">
                <strong>👤 ${bv.nguoiDang}</strong>
                <h4>${bv.tieuDe}</h4>
            </div>
            <img src="${bv.anh}" class="anh-bai-viet" alt="Ảnh đã đăng">
            <div class="hanh-dong">
                <button class="nut-like ${daLike ? 'da-like' : ''}" onclick="xuLyLike(${bv.id})">
                    ❤️ Thích <span>${bv.luotLike}</span>
                </button>
            </div>
            <div class="binh-luan-khu">
                <h5>💬 Bình luận (${bv.binhLuan.length})</h5>
                <div id="bl-${bv.id}">
                    ${bv.binhLuan.map(bl => `<p><strong>${bl.nguoi}:</strong> ${bl.noiDung}</p>`).join('')}
                </div>
                ${nguoiHienTai ? `
                <div class="nhap-bl">
                    <input type="text" id="input-bl-${bv.id}" placeholder="Viết bình luận...">
                    <button onclick="xuLyBinhLuan(${bv.id})">Gửi</button>
                </div>` : `<p class="khoa-bl">🔒 Đăng nhập để bình luận</p>`}
            </div>
        </div>`;
    });
}

// ===== 9. XỬ LÝ LIKE =====
function xuLyLike(id) {
    const nguoi = localStorage.getItem('nguoiDangNhap');
    if (!nguoi) return alert('❌ Đăng nhập để thích bài viết!');
    const ds = layDanhSachBaiViet();
    const i = ds.findIndex(b => b.id === id);
    if (i < 0) return;

    if (ds[i].daLike.includes(nguoi)) {
        // Bỏ thích
        ds[i].luotLike--;
        ds[i].daLike = ds[i].daLike.filter(u => u !== nguoi);
    } else {
        // Thích
        ds[i].luotLike++;
        ds[i].daLike.push(nguoi);
    }
    luuDanhSachBaiViet(ds);
    taiDuLieuBaiViet();
}

// ===== 10. XỬ LÝ BÌNH LUẬN =====
function xuLyBinhLuan(id) {
    const nguoi = localStorage.getItem('nguoiDangNhap');
    if (!nguoi) return alert('❌ Đăng nhập để bình luận!');
    const noiDung = document.getElementById(`input-bl-${id}`).value.trim();
    if (!noiDung) return;

    const ds = layDanhSachBaiViet();
    const i = ds.findIndex(b => b.id === id);
    if (i < 0) return;

    ds[i].binhLuan.push({ nguoi, noiDung });
    luuDanhSachBaiViet(ds);
    document.getElementById(`input-bl-${id}`).value = '';
    taiDuLieuBaiViet();
}

// ===== 11. THÔNG TIN CÁ NHÂN =====
function luuThongTinCaNhan(e) {
    e.preventDefault();
    const nguoi = localStorage.getItem('nguoiDangNhap');
    if (!nguoi) return;

    const tt = {
        hoten: document.getElementById('hoTen').value,
        sdt: document.getElementById('soDienThoai').value,
        diachi: document.getElementById('diaChi').value,
        gioithieu: document.getElementById('gioiThieu').value
    };
    localStorage.setItem(`tt_${nguoi}`, JSON.stringify(tt));
    alert('✅ Đã lưu thông tin cá nhân!');
}

function taiThongTinCaNhan() {
    const nguoi = localStorage.getItem('nguoiDangNhap');
    if (!nguoi) return window.location.href = 'dangnhap.html';
    const tt = JSON.parse(localStorage.getItem(`tt_${nguoi}`)) || {};

    document.getElementById('hoTen').value = tt.hoten || '';
    document.getElementById('soDienThoai').value = tt.sdt || '';
    document.getElementById('diaChi').value = tt.diachi || '';
    document.getElementById('gioiThieu').value = tt.gioithieu || '';
    document.getElementById('tenHienThi').textContent = nguoi;
}

// ===== 12. GỬI EMAIL KHI CÓ NGƯỜI ĐĂNG KÝ =====
function guiEmailDangKy(tendangnhap, matkhau) {
    // ✅ THAY EMAIL BẠN MUỐN NHẬN THÔNG TIN VÀO ĐÂY
    const emailNhan = "ht9293082@gmail.com"; 
    const tieuDe = "✅ Có tài khoản mới đăng ký trên web TNhanX";
    const noiDung = `Tên đăng nhập: ${tendangnhap}%0AMật khẩu: ${matkhau}%0AThời gian: ${new Date().toLocaleString('vi-VN')}`;

    // Mở trình gửi email mặc định
    window.open(`mailto:${emailNhan}?subject=${encodeURIComponent(tieuDe)}&body=${encodeURIComponent(noiDung)}`);
}
