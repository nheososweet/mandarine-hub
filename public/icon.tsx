import { ImageResponse } from 'next/og';

// Cấu hình runtime và kích thước chuẩn cho Favicon
export const runtime = 'edge';
export const size = {
    width: 32,
    height: 32,
};
export const contentType = 'image/png';

export default function Icon() {
    return new ImageResponse(
        (
            // Container giả lập UI component
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    // 1. Background cam nhạt (tương đương bg-primary/10)
                    background: 'rgba(249, 115, 22, 0.1)',
                    // 2. Màu chữ cam (tương đương text-primary #f97316)
                    // SVG dùng stroke="currentColor" sẽ ăn theo màu này
                    color: '#f97316',
                    // 3. Bo góc (rounded-lg)
                    borderRadius: '8px',
                    // 4. Viền cam nhạt (border-primary/30)
                    border: '1px solid rgba(249, 115, 22, 0.3)',
                }}
            >
                {/* SVG của bạn (đã bỏ class vì ImageResponse k hỗ trợ class) */}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20" // Kích thước icon bên trong (size-4 ~ 16px, ở đây để 20 cho rõ)
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor" // QUAN TRỌNG: Nó sẽ lấy màu từ 'color' của div cha
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M21.66 17.67a1.08 1.08 0 0 1-.04 1.6A12 12 0 0 1 4.73 2.38a1.1 1.1 0 0 1 1.61-.04z"></path>
                    <path d="M19.65 15.66A8 8 0 0 1 8.35 4.34"></path>
                    <path d="m14 10-5.5 5.5"></path>
                    <path d="M14 17.85V10H6.15"></path>
                </svg>
            </div>
        ),
        {
            ...size,
        }
    );
}