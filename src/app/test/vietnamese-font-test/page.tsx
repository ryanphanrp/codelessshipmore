import React from 'react';

export default function VietnameseFontTest() {
  const vietnameseTexts = {
    basic: "Xin chào thế giới",
    diacritics: "À Á Â Ã È É Ê Ì Ò Ó Ô Õ Ù Ú Û Ý à á â ã è é ê ì ò ó ô õ ù ú û ý",
    special: "Ă ă Đ đ Ĩ ĩ Ũ ũ Ơ ơ Ư ư Ạ ạ Ả ả Ấ ấ Ầ ầ Ẫ ẫ Ẩ ẩ",
    combination: "Thủ đô Hà Nội là trung tâm văn hóa, chính trị và kinh tế của Việt Nam",
    longText: `Người ta chỉ đi tìm điều người ta chưa có,
Thấy mình thiếu sao vui cho bằng người đủ.

Đấy! Sao thấy kẻ xưa tựa như kẻ nay,
Người thời trước làm ta bây giờ?

Tựa như đã qua, lại như sắp tới,
Cả một đời người nằm gọn trong đây.

Và em đôi khi hỏi hoài sao thế,
Sống trong đời ấy, vui hay buồn hơn?`
  };

  const codeExamples = [
    "const greeting = 'Xin chào Việt Nam';",
    "function calculateTotal(price, quantity) { return price * quantity; } // Tính tổng",
    "// Định nghĩa hàm xử lý mảng tiếng Việt\nconst vietnameseArray = ['một', 'hai', 'ba'];"
  ];

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Vietnamese Font Support Test</h1>

      <div className="space-y-8">
        {/* Sans-serif (Inter) Tests */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Sans-serif Font (Inter)</h2>
          <div className="space-y-4">
            <div className="p-4 bg-card rounded-lg border">
              <h3 className="font-medium mb-2">Basic Vietnamese</h3>
              <p className="text-lg">{vietnameseTexts.basic}</p>
            </div>

            <div className="p-4 bg-card rounded-lg border">
              <h3 className="font-medium mb-2">All Diacritics</h3>
              <p className="text-lg">{vietnameseTexts.diacritics}</p>
            </div>

            <div className="p-4 bg-card rounded-lg border">
              <h3 className="font-medium mb-2">Special Characters</h3>
              <p className="text-lg">{vietnameseTexts.special}</p>
            </div>

            <div className="p-4 bg-card rounded-lg border">
              <h3 className="font-medium mb-2">Mixed Text</h3>
              <p className="text-lg">{vietnameseTexts.combination}</p>
            </div>

            <div className="p-4 bg-card rounded-lg border">
              <h3 className="font-medium mb-2">Poem (Long Text)</h3>
              <p className="whitespace-pre-line text-lg">{vietnameseTexts.longText}</p>
            </div>
          </div>
        </section>

        {/* Monospace (JetBrains Mono) Tests */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Monospace Font (JetBrains Mono)</h2>
          <div className="space-y-4">
            <div className="p-4 bg-card rounded-lg border">
              <h3 className="font-medium mb-2">Input Field Test</h3>
              <input
                type="text"
                placeholder="Nhập văn bản tiếng Việt..."
                className="w-full p-2 border rounded font-mono"
              />
            </div>

            <div className="p-4 bg-card rounded-lg border">
              <h3 className="font-medium mb-2">Textarea Test</h3>
              <textarea
                placeholder="Viết đoạn văn bản dài hơn với dấu tiếng Việt..."
                className="w-full p-2 border rounded font-mono h-24"
                defaultValue={vietnameseTexts.combination}
              />
            </div>

            <div className="p-4 bg-card rounded-lg border">
              <h3 className="font-medium mb-2">Code Blocks</h3>
              <div className="space-y-2">
                {codeExamples.map((code, index) => (
                  <pre key={index} className="p-2 bg-muted rounded font-mono text-sm overflow-x-auto">
                    <code>{code}</code>
                  </pre>
                ))}
              </div>
            </div>

            <div className="p-4 bg-card rounded-lg border">
              <h3 className="font-medium mb-2">Vietnamese in Monospace</h3>
              <p className="font-mono text-lg">{vietnameseTexts.basic}</p>
              <p className="font-mono text-lg mt-2">{vietnameseTexts.diacritics}</p>
              <p className="font-mono text-lg mt-2">{vietnameseTexts.special}</p>
            </div>
          </div>
        </section>

        {/* Form Elements Test */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Form Elements with Vietnamese</h2>
          <form className="space-y-4 p-4 bg-card rounded-lg border">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                Họ và tên
              </label>
              <input
                type="text"
                id="name"
                placeholder="Nguyễn Văn A"
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="nguyenvana@example.com"
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium mb-1">
                Địa chỉ
              </label>
              <input
                type="text"
                id="address"
                placeholder="123 Nguyễn Trãi, Quận 1, TP. Hồ Chí Minh"
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-1">
                Tin nhắn
              </label>
              <textarea
                id="message"
                placeholder="Nhập nội dung tin nhắn bằng tiếng Việt..."
                className="w-full p-2 border rounded h-24"
              />
            </div>

            <button
              type="submit"
              className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
            >
              Gửi đi
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}