"use client"

import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';

// --- 1. TOOL: Hook useLatest (Nhân vật chính) ---
function useLatest<T>(value: T) {
    const ref = useRef(value);
    useLayoutEffect(() => {
        ref.current = value;
    }, [value]);
    return ref;
}

// --- 2. COMPONENT SAI: Bị ảnh hưởng bởi Re-render ---
// Component này sẽ reset bộ đếm thời gian mỗi khi props thay đổi
const BadSearchInput = ({ onSearch }: { onSearch: (q: string) => void }) => {
    const [text, setText] = useState('');

    useEffect(() => {
        console.log('🔴 [Bad Input] Effect Reset! (Do onSearch thay đổi)');

        // Nếu chưa kịp chạy hết 1000ms mà Effect bị reset -> dòng code trong này KHÔNG BAO GIỜ CHẠY
        const timeoutId = setTimeout(() => {
            onSearch(text);
        }, 1000); // Chờ 1s mới search

        return () => clearTimeout(timeoutId);
    }, [text, onSearch]); // <--- VẤN ĐỀ: Phụ thuộc vào onSearch

    return (
        <div style={{ border: '2px solid red', padding: '10px', margin: '10px 0' }}>
            <h3>❌ Cách SAI (Re-renders làm hỏng Debounce)</h3>
            <input
                placeholder="Gõ tên (VD: Akaza)..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                style={{ padding: '8px', width: '100%' }}
            />
            <p style={{ fontSize: '12px', color: '#666' }}>
                Thử gõ và nhìn Console. Nếu component cha re-render nhanh hơn 1s,
                bạn sẽ thấy nó không bao giờ log ra kết quả tìm kiếm.
            </p>
        </div>
    );
};

// --- 3. COMPONENT ĐÚNG: Dùng useLatest ---
// Component này "miễn nhiễm" với việc onSearch bị thay đổi
const GoodSearchInput = ({ onSearch }: { onSearch: (q: string) => void }) => {
    const [text, setText] = useState('');

    // ✅ Dùng useLatest để giữ hàm onSearch mới nhất
    const onSearchRef = useLatest(onSearch);

    useEffect(() => {
        console.log('🟢 [Good Input] Effect Chạy (Chỉ khi text đổi)');

        const timeoutId = setTimeout(() => {
            // Gọi hàm từ ref -> Luôn lấy được hàm mới nhất mà không cần reset Effect
            onSearchRef.current(text);
        }, 1000);

        return () => clearTimeout(timeoutId);
    }, [text]); // ✅ TUYỆT VỜI: Chỉ phụ thuộc vào text, bỏ onSearch ra ngoài

    return (
        <div style={{ border: '2px solid green', padding: '10px', margin: '10px 0' }}>
            <h3>✅ Cách ĐÚNG (Dùng useLatest)</h3>
            <input
                placeholder="Gõ tên (VD: Rengoku)..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                style={{ padding: '8px', width: '100%' }}
            />
            <p style={{ fontSize: '12px', color: '#666' }}>
                Dù component cha có "nháy" liên tục, chức năng tìm kiếm vẫn hoạt động mượt mà.
            </p>
        </div>
    );
};

// --- 4. APP (Môi trường test hỗn loạn) ---
export default function App() {
    const [chaosLevel, setChaosLevel] = useState(0);

    // 😈 Giả lập sự hỗn loạn: Component cha Re-render mỗi 500ms
    // (Nhanh hơn thời gian debounce 1000ms của input -> Gây lỗi cho Component SAI)
    useEffect(() => {
        const interval = setInterval(() => {
            setChaosLevel((prev) => prev + 1);
        }, 500);
        return () => clearInterval(interval);
    }, []);

    // Hàm này được TẠO MỚI mỗi 500ms (mỗi lần App render)
    // Đây chính là nguyên nhân khiến Component con bị reset effect nếu không handle kỹ
    const handleSearch = (query: string) => {
        if (!query) return;
        console.log(`🔎 [API CALL] Đang tìm kiếm hồ sơ: ${query.toUpperCase()}`);
        alert(`Đã tìm thấy hồ sơ: ${query.toUpperCase()}`);
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '600px' }}>
            <h1>Test useLatest Hook</h1>

            <div >
                <strong>🌪️ Mức độ hỗn loạn (Re-renders): {chaosLevel}</strong>
                <p>App đang re-render mỗi 0.5 giây. Hãy thử gõ vào 2 ô bên dưới.</p>
            </div>

            <BadSearchInput onSearch={handleSearch} />

            <GoodSearchInput onSearch={handleSearch} />
        </div>
    );
}