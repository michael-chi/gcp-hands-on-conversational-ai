
#### Development Environment Setup

-   下載並安裝 nvm

    -   [Windows](https://github.com/coreybutler/nvm-windows/releases)

    -   [MacOS](https://www.chrisjmendez.com/2018/02/07/install/)

-   透過nvm安裝node.js

```bash
nvm install 10.17.0
```

-   下載並安裝 [Google Cloud SDK](https://cloud.google.com/sdk/docs/downloads-interactive)

####    Create Service Account

Service Account跟Azure上的Service Principal類似；在GCP上，我們透過Service Account操作各種服務，同時針對Service Account指定權限，決定他們可以與哪些服務互動．在這裡，我們會建立一個Service Account並賦予它相對應的權限存取需要的服務．

-   到GCP Console, IAM, Service Account, 建立一個新的Service Account

<img src="./img/create-service-account.png"/>

-   給與Cloud Functions Admin與Translation API User角色，並記下Serivce Account Id

<img src="./img/service-account-roles.png"/>

-   建立完成後，選擇剛剛的Service Account，建立一個新的Key；這會下載一個Json檔案，將檔案改名為service-account-key.json後複製到keys目錄中．

    -   為了確保安全性，在Production環境中，我們不會把Service Account Key發佈到生產環境；而是透過指定服務的Service Account的方式，指定GCP用哪一個Service Account操作這些服務．這裡只是為了本機測試需要才將檔案下載．

<img src="./img/service-account-create-key.png"/>

