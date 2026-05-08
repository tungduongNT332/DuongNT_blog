import os, re
import xml.etree.ElementTree as ET
from docx import Document

DOCX_PATH = r"C:\Users\Admin\Downloads\Lỗ Hổng CORS.docx"
MDX_PATH  = r"C:\Users\Admin\Desktop\web-blog\content\vulnerabilities\cors.mdx"
IMG_DIR   = r"C:\Users\Admin\Desktop\web-blog\public\images\vulnerabilities\cors"

WNS  = "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}"
DNSa = "{http://schemas.openxmlformats.org/drawingml/2006/main}"
DNSr = "{http://schemas.openxmlformats.org/officeDocument/2006/relationships}"

doc = Document(DOCX_PATH)
os.makedirs(IMG_DIR, exist_ok=True)

# 1. Save images
images = {}
for rel in doc.part.rels.values():
    if "image" in rel.reltype:
        ip = rel.target_part
        name = os.path.basename(ip.partname)
        images[rel.rId] = name
        with open(os.path.join(IMG_DIR, name), "wb") as f:
            f.write(ip.blob)
        print(f"[IMG] {name}")

# 2. Helper: get image refs in a paragraph
def para_imgs(p):
    found = []
    for run in p.runs:
        if "blip" not in run._element.xml:
            continue
        root = ET.fromstring(run._element.xml)
        for blip in root.iter(DNSa + "blip"):
            rId = blip.get(DNSr + "embed")
            if rId and rId in images:
                found.append(images[rId])
    return found

# 3. Helper: render runs with bold/italic
def render(p):
    out = []
    for run in p.runs:
        t = run.text
        if not t:
            continue
        b, i = bool(run.bold), bool(run.italic)
        if b and i:
            t = f"***{t}***"
        elif b:
            t = f"**{t}**"
        elif i:
            t = f"*{t}*"
        out.append(t)
    return "".join(out)

def is_list(p):
    return p._element.find(f".//{WNS}numPr") is not None

# 4. Section heading detection
TOP_SECTIONS = [
    "1. Tổng quan nhanh",
    "2. Lỗ hổng hoạt động như thế nào?",
    "3. Các biến thể và Phân loại",
    "4. Hướng dẫn khai thác thực tế",
    "5. Checklist Kiểm thử và Nhận diện",
    "6. Cách phòng ngừa và Khắc phục",
]
SUB_PREFIXES = ("2.1.", "2.2.", "4.1.", "4.2.", "4.3.", "4.4.", "4.5.", "4.6.")

# HTTP header patterns that signal a code block
HTTP_SIGNALS = (
    "GET /", "POST /", "PUT /", "DELETE /", "OPTIONS /", "PATCH /",
    "HTTP/1.1", "HTTP/2",
    "Host:", "Origin:", "Cookie:", "Authorization:",
    "Access-Control-Allow-Origin", "Access-Control-Allow-Credentials",
    "Access-Control-Allow-Methods", "Access-Control-Allow-Headers",
    "Access-Control-Max-Age", "Access-Control-Request-Method",
    "Access-Control-Request-Headers", "Access-Control-Allow-Origin:",
)

JS_SIGNALS = (
    "var req", "let req", "const req",
    "req.onload", "req.open", "req.withCredentials", "req.send",
    "function req", "location=", "location =",
)

# 5. Build MDX
out = []
out.append("""---
title: "CORS: Chia sẻ tài nguyên đa nguồn gốc"
description: "Phân tích toàn diện lỗ hổng CORS (Cross-Origin Resource Sharing) — từ nguyên lý Same-Origin Policy (SOP), cơ chế nới lỏng bằng HTTP headers, các kịch bản khai thác thực tế như phản chiếu Origin, null whitelist, XSS qua trust chain, TLS downgrade, đến các biện pháp phòng ngừa."
date: "2026-04-29"
category: "vulnerability"
tags: ["cors", "sop", "cross-origin", "owasp", "web-security", "same-origin-policy"]
thumbnail: ""
external_link: ""
---
""")

paras = doc.paragraphs
i = 0
while i < len(paras):
    p = paras[i]
    text = p.text.strip()
    imgs = para_imgs(p)

    # Skip document title paragraph
    if i == 0 and text == "Lỗ Hổng CORS":
        i += 1
        continue

    # Image
    if imgs:
        for name in imgs:
            out.append(f"\n![Minh họa CORS](/images/vulnerabilities/cors/{name})\n")
        i += 1
        continue

    # Empty
    if not text:
        i += 1
        continue

    # Ethics warning
    if "⚠️" in text and "Cảnh báo" in text:
        body = text.replace("⚠️", "").strip()
        out.append(f'\n<Alert type="warning">\n{body}\n</Alert>\n')
        i += 1
        continue

    # Top-level section heading
    matched_top = next((s for s in TOP_SECTIONS if text.startswith(s)), None)
    if matched_top:
        out.append(f"\n## {text}\n")
        i += 1
        continue

    # Sub-section heading
    if any(text.startswith(pfx) for pfx in SUB_PREFIXES):
        out.append(f"\n### {text}\n")
        i += 1
        continue

    # HTTP code block — collect consecutive lines
    if any(text.startswith(sig) for sig in HTTP_SIGNALS) or text == "...":
        block = [text]
        i += 1
        while i < len(paras):
            nxt = paras[i].text.strip()
            if not para_imgs(paras[i]) and (
                nxt == "..." or
                any(nxt.startswith(sig) for sig in HTTP_SIGNALS)
            ):
                block.append(nxt)
                i += 1
            else:
                break
        out.append("\n```http\n" + "\n".join(block) + "\n```\n")
        continue

    # JavaScript code block
    if any(text.startswith(sig) for sig in JS_SIGNALS) or text in ("};" , "};"):
        block = [text]
        i += 1
        while i < len(paras):
            nxt = paras[i].text.strip()
            if not para_imgs(paras[i]) and (
                not nxt or
                any(nxt.startswith(sig) for sig in JS_SIGNALS) or
                nxt in ("};" , "};") or nxt.startswith("\t") or nxt.startswith("    ")
            ):
                block.append(nxt)
                i += 1
                if nxt in ("};" , "};"):
                    break
            else:
                break
        out.append("\n```javascript\n" + "\n".join(block) + "\n```\n")
        continue

    # iframe/HTML code block
    if text.startswith("<iframe"):
        block = [text]
        i += 1
        while i < len(paras):
            nxt = paras[i].text.strip()
            if not para_imgs(paras[i]) and nxt:
                block.append(nxt)
                i += 1
                if "</iframe>" in nxt:
                    break
            else:
                break
        out.append("\n```html\n" + "\n".join(block) + "\n```\n")
        continue

    # List item
    if is_list(p):
        out.append(f"- {render(p)}")
        i += 1
        continue

    # Normal paragraph
    out.append(f"\n{render(p)}\n")
    i += 1

# Checklist table (section 5 body is empty in doc — add it)
# Find and insert after "5. Checklist" section
mdx = "\n".join(out)
checklist_table = """
| Phương pháp kiểm thử | Mô tả |
|---|---|
| Thêm/sửa tiêu đề `Origin` tùy ý | Xem phản hồi có phản chiếu lại giá trị Origin trong `Access-Control-Allow-Origin` không |
| Thử `Origin: null` | Kiểm tra máy chủ có trả về `Access-Control-Allow-Origin: null` không |
| Kiểm tra whitelist regex lỗi hậu tố | Thử `hackersnormal-website.com` để bypass kiểm tra endsWith |
| Kiểm tra whitelist regex lỗi tiền tố | Thử `normal-website.com.evil.net` để bypass kiểm tra startsWith |
| Kiểm tra wildcard `*` + Credentials | Xem wildcard có bị kết hợp với `Access-Control-Allow-Credentials: true` không |
| Tìm XSS trên subdomain được tin cậy | Nếu subdomain bị XSS thì có thể khai thác CORS từ đó |
| Kiểm tra subdomain HTTP trong whitelist | Tìm subdomain dùng HTTP không mã hóa đang được tin tưởng trong cấu hình CORS |
| Kiểm tra mạng nội bộ | Gửi yêu cầu từ bên ngoài vào endpoint intranet, xem có phản hồi không |

"""

# Insert table after the section 5 intro sentence
marker = "Dưới đây là bảng tổng hợp các phương pháp để tìm ra lỗ hổng CORS."
mdx = mdx.replace(marker, marker + checklist_table)

# References
mdx += """
## Tham khảo

- [PortSwigger — CORS](https://portswigger.net/web-security/cors)
- [MDN — Cross-Origin Resource Sharing (CORS)](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [OWASP — CORS Misconfiguration](https://owasp.org/www-community/attacks/CORS_OriginHeaderScrutiny)
"""

with open(MDX_PATH, "w", encoding="utf-8") as f:
    f.write(mdx)

print(f"Done -> {MDX_PATH}")
