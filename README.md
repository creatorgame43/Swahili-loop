# 🌐 SWAHILI LOOP: Mradi wa Video Fupi (TikTok Clone)

## Utangulizi
Karibu kwenye **Swahili Loop**, jukwaa bunifu la video fupi lililoundwa kwa ajili ya jamii.
Mradi huu unajengwa kwa kutumia React na React Native, ukilenga kutoa uzoefu wa kirafiki na wenye usalama.

### ✨ Brand Identity
- **Imeanzishwa na:** Salehe Shabani Omary (SSO)
- **Muonekano:** [SSO] Innovation, Accessibility, Community.

## ⚙️ Teknolojia Zinazotumika

| Eneo | Teknolojia | Maelezo |
| :--- | :--- | :--- |
| **Front-end** | React / Next.js (Kwa Web View) | Framework ya msingi ya UI/UX |
| **Mobile App** | React Native (Expo) | Kuunda App ya Android na iOS |
| **Styling** | CSS Modules / Tailwind CSS | Kwa ajili ya muonekano wa kisasa na 'Anti-hack theme' |
| **Deployment** | Vercel | Kwa ajili ya kuchezesha tovuti (Website Hosting) |
| **Versioning** | GitHub | Kwa ajili ya usimamizi wa source code |

## 📦 Muundo wa Mradi (Component Structure)

Mradi huu unajengwa kwa vipengele vifuatavyo vya msingi:

1.  **`Auth.tsx`**: Usimamizi wa Ku_Login na Kujisajili.
    * *Sifa Maalum:* Muonekano wa Anti-hack na System Scanning Animation.
2.  **`VideoFeed.tsx`**: Skrini Kuu ya Video (For You Page).
    * *Sifa Maalum:* FlatList yenye Snap-to-Interval kwa scrolling laini.
3.  **`SettingsScreen.tsx`**: Skrini ya Mipangilio na Faragha (Mfumo wa TikTok).

## 🚀 Ku-Deploy kwa Kutumia Vercel (Mwongozo)

Mradi huu umepangwa ku-deploywa kwa urahisi kwenye Vercel:

### Hatua za Kuanzisha (Setup)

1.  **Clone Repository:**
    ```bash
    git clone [https://github.com/yahoo](https://github.com/yahoo)
    cd swahili-loop
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    # AU
    yarn install
    ```

3.  **Run Locally (Dev Server):**
    ```bash
    npm run dev
    # AU
    yarn dev
    ```

### Kuunganisha na Vercel

1.  **Fungua Akaunti ya Vercel:** Hakikisha una akaunti iliyounganishwa na GitHub.
2.  **Import Project:** Ingia Vercel, chagua **"New Project"**, kisha chagua repository ya **Swahili Loop** kutoka kwenye GitHub yako.
3.  **Configure:** Vercel itatambua kuwa ni mradi wa React/Next.js (ikiwa utatumia Next.js) na itapendekeza mipangilio chaguomsingi.
4.  **Deploy:** Bonyeza **"Deploy"**. Website yako itaanza kucheza mtandaoni chini ya domain ya Vercel!

---

## 🔒 Vifungu vya Usalama

**Auth.tsx** imewekwa katika muonekano wa 'Anti-Hack' kuonyesha umakini wetu katika usalama wa data. Hatua za usalama ni pamoja na:

* **Salting na Hashing:** Nenosiri litapaswa kuhifadhiwa kwa kutumia algoriti kali (kama vile bcrypt).
* **Tokenization:** Kutumia JWTs (JSON Web Tokens) kwa ajili ya vikao salama.

## 🤝 Mchango (Contributing)

CEO Salehe Shabani Omary (SSO) anakaribisha michango (contributions) kutoka kwa developers wengine.

1.  **Fork** repository hii.
2.  Unda **Branch** mpya: `git checkout -b feature/jina-la-feature`
3.  Fanya **Changes** zako.
4.  **Commit** mabadiliko yako: `git commit -m 'feat: nimeongeza feature mpya'`
5.  **Push** kwenye Branch: `git push origin feature/jina-la-feature`
6.  Fungua **Pull Request** kwenye GitHub.

---
