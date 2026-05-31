# One Last Time.

![Next.js](https://img.shields.io/badge/Next.js_15-000000?style=flat-square&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Three.js](https://img.shields.io/badge/Three.js-000000?style=flat-square&logo=threedotjs&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=flat-square&logo=framer&logoColor=white)
![GSAP](https://img.shields.io/badge/GSAP-88CE02?style=flat-square&logo=greensock&logoColor=black)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=black)

> *ini bukan website biasa.*

---

sebuah pengalaman interaktif yang gw buat untuk satu orang.  
bukan untuk portfolio. bukan untuk hackathon.  
hanya untuk bilang hal-hal yang susah diucapkan langsung.

---

## apa ini?

sebuah *cinematic storytelling experience* kamu scroll, kamu baca, kamu rasakan.  
dibangun dengan obsesi terhadap detail dan terlalu banyak waktu luang.

ada galaxy yang bisa kamu zoom in.  
ada surat yang ditulis sambil mengetik.  
ada password yang hanya satu orang yang tahu.  
ada heart yang pecah, lalu pelan-pelan utuh lagi.

---

## perjalanan

```
/                  →  layar hitam. nama. tombol enter.
/main              →  galaxy. tiga kalimat. scroll pelan-pelan.
/what-i-realized   →  empat hal yang akhirnya gw akui.
/password          →  masukkan tanggalnya. kamu pasti tahu.
/letter            →  surat yang harusnya gw kirim dari dulu.
/memory-universe   →  foto-foto yang masih gw simpan.
/final-scene       →  akhir yang (semoga) bukan akhir.
```

---

## stack

tidak ada yang over-engineered di sini.  
semua dipilih karena alasan, bukan karena trend.

| hal | kenapa |
|-----|--------|
| ![Next.js](https://img.shields.io/badge/Next.js-000?style=flat-square&logo=nextdotjs) | app router, clean structure |
| ![Three.js](https://img.shields.io/badge/Three.js-000?style=flat-square&logo=threedotjs) | galaxy & shattered heart |
| ![GSAP](https://img.shields.io/badge/GSAP-88CE02?style=flat-square&logo=greensock&logoColor=black) | animasi yang terasa "berat" |
| ![Framer](https://img.shields.io/badge/Framer_Motion-0055FF?style=flat-square&logo=framer) | transisi yang smooth |
| ![Lenis](https://img.shields.io/badge/Lenis-000000?style=flat-square) | scroll yang tidak bikin mual |
| ![Tailwind](https://img.shields.io/badge/Tailwind_v4-06B6D4?style=flat-square&logo=tailwindcss) | utility-first, no second thoughts |
| ![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=black) | tau kalau kamu udah sampai akhir |

---

## cara jalanin

```bash
git clone https://github.com/username/one-last-time
cd one-last-time
npm install
```

buat file `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
```

```bash
npm run dev
```

buka `localhost:3000` dan pastiin headphone kamu udah kepasang.

---

## struktur folder

```
src/
├── app/                    route pages (tipis, cuma import)
├── components/
│   ├── 3d/                 galaxy, shattered heart
│   ├── audio/              ambience manager
│   ├── loaders/            studio loader, preloader
│   ├── sections/           semua halaman utama
│   └── ui/                 cursor, cards, dll
└── middleware.ts            jaga /letter biar gak sembarang akses
```

---

## catatan

tidak ada dark mode toggle karena ini memang gelap dari awal.

tidak ada light mode karena cerita ini tidak dimulai dengan cahaya.

password-nya bukan `123456`.

---

## untuk kamu yang sampai sini

kalau kamu bukan orang yang gw maksud 
terima kasih sudah main-main ke sini.

kalau kamu orang yang gw maksud 
kamu tahu apa yang harus kamu lakukan selanjutnya.

---

*dibuat dengan sungguh-sungguh.*  
*— bizar*