# 教材審查中心 MVP

這是一個可直接在瀏覽器執行的教材審查平台前端原型，包含：

- 工作總覽與案件處理趨勢
- 審查案件建立、搜尋、篩選與狀態管理
- 審查委員清單與工作量
- 審查表單範本管理
- 報表分析與審查面向分數
- 系統設定介面
- 新案件資料以 `localStorage` 暫存

## 執行

直接用瀏覽器開啟 `index.html` 即可。若要使用本機伺服器，可在此資料夾執行：

```bash
python -m http.server 8080
```

再開啟 <http://localhost:8080>。

## Firebase 後台資料庫

專案已包含 Firestore 接點與規則：

- `cases`：教材審查案件（名稱、送審單位、類型、委員、期限、狀態）
- `reviewers`：審查委員
- `templates`：審查表單範本
- `settings`：工作區設定

設定方式：

1. 在 Firebase Console 的「Firestore Database」建立資料庫。
2. 在「Authentication > Sign-in method」啟用「匿名」登入（目前前端以匿名工作階段連線；正式版建議改成 Google／Email 登入與角色權限）。
3. 在「專案設定 > 你的應用程式」建立 Web App，將 SDK config 填入 `firebase-config.js`。
4. 部署規則：`firebase deploy --only firestore:rules`。

目前案件頁會優先讀寫 Firestore；若尚未填入 Web App config，會自動退回 `localStorage`，方便本機預覽。

## 後續接正式系統

目前是前端 MVP，正式版可將 `app.js` 中的案件資料替換為 API，並加入登入、檔案儲存、資料庫、電子簽核、審查意見與報告產生服務。

## AI 初步審查

進入「審查案件」後，點選「AI 初步審查」，貼上教材文本即可產生初步檢核。系統每次固定比對 `課綱/十二年國民基本教育課程綱要國民中小學暨普通型高級中等校-社會領域.pdf`，不再讓使用者誤選其他課綱。系統會分析社會領域關鍵概念、學習目標、評量描述，並提供「下載 APA 7 Word 報告」功能。下載檔案為 Word 相容的 `.doc` 格式，已設定標楷體、A4 邊界與左右對齊。

正式環境請將 `setupAiReview()` 中的文字分析替換為後端 API，避免把教材內容與 API 金鑰直接放在前端。
