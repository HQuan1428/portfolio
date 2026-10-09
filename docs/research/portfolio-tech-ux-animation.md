# Portfolio cá nhân: Tech stack, UX/UI và Animation (research 2026-10-04)

> Mục tiêu: chốt stack và bắt đầu build. Ưu tiên ít code, ít dependency, dùng tính năng native của trình duyệt.
> Nguồn chính: docs chính thức, MDN, web.dev, webstatus.dev (dữ liệu Baseline), W3C/WCAG. Phần nào là ý kiến/nguồn phụ sẽ được ghi rõ.

## TL;DR

- **Stack: Astro 7 + plain modern CSS (không Tailwind) + Markdown content collections.** Astro mặc định ship 0 JS, có sẵn image optimization, i18n routing, content collections có schema; đúng loại site "content-driven" ([Why Astro](https://docs.astro.build/en/concepts/why-astro/)). Next.js/SvelteKit mạnh hơn mức cần cho một site tĩnh.
- **Animation: chỉ dùng CSS native, không JS lib.** Có ba thứ: (1) `@starting-style` cho hero reveal (Baseline 2024), (2) cross-document View Transitions (`@view-transition { navigation: auto; }`) để chuyển trang mượt, (3) scroll-driven `animation-timeline: view()` cho fade-in khi scroll. Cả (2) và (3) **chưa phải Baseline** (Firefox chưa có) nên chỉ dùng như progressive enhancement: không hỗ trợ thì vẫn hiển thị nội dung bình thường ([webstatus.dev](https://webstatus.dev/)).
- **Motion phải tinh tế:** 150–400ms, ease-out/emphasized-decelerate, chỉ dùng opacity + transform nhỏ. Bỏ custom cursor, scroll-jacking, magnetic buttons. Luôn tôn trọng `prefers-reduced-motion` (WCAG 2.3.3, MDN).
- **UX:** một trang chính gồm Hero (bạn là ai + làm gì + CTA), 3–4 project dạng case study (problem → role → solution → outcome), About/Experience, Contact và Resume PDF. Dark mode bằng `light-dark()`. Mục tiêu: LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1 ([web.dev](https://web.dev/articles/vitals)), đạt WCAG 2.2 AA.
- **Hosting: Cloudflare (Workers static assets).** Request tới static assets free và unlimited, có custom domain. Cloudflare hiện khuyên "Start new projects with Workers" ([CF Pages docs](https://developers.cloudflare.com/pages/)). Phương án dự phòng không cần thêm account: GitHub Pages. Tránh Vercel Hobby nếu có ý định nhận freelance, vì Hobby chỉ cho "non-commercial, personal use".

---

## 1. Tech stack

### 1.1 Phiên bản hiện tại (npm registry, kiểm tra 2026-10-04)

| Package | Latest | License |
|---|---|---|
| `astro` | 7.3.5 (7.0.0 phát hành 2026-06-22) | MIT |
| `next` | 16.3.8 | MIT |
| `@sveltejs/kit` | 3.0.0 | MIT |
| `vite` | 8.3.2 | MIT |
| `tailwindcss` | 4.3.3 | MIT |
| `motion` | 14.0.0 | MIT |
| `gsap` | 3.15.0 | "Standard 'no charge' license" |
| `lenis` | 1.3.26 | MIT |

Nguồn: `https://registry.npmjs.org/<pkg>/latest`.

Bối cảnh: tháng 1/2026 The Astro Technology Company gia nhập Cloudflare. Astro "stays open-source and MIT-licensed" và vẫn hỗ trợ nhiều deployment target ([Astro blog](https://astro.build/blog/joining-cloudflare/)). Astro 7 có compiler viết lại bằng Rust, build nhanh hơn 15–61%, dùng Vite 8/Rolldown ([Astro 7 blog](https://astro.build/blog/astro-7/)).

### 1.2 So sánh

| Tiêu chí | **Astro 7** | Next.js 16 (`output: 'export'`) | SvelteKit 3 (`adapter-static`) | Plain HTML/CSS (+Vite) |
|---|---|---|---|---|
| JS gửi xuống client | "Zero JS, by default"; chỉ có JS ở các island khi cần ([docs](https://docs.astro.build/en/concepts/why-astro/)) | Luôn có React runtime vì route transition chạy client-side như SPA ([docs](https://nextjs.org/docs/app/guides/static-exports)) | Svelte runtime nhỏ, có client router | 0 |
| Content (projects/blog) | Content collections: `src/content.config.ts`, `glob()` loader, schema Zod, `getCollection()`, `render()`; hỗ trợ MD/MDX/JSON/YAML ([docs](https://docs.astro.build/en/guides/content-collections/)) | Tự cấu hình MDX, không có collection có schema sẵn | Tự cấu hình (mdsvex…) | Viết tay, hoặc tự viết script build |
| Image optimization khi build tĩnh | `<Image>`/`<Picture>` từ `astro:assets`: ảnh trong `src/` được tối ưu (WebP mặc định), tự suy ra width/height để tránh CLS ([docs](https://docs.astro.build/en/guides/images/)) | **Không hỗ trợ** "Image Optimization with the default loader" khi static export; phải dùng custom loader như Cloudinary ([docs](https://nextjs.org/docs/app/guides/static-exports)) | `@sveltejs/enhanced-img` sinh avif/webp, đặt intrinsic size, tạo nhiều kích thước ([docs](https://svelte.dev/docs/kit/images)) | Tự làm |
| i18n (VI/EN) | Có sẵn: `i18n.locales`, `defaultLocale`, `prefixDefaultLocale`, `getRelativeLocaleUrl()`, fallback ([docs](https://docs.astro.build/en/guides/internationalization/)) | Static export không hỗ trợ middleware/rewrites/redirects ([docs](https://nextjs.org/docs/app/guides/static-exports)), nên phải tự tổ chức route | Không có sẵn trong core (trang adapter-static không đề cập) | Tự nhân đôi file |
| View Transitions | Native cross-document VT dùng được mà không thêm JS; `<ClientRouter />` là tùy chọn. Docs ghi: "will increasingly become unnecessary" ([docs](https://docs.astro.build/en/guides/view-transitions/)) | Thêm React/JS | Thêm JS | Native, giống Astro |
| Learning curve | Thấp: file `.astro` gần với HTML | Cao: React, RSC, client/server boundary | Trung bình | Thấp nhất, nhưng phải tự làm layout/partials/i18n/ảnh |

**Kết luận: chọn Astro.** Lý do:
- Nó là "HTML có component": dùng layout, partial, content collections, image pipeline và i18n mà không gửi JS xuống client.
- Plain HTML thì lặp header/footer và phải tự xử lý ảnh, sitemap, i18n.
- Next.js khi export tĩnh mất image optimization, mà vẫn gửi React runtime xuống client.
- SvelteKit ổn, nhưng không có lợi thế gì hơn cho một site chủ yếu là nội dung.

### 1.3 Styling: Tailwind v4 hay plain CSS

- Tailwind v4: cấu hình CSS-first bằng `@theme`, cài bằng `@import "tailwindcss"` và plugin `@tailwindcss/vite`. Yêu cầu Chrome 111 / Safari 16.4 / Firefox 128 trở lên ([v4 blog](https://tailwindcss.com/blog/tailwindcss-v4), [compat](https://tailwindcss.com/docs/compatibility)).
- CSS hiện đại đã đủ cho một site nhỏ: CSS nesting là **Baseline Widely available** (từ 2026-06-11); container queries Widely available; `light-dark()`, `text-wrap: balance`, `@starting-style` là Newly available ([webstatus.dev](https://webstatus.dev/)).
- **Đề xuất: plain CSS**, gồm một file `global.css` chứa design tokens (custom properties) và style nằm ngay trong `<style>` của từng component Astro (Astro tự scope). Không cần thêm dependency hay build step. Tailwind chỉ đáng thêm nếu bạn đã quen tay và muốn prototype nhanh. Đây là đánh giá chủ quan, không phải dữ kiện.

### 1.4 Hosting (free tier)

| Host | Free tier (nguồn chính thức) | Custom domain | Ghi chú |
|---|---|---|---|
| **Cloudflare Workers static assets / Pages** | "Requests to static assets are free and unlimited" ([Workers](https://developers.cloudflare.com/workers/static-assets/billing-and-limitations/)); Pages Free: 500 builds/tháng, 20.000 files, 25 MiB/file, 100 custom domain/project ([Pages limits](https://developers.cloudflare.com/pages/platform/limits/)) | Có | Docs Pages: "Start new projects with Workers" ([docs](https://developers.cloudflare.com/pages/)) |
| GitHub Pages | Site ≤ 1 GB, soft limit 100 GB/tháng, 10 builds/giờ (không áp dụng nếu dùng Actions workflow); không dùng cho "online business"/e-commerce ([docs](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits)) | Có (theo docs GitHub Pages; trang limits không ghi) | Đơn giản nhất nếu repo đã ở GitHub |
| Vercel Hobby | 100 GB Fast Data Transfer, 100 deployments/ngày; **"restricts users to non-commercial, personal use only"** ([docs](https://vercel.com/docs/plans/hobby)) | 50/project | Portfolio cá nhân thì ổn; nhận freelance qua site có thể bị coi là commercial (đây là diễn giải, **chưa xác minh**) |
| Netlify Free | 300 credits/tháng với hard limit, không auto-recharge; 20 credits/GB bandwidth, 15 credits/production deploy ([docs](https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/credit-based-pricing-plans/)) | Có ([pricing](https://www.netlify.com/pricing/)) | 300 credits tương đương khoảng 20 deploy/tháng nếu không tính traffic. **Chưa xác minh** điều gì xảy ra khi hết credits |

**Kết luận: Cloudflare.** Bandwidth không giới hạn cho static, không cấm dùng thương mại, có preview deploy, và Astro hiện thuộc Cloudflare. Site tĩnh Astro không cần adapter. Phương án B là GitHub Pages với GitHub Actions.

---

## 2. Công nghệ animation

### 2.1 Tính năng native: trạng thái Baseline (webstatus.dev API, 2026-10-04)

| Feature | Baseline | Chrome/Edge | Safari | Firefox |
|---|---|---|---|---|
| `@starting-style` | **Newly available** (2024-08-06) | 117 | 17.5 | 129 |
| View Transitions, same-document (`document.startViewTransition`) | **Newly available** (2025-10-14) | 111 | 18 | 144 |
| `view-transition-class` | Newly available (2025-10-14) | | | |
| **Cross-document** View Transitions (`@view-transition`) | **Limited** | 126 | 18.2 | chưa có |
| **Scroll-driven animations** (`animation-timeline`) | **Limited** | 115 | 26 | chưa có |
| `light-dark()` | Newly available (2024-05-13) | 123 | 17.5 | 120 |
| `prefers-reduced-motion` | Widely available | 74 | 10.1 | 63 |

Nguồn: `https://api.webstatus.dev/v1/features/<id>`, bổ sung bằng MDN cho [`@starting-style`](https://developer.mozilla.org/en-US/docs/Web/CSS/@starting-style), [`@view-transition`](https://developer.mozilla.org/en-US/docs/Web/CSS/@view-transition) và [`animation-timeline`](https://developer.mozilla.org/en-US/docs/Web/CSS/animation-timeline) (MDN ghi hai feature sau là "Limited availability"). Scroll-driven animations và cross-document VT đều nằm trong focus areas của **Interop 2026** ([web.dev](https://web.dev/blog/interop-2026)), nên có khả năng Firefox sẽ hỗ trợ. Đây là dự đoán, **chưa có ngày cụ thể**.

Hệ quả thiết kế: hai feature "Limited" phải là **progressive enhancement**. Nội dung mặc định luôn hiển thị; chỉ thêm animation trong `@supports`. Firefox nhận trang tĩnh, vẫn đầy đủ và không lỗi.

Những điểm chính cần nhớ:
- **Scroll-driven:** dùng `animation-timeline: view()` với `animation-range: entry 25% cover 50%`, và kiểm tra bằng `@supports (animation-timeline: view())`. Animation "running off the main thread" ([Chrome for Developers](https://developer.chrome.com/docs/css-ui/scroll-driven-animations)).
- **Cross-document VT:** cả trang nguồn lẫn trang đích phải có `@view-transition { navigation: auto; }`. Chỉ chạy với navigation same-origin. Dùng `view-transition-name` cho shared element (ví dụ thumbnail project chuyển thành hero của trang chi tiết). Chrome bỏ qua transition nếu navigation mất hơn 4 giây ([Chrome docs](https://developer.chrome.com/docs/web-platform/view-transitions/cross-document), [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/@view-transition)).
- **`@starting-style`:** chỉ áp dụng cho CSS **transitions**, không cho animations. Dùng được cho phần tử lần đầu render, chuyển từ `display: none`, hoặc popover/dialog ([MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/@starting-style)).

### 2.2 JS libs: chỉ dùng khi native không đủ

| Lib | License | Kích thước | Khi nào cần |
|---|---|---|---|
| **Motion** (motion.dev, trước đây là Framer Motion) | MIT | `animate()` mini **2.3 kB** (chỉ WAAPI), hybrid **18 kB** ([docs](https://motion.dev/docs/animate)); React `motion` component **34 kB**, `m` + `LazyMotion` khoảng **4.6 kB** cho render đầu ([docs](https://motion.dev/docs/react-reduce-bundle-size)) | Spring physics, gesture/drag, sequence phức tạp |
| **GSAP** | "Standard 'no charge' license". Webflow tài trợ nên **free kể cả commercial và mọi plugin** (SplitText, ScrollTrigger, MorphSVG…). Chỉ cấm dùng trong công cụ no-code animation cạnh tranh với Webflow ([licensing](https://gsap.com/licensing/)). **Không phải MIT/OSI** | Tự đo (gzip -9, bản 3.15.0 trên jsDelivr): core khoảng **28 kB**, ScrollTrigger khoảng **18 kB**, SplitText khoảng **3.6 kB** | Timeline phức tạp, text split reveal. SplitText mặc định thêm `aria-label` cho parent và `aria-hidden` cho các phần tử con ([docs](https://gsap.com/docs/v3/Plugins/SplitText/)) |
| **Lenis** | MIT | "a few KB" ([repo](https://github.com/darkroomengineering/lenis)); tự đo bản 1.3.26 khoảng **5.4 kB** gzip | Smooth scroll. Chạy trên native scroll, mặc định tôn trọng `prefers-reduced-motion`. Hạn chế: không hỗ trợ CSS scroll-snap (cần plugin), Safari bị giới hạn 60fps, không hoạt động qua iframe |

**Đề xuất: không cài lib nào lúc đầu.** Scroll reveal, hero reveal và page transition đều làm được bằng CSS. Smooth scroll (Lenis) thuần túy là thẩm mỹ và thay đổi cảm giác scroll native, nên bỏ qua. Nếu sau này thật sự cần split-text hoặc timeline phức tạp thì dùng Motion mini (2.3 kB) hoặc GSAP SplitText.

---

## 3. Animation chuyên nghiệp: nên và không nên

### 3.1 Nguyên tắc từ design system

- **Apple HIG, Motion** ([link](https://developer.apple.com/design/human-interface-guidelines/motion)):
  - Thêm motion có mục đích, không "for the sake of adding motion".
  - Animation thừa có thể gây phân tâm hoặc khó chịu về thể chất.
  - "Make motion optional".
  - Feedback animation nên ngắn và chính xác.
  - Tránh motion trên những tương tác lặp lại thường xuyên.
  - "Let people cancel motion": không bắt người dùng chờ animation chạy xong.
  - *(Các câu trên được paraphrase từ nội dung trang; bản fetch bị nén một phần nên có thể không đúng từng chữ.)*
- **Material Design 3, motion tokens** (giá trị lấy từ repo chính thức [`material-web/tokens/_md-sys-motion.scss`](https://github.com/material-components/material-web/blob/main/tokens/versions/v0_192/_md-sys-motion.scss); trang [m3.material.io](https://m3.material.io/styles/motion/easing-and-duration/tokens-specs) render bằng JS nên không fetch được):
  - Duration: short1–4 = 50/100/150/200ms; medium1–4 = 250/300/350/400ms; long1–4 = 450–600ms; extra-long1–4 = 700–1000ms.
  - Easing: `standard` = `cubic-bezier(0.2, 0, 0, 1)`, `standard-decelerate` = `cubic-bezier(0, 0, 0, 1)`, `emphasized-decelerate` = `cubic-bezier(0.05, 0.7, 0.1, 1)`, `emphasized-accelerate` = `cubic-bezier(0.3, 0, 0.8, 0.15)`.
  - Hướng dẫn áp dụng của M3 (enter dùng decelerate, exit dùng accelerate; phần tử càng nhỏ thì duration càng ngắn) là quy ước M3 phổ biến, nhưng **chưa xác minh trực tiếp** trên trang m3 lần này.
  - **Chưa xác minh:** M3 "Expressive" (2025) chuyển sang hệ motion dựa trên spring; token web cubic-bezier ở trên vẫn có trong repo.

**Quy tắc áp dụng cho portfolio:**
- Hover/focus: 100–200ms.
- Reveal khi scroll: 300–500ms, dùng `emphasized-decelerate`.
- Page transition: 250–400ms.
- Chỉ animate `opacity` và `transform`. Hai thuộc tính này không gây layout, nên không ảnh hưởng CLS.
- Dịch chuyển nhỏ (8–24px), không dùng scale lớn.

### 3.2 Pattern: tinh tế hay gimmick

| Pattern | Đánh giá | Lý do |
|---|---|---|
| Hero reveal (fade + translate nhỏ, stagger 2–3 dòng) | Nên dùng | Một lần duy nhất, ngắn, làm nội dung rõ hơn. Lưu ý đừng để chữ của LCP element bắt đầu từ opacity 0 quá lâu |
| Fade-in khi scroll (staggered) | Nên dùng nhưng tiết chế | Chỉ áp dụng cho card/section, mỗi phần tử một lần. Không reveal từng đoạn văn |
| Page transition (cross-fade, shared element thumbnail → hero) | Nên dùng | Giúp người dùng định hướng ("conveys status" theo HIG) |
| Hover micro-interaction (underline, lift 2px, đổi màu) | Nên dùng | Phản hồi tương tác. Cần có cùng hiệu ứng cho `:focus-visible` |
| Text split reveal | Tùy, dùng thận trọng | Cần JS và dễ phá screen reader (xem ghi chú aria của SplitText). Chỉ dùng cho một heading |
| Magnetic buttons | Không nên | Gây motion trên tương tác lặp lại, trái với HIG |
| Custom cursor | Không nên | Thay thế hành vi native, không có tác dụng trên touch, ảnh hưởng accessibility |
| Smooth scroll / scroll-jacking, parallax mạnh | Không nên | MDN nêu scaling, panning và parallax là "vestibular motion triggers" |
| Loader/intro animation trước khi xem nội dung | Không nên | Bắt người dùng chờ ("Let people cancel motion") và làm chậm LCP |

Bảng này là tổng hợp và đánh giá dựa trên các nguồn chính đã dẫn, không phải quy chuẩn chính thức.

### 3.3 Reduced motion và WCAG

- **WCAG 2.3.3 Animation from Interactions (AAA):** motion do tương tác kích hoạt phải tắt được, trừ khi motion đó là essential. Ví dụ trong guideline là parallax. Technique C39 dùng `prefers-reduced-motion` ([W3C](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html)).
- **WCAG 2.2.2 Pause, Stop, Hide (A):** nội dung chuyển động tự chạy, kéo dài hơn 5 giây và hiển thị song song với nội dung khác phải có cách pause/stop/hide ([W3C](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html)). Vì vậy không dùng marquee hay background animate vô hạn.
- **MDN:** `reduce` không có nghĩa là "không có animation". Thay scale/pan/parallax bằng fade nhẹ ([MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion)).
- **web.dev:** bỏ hiệu ứng trang trí (parallax, reveal) và giữ motion chức năng. Pattern khuyên dùng là chỉ bật animation trong `@media (prefers-reduced-motion: no-preference)` ([web.dev](https://web.dev/articles/prefers-reduced-motion)).

---

## 4. Cấu trúc UX/UI

### 4.1 Sections (một trang chính + trang chi tiết project)

Đây là khuyến nghị tổng hợp, mang tính ý kiến, không có chuẩn chính thức cho portfolio.

1. **Hero:** tên, vai trò và một câu value prop cụ thể (ví dụ "Frontend developer xây web nhanh và accessible cho …"). Kèm 1–2 CTA: "Xem projects" và "Liên hệ/Resume". Không dùng carousel.
2. **Selected work (3–4 project):** mỗi card có ảnh, tên, một dòng mô tả kết quả và tags. Trang chi tiết là **case study** theo thứ tự Problem → Role/Constraints → Approach → Outcome (số liệu nếu có) → Links (live/repo).
3. **About:** ngắn gọn, có ảnh thật, nêu stack chính.
4. **Experience:** timeline gọn gồm công ty, vai trò, thời gian và 1–2 thành tựu.
5. **Contact/CTA:** dùng `mailto:`, GitHub, LinkedIn và link Resume PDF. Bỏ form, vì form cần backend.
6. Blog/Notes: **bỏ qua** tới khi có ít nhất 3 bài. Content collections đã sẵn sàng khi cần.

### 4.2 Typography, spacing, color, dark mode

- Một font sans (variable font, tự host, `font-display: swap`) và một mono cho code. Body 16–18px, line-height khoảng 1.6, độ dài dòng khoảng 60–75ch, `text-wrap: balance` cho heading (Baseline Newly). Đây là quy ước typographic phổ biến, không có nguồn chính thức ở đây.
- Spacing scale dùng custom properties (4/8px base). Một màu accent duy nhất.
- **Dark mode:** khai báo `color-scheme: light dark`, rồi dùng `light-dark(<light>, <dark>)` cho token màu (Baseline Newly 2024-05). Trình duyệt tự theo `prefers-color-scheme` mà không cần JS. Toggle thủ công: **bỏ qua** cho tới khi có người hỏi; khi cần thì đổi `color-scheme` trên `:root`.

### 4.3 Performance (Core Web Vitals, web.dev)

- **LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1**, đo ở **percentile 75**, tách mobile/desktop ([web.dev](https://web.dev/articles/vitals)).
- Astro gửi 0 JS nên INP gần như tự đạt. Ảnh dùng `<Image>` (có width/height) để giữ CLS thấp. Không lazy-load ảnh hero.

### 4.4 SEO cơ bản

- Mỗi trang có `<title>`, `<meta name="description">`, `<link rel="canonical">`, `<html lang="vi|en">`.
- Open Graph gồm `og:title`, `og:description`, `og:image` (1200×630 là kích thước phổ biến, **chưa xác minh** từ nguồn chính) và `og:url` ([ogp.me](https://ogp.me/)). Một ảnh OG tĩnh là đủ, không cần tạo động.
- Sitemap dùng `@astrojs/sitemap` ([docs](https://docs.astro.build/en/guides/integrations-guide/sitemap/)), thêm `robots.txt`. Nếu làm i18n thì thêm `hreflang`.

### 4.5 Accessibility (WCAG 2.2 AA)

- Contrast chữ **4.5:1**, chữ lớn **3:1** (SC 1.4.3); UI/đồ họa **3:1** (SC 1.4.11). Kiểm tra cả light và dark theme.
- Focus luôn nhìn thấy được (2.4.7) và không bị header sticky che hoàn toàn (**2.4.11 Focus Not Obscured (Minimum), AA**, mới trong 2.2).
- **2.5.8 Target Size (Minimum), AA:** vùng bấm tối thiểu 24×24 CSS px ([W3C new in 2.2](https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/)).
- Dùng semantic HTML: `header/nav/main/section/footer`, heading đúng thứ tự, có skip link, ảnh có `alt`.

### 4.6 Ví dụ để tham khảo (chỉ là ví dụ, không phải nguồn chuẩn; **chưa kiểm tra lại** tình trạng hay stack hiện tại)

- https://brittanychiang.com: bố cục một trang rõ ràng, phần experience gọn.
- https://www.joshwcomeau.com: micro-interaction có chủ đích.
- https://rauno.me: motion tinh tế, tối giản.
- https://leerob.com: tối giản, tập trung vào chữ.

---

## 5. Kế hoạch bắt đầu

### 5.1 Lệnh khởi tạo

```bash
npm create astro@latest .   # template minimal, TypeScript strict
npx astro add sitemap       # chỉ thêm integration này
```

Đặt `site: 'https://<domain>'` trong `astro.config.mjs` (sitemap cần giá trị này). Deploy bằng cách đưa thư mục `dist/` lên Cloudflare (Workers static assets) hoặc GitHub Pages.

### 5.2 Cấu trúc thư mục

```
src/
  content.config.ts          # collection "projects" (schema: title, summary, cover: image(), tags, order, links)
  content/projects/*.md      # mỗi project là một case study
  layouts/Base.astro         # <head> SEO/OG, header, footer, global.css
  pages/
    index.astro              # hero, work, about, experience, contact
    projects/[slug].astro    # getStaticPaths từ getCollection('projects')
    404.astro
  styles/global.css          # tokens, dark mode, motion
  assets/                    # ảnh để Astro optimize
public/
  resume.pdf  og.png  favicon.svg  robots.txt
```

i18n: **bắt đầu với một ngôn ngữ.** Nhà tuyển dụng quốc tế thì chọn EN; thị trường VN thì chọn VI. Khi cần ngôn ngữ thứ hai, thêm `i18n: { locales: ['en','vi'], defaultLocale: 'en' }` và thư mục `pages/vi/` ([docs](https://docs.astro.build/en/guides/internationalization/)).

### 5.3 `src/content.config.ts`

```ts
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    summary: z.string(),
    cover: image(),
    tags: z.array(z.string()),
    order: z.number(),
    live: z.string().url().optional(),
    repo: z.string().url().optional(),
  }),
});

export const collections = { projects };
```

(Dạng `schema: ({ image }) => …` lấy theo docs content collections hoặc images. Bản fetch chỉ xác nhận có helper `image()`, **chưa đối chiếu cú pháp chính xác** trên Astro 7.)

### 5.4 `src/styles/global.css`: tokens, dark mode, motion

```css
:root {
  color-scheme: light dark;
  --bg: light-dark(#fafafa, #0b0b0c);
  --fg: light-dark(#18181b, #ededed);
  --muted: light-dark(#52525b, #a1a1aa);   /* kiểm tra contrast ≥ 4.5:1 */
  --accent: light-dark(#2563eb, #60a5fa);
  --ease-out: cubic-bezier(0.05, 0.7, 0.1, 1);  /* M3 emphasized-decelerate */
  --dur-fast: 150ms;
  --dur-med: 400ms;
}
body { background: var(--bg); color: var(--fg); }
h1, h2 { text-wrap: balance; }

:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; }
html { scroll-padding-top: 5rem; } /* header sticky không che focus/anchor (WCAG 2.4.11) */

/* Tất cả motion chỉ bật khi user không yêu cầu reduce */
@media (prefers-reduced-motion: no-preference) {

  /* 1. Hero reveal khi tải trang, dùng @starting-style (Baseline) */
  .hero > * {
    transition: opacity var(--dur-med) var(--ease-out),
                translate var(--dur-med) var(--ease-out);
    @starting-style { opacity: 0; translate: 0 16px; }
  }
  .hero > :nth-child(2) { transition-delay: 80ms; }
  .hero > :nth-child(3) { transition-delay: 160ms; }

  /* 2. Fade-in khi scroll. Chỉ chạy nếu trình duyệt hỗ trợ, nếu không thì nội dung vẫn hiển thị */
  @supports (animation-timeline: view()) {
    .reveal {
      animation: reveal linear both;
      animation-timeline: view();
      animation-range: entry 10% cover 30%;
    }
    @keyframes reveal {
      from { opacity: 0; translate: 0 24px; }
    }
  }

  /* 3. Page transition giữa các trang (cross-document). Trình duyệt không hỗ trợ sẽ bỏ qua */
  @view-transition { navigation: auto; }

  /* 4. Hover micro-interaction, áp dụng cả cho focus */
  .card { transition: translate var(--dur-fast) var(--ease-out); }
  .card:is(:hover, :focus-within) { translate: 0 -2px; }
}
```

Shared element (thumbnail project chuyển thành ảnh hero của trang chi tiết): đặt cùng một tên duy nhất ở cả hai trang.

```astro
<!-- card trên index.astro -->
<Image src={p.data.cover} alt="" style={`view-transition-name: cover-${p.id}`} />
<!-- projects/[slug].astro -->
<Image src={entry.data.cover} alt={entry.data.title} style={`view-transition-name: cover-${entry.id}`} />
```

Ghi chú:
- Đặt `@view-transition` bên trong `@media (prefers-reduced-motion: no-preference)` là hợp lệ theo CSS Conditional Rules (at-rule cấp cao nhất có thể lồng trong `@media`). Pattern này cũng phổ biến trong tài liệu cộng đồng, nhưng **chưa tìm được ví dụ trên MDN hoặc developer.chrome.com**. Nếu muốn chắc chắn: để `@view-transition` ở top-level và thêm `@media (prefers-reduced-motion: reduce) { ::view-transition-group(*), ::view-transition-old(*), ::view-transition-new(*) { animation: none; } }`.
- Hero reveal: transition dùng `translate`/`opacity` nên không gây CLS. Giữ tổng thời gian dưới khoảng 0.6s để không làm LCP trông chậm. Mối liên hệ giữa opacity 0 ban đầu và cách Chrome đo LCP **chưa xác minh**, cần đo thực tế bằng Lighthouse.
- Không cần dòng JS nào cho toàn bộ phần trên.

### 5.5 Checklist trước khi deploy

- [ ] Lighthouse/PageSpeed: LCP ≤ 2.5s, CLS ≤ 0.1 trên mobile.
- [ ] Bật "Reduce motion" trong OS: không còn translate hay transition trang.
- [ ] Mở bằng Firefox: mọi nội dung hiển thị (không có view timeline, không có cross-doc VT).
- [ ] Đi hết trang bằng Tab: focus luôn thấy được, không bị header che.
- [ ] Contrast của `--muted` và `--accent` đạt yêu cầu ở cả hai theme.
- [ ] OG preview hiển thị đúng (title, description, ảnh).

**Đã bỏ qua:** Tailwind, JS animation lib, Lenis, `<ClientRouter />`, toggle theme, i18n, blog, contact form. Thêm khi có nhu cầu thật: cần ngôn ngữ thứ hai, có từ 3 bài viết, hoặc cần tương tác mà CSS không làm được.

---

## Chưa xác minh / cần lưu ý

- Cú pháp chính xác `schema: ({ image }) => …` trên Astro 7.
- Vercel Hobby: nhận freelance qua portfolio có bị coi là "commercial" không.
- Netlify Free: điều gì xảy ra khi hết 300 credits.
- Hướng dẫn áp dụng duration/easing của M3 (enter/exit, kích thước phần tử) và chi tiết hệ spring của M3 Expressive: không fetch được m3.material.io.
- Trích dẫn Apple HIG được paraphrase vì bản fetch bị nén mất chữ.
- `@view-transition` lồng trong `@media`: chưa có ví dụ từ nguồn chính.
- Kích thước OG image 1200×630; trạng thái hiện tại của các portfolio ví dụ.
- Thời điểm Firefox hỗ trợ scroll-driven animations và cross-document VT (chỉ biết nằm trong Interop 2026).

## Sources

- npm registry: https://registry.npmjs.org/ (astro, next, @sveltejs/kit, vite, tailwindcss, motion, gsap, lenis)
- webstatus.dev API (Baseline): https://api.webstatus.dev/v1/features/ (scroll-driven-animations, view-transitions, cross-document-view-transitions, starting-style, light-dark, prefers-reduced-motion, nesting, text-wrap-balance, view-transition-class, container-queries)
- Astro joins Cloudflare: https://astro.build/blog/joining-cloudflare/
- Astro 7: https://astro.build/blog/astro-7/
- Why Astro: https://docs.astro.build/en/concepts/why-astro/
- Astro content collections: https://docs.astro.build/en/guides/content-collections/
- Astro images: https://docs.astro.build/en/guides/images/
- Astro i18n: https://docs.astro.build/en/guides/internationalization/
- Astro view transitions: https://docs.astro.build/en/guides/view-transitions/
- Astro sitemap: https://docs.astro.build/en/guides/integrations-guide/sitemap/
- Next.js static exports: https://nextjs.org/docs/app/guides/static-exports
- SvelteKit adapter-static: https://svelte.dev/docs/kit/adapter-static
- SvelteKit images: https://svelte.dev/docs/kit/images
- Tailwind v4: https://tailwindcss.com/blog/tailwindcss-v4 , https://tailwindcss.com/docs/compatibility
- Cloudflare Pages: https://developers.cloudflare.com/pages/ , https://developers.cloudflare.com/pages/platform/limits/
- Cloudflare Workers static assets: https://developers.cloudflare.com/workers/static-assets/billing-and-limitations/
- GitHub Pages limits: https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits
- Vercel Hobby: https://vercel.com/docs/plans/hobby
- Netlify credits: https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/credit-based-pricing-plans/ , https://www.netlify.com/pricing/
- MDN `animation-timeline`: https://developer.mozilla.org/en-US/docs/Web/CSS/animation-timeline
- MDN View Transition API: https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API
- MDN `@view-transition`: https://developer.mozilla.org/en-US/docs/Web/CSS/@view-transition
- MDN `@starting-style`: https://developer.mozilla.org/en-US/docs/Web/CSS/@starting-style
- MDN `prefers-reduced-motion`: https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion
- Chrome: scroll-driven animations: https://developer.chrome.com/docs/css-ui/scroll-driven-animations
- Chrome: cross-document view transitions: https://developer.chrome.com/docs/web-platform/view-transitions/cross-document
- Interop 2026: https://web.dev/blog/interop-2026
- web.dev Core Web Vitals: https://web.dev/articles/vitals
- web.dev prefers-reduced-motion: https://web.dev/articles/prefers-reduced-motion
- Motion `animate()`: https://motion.dev/docs/animate ; React bundle size: https://motion.dev/docs/react-reduce-bundle-size
- GSAP licensing: https://gsap.com/licensing/ ; SplitText: https://gsap.com/docs/v3/Plugins/SplitText/
- Lenis: https://github.com/darkroomengineering/lenis
- Material 3 motion tokens: https://github.com/material-components/material-web/blob/main/tokens/versions/v0_192/_md-sys-motion.scss (spec page: https://m3.material.io/styles/motion/easing-and-duration/tokens-specs)
- Apple HIG Motion: https://developer.apple.com/design/human-interface-guidelines/motion
- WCAG 2.3.3: https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html
- WCAG 2.2.2: https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html
- What's new in WCAG 2.2: https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/
- Open Graph protocol: https://ogp.me/
- Self-measured gzip sizes: `curl https://cdn.jsdelivr.net/npm/{gsap@3.15.0/dist/gsap.min.js,…} | gzip -9 | wc -c`
