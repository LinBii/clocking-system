# PUNCHIN 乓去映

PUNCHIN 乓去映 是一個使用 Vue 3、Node.js 及 MySQL 打造出的考勤記錄系統。使用者(user)在註冊之後，能夠透過一般按鈕、掃描 QRCode、GPS 定位按鈕三種方式打卡上下班。管理者(admin)也能透過後台查看出缺勤及使用者的狀態，並能夠產生打卡用的 QR Code。

# 功能

登入註冊相關

- 使用者可以註冊帳號。
- 除了註冊和登入頁，使用者一定要登入才能使用網站。
- 登入密碼錯誤五次將會上鎖（目前沒有解鎖方法）。
- 使用者可以在設定頁面重新設定帳戶資訊（密碼）。

打卡相關

- 使用者可以使用一般打卡頁面的按鈕打卡。
- QR Code 打卡（需開啟攝影機功能）
  - 使用者可以透過專屬的 QR Code 讀取器進行打卡。
  - 管理者可以產生每天變化的 QR Code。
- GPS 打卡（需開啟定位功能）
  - 在公司 400 公尺範圍內，頁面的按鈕就會啟動，可以打卡。
- 在非工作日的時候，無法使用打卡功能（工作日與非工作日之判定，以[中華民國政府行政機關辦公日曆表](https://data.gov.tw/dataset/14718)為準）。
- 打卡判定：
  - 第一次打卡是上班打卡。
  - 當天第二次打卡是下班打卡。若多次打卡，下班打卡時間以最後一次打卡為準。
  - 缺勤定義：
    1. 上下班打卡間隔時間少於八小時。
    2. 只打卡一次。

後台相關

- 經過授權的管理者可以進入網站後台。
- 管理者可以在後台查看打卡清單、使用者名單以及缺勤名單。
- 管理者可以將缺勤記錄改為出勤。
- 在換日時間（GMT+8 05:00）之後，管理者會收到缺勤的使用者名單信件。
- 使用者帳號上鎖時，管理者會收到信件通知。

## 正在開發中的功能

後台相關

- 管理者可以解鎖使用者的帳號。

# 專案安裝步驟

## 共用

1. 下載專案

   ```
   git clone https://github.com/LinBii/clocking-system.git
   ```

2. 切換到存放此專案的資料夾

   ```
   cd clocking-system
   ```

## 前端

1. 切換到前端資料夾

   ```
   cd frontend
   ```

2. 安裝 npm 套件

   ```
   npm install
   ```

3. 若需進行本地開發

   ```
   npm run dev
   ```

4. 打包

   ```
   npm run build
   ```

5. 預覽打包內容

   ```
   npm run preview
   ```

## 後端

1. 切換到後端資料夾

   ```
   cd server
   ```

2. 安裝 npm 套件

   ```
   npm install
   ```

3. 創建資料庫（建議使用 MySQL Workbench）

   ```
   create database punchin_sequelize;
   ```

4. 調整.env 環境變數

5. 建立 migration

   ```
   npx sequelize db:migrate
   ```

6. 建立種子資料

   ```
   npx sequelize db:seed:all
   ```

7. 啟動伺服器執行檔案

   ```
   npm run start
   ```

8. 若看見以下訊息則代表順利運作
   ```
   Clock-in server listening on port 3000
   ```

# 測試帳號

- 管理者帳號: admin 密碼: titaner （具有管理者權限）
- 使用者帳號: user 密碼: titaner （不具有管理者權限）

# 開發工具

## 共用

- dayjs 1.11.7

## 前端

- axios 1.2.1
- vue 3.2.13
- vue-router 4.0.3
- vuex 4.0.0
- vite 4.0.3
- qrcode.vue 3.3.3
- vue3-qr-reader 1.0.0
- leaflet 1.9.3
- bootstrap 5.1.3
- sweetalert2 11.6.16

## 後端

- express 4.18.2
- express-session 1.17.3
- mysql2 2.3.3
- passport 0.6.0
- passport-jwt 4.0.0
- sequelize 6.27.0
- sequelize-cli 6.5.2
- dotenv 16.0.3
- bcryptjs 2.4.3
- multer 1.4.5-lts.1
- node-schedule 2.1.0
- nodemailer 6.8.0
