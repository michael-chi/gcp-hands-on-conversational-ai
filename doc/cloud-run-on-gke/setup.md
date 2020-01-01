##  Overview

整個程式流程跟先前Fully managed Cloud Run一樣, 不同處只有將Cloud Run改為Cloud Run on Anthos

基本上照著官方文件做就可以了, 我在這裡遇到問題主要有幾點

-   我的Cloud Run on Anthos需要存取位於另一個project的Container Repository. 因此權限上要[額外設定](#permissions)

-   如何以自訂Private Key產生Certificate. （[以Godaddy為例](#references)）

```mermaid
sequenceDiagram

Google Assistant ->> Dialogflow: Request Taxi
Dialogflow ->> (Cloud Run on Anthos): Send Intent Request
(Cloud Run on Anthos) -->> Pub/Sub: Publish Event
Note right of (Cloud Run on Anthos): Handled by middlewares
(Cloud Run on Anthos) ->> Google Map API: Get Map Information
Google Map API ->> (Cloud Run on Anthos): Return Geo Info
(Cloud Run on Anthos) ->> Dialogflow: Respond
Dialogflow ->> Google Assistant: Respond
Pub/Sub ->> DataFlow: Process Streaming Data
DataFlow ->> BigQuery: Ingest Data
```

####    Permissions

-   [Permissions](https://cloud.google.com/run/docs/deploying)

        部署時需要的權限
        
        為了順利部署到 Cloud Run，您必須具備「擁有者」或「編輯者」角色，或是必須具備「Cloud Run 管理員」角色並且已完成額外設定。

        為了順利部署服務到 Cloud Run on GKE，您必須具備「擁有者」、「編輯者」、「GKE 管理員」或「GKE 開發人員」角色。

-   如果GKE需要存取其他Project中的Container Repository, 請將預設的Compute Engine Service Account，或是先前指定用於GKE的Service Account加到該Project的Storage Admin及Storage Object Viewer

    Servive Account預設為[Project-Number]-compute@developer.gserviceaccount.com

####   設定GKE Cluster

-   [Enable HTTP](https://cloud.google.com/run/docs/gke/enabling-cluster-https)

-   [Setup](https://cloud.google.com/run/docs/gke/setup)

    -   已啟用 Cloud Run on GKE
    -   Kubernetes 版本：請參閱[建議的版本](https://cloud.google.com/run/docs/gke/cluster-versions)
    -   具備 4 vCPU 的節點
    -   存取雲端平台、寫入記錄、寫入監控的範圍


```shell
export CLUSTER_NAME=run-on-gke-vpn-integration
export ZONE=asia-east1-b
export NETWORK=demo-vpc
export SUBNET=data-subnet
export NAMESPACE=run-on-gke-ns

gcloud config set compute/zone asia-east1-b
gcloud services enable container.googleapis.com containerregistry.googleapis.com cloudbuild.googleapis.com
gcloud components update
gcloud components install beta
gcloud components install kubectl

#   create GKE for cloud run
gcloud beta container clusters create $CLUSTER_NAME \
--addons=HorizontalPodAutoscaling,HttpLoadBalancing,Istio,CloudRun \
--machine-type=n1-standard-4 \
--cluster-version=latest --zone=$ZONE \
--enable-stackdriver-kubernetes --enable-ip-alias \
--scopes cloud-platform \
--network $NETWORK --subnetwork $SUBNET \
--num-nodes 1

#   set default location of cloud run
gcloud config set run/cluster $CLUSTER_NAME
gcloud config set run/cluster_location $ZONE
gcloud container clusters get-credentials $CLUSTER_NAME

#   creawte k8s namespace
kubectl create namespace $NAMESPACE
gcloud config set run/namespace $NAMESPACE

#   Allow outbound network traffic
gcloud container clusters describe $CLUSTER_NAME \
| grep -e clusterIpv4Cidr -e servicesIpv4Cidr
# ...
#   clusterIpv4CidrBlock: 10.40.0.0/14
#   servicesIpv4Cidr: 10.232.0.0/20
# ...

#   Edit configmap, add allowed outbound source IP addresses
kubectl edit configmap config-network --namespace knative-serving

#   -- configmap
#   apiVersion: v1
#   data:
#     istio.sidecar.includeOutboundIPRanges: '<clusterIpv4CidrBlock>,<10.232.0.0/20>' 
#   ＃＃    例如
#   ＃＃  istio.sidecar.includeOutboundIPRanges: '10.40.0.0/14,10.232.0.0/20'
#   kind: ConfigMap
#   metadata:
```

####   設定HTTPS

-   在這裡雖然可以使用例如官網文件建議的Let's Encrypt簽發的憑證, 但Dialogflow在呼叫時會發生錯誤, 因為該憑證還是不被Dialogflow認為是安全的. 因此我需要透過GoDaddy簽發的憑證來設定我的HTTPS端點

```bash
#   Godaddy private key file: private.pem
#   Godaddy certificate file: fullchain.pem
kubectl create --namespace istio-system secret tls istio-ingressgateway-certs \
--key privkey.pem \
--cert fullchain.pem

#   Edit knative-ingress-gateway
kubectl edit gateway knative-ingress-gateway --namespace knative-serving

#   ...
# spec:
#   selector:
#     istio: ingressgateway
#   servers:
#   - hosts:
#     - '*.michaelchi.net'
#     port:
#       name: http
#       number: 80
#       protocol: HTTP
#   - hosts:
#     - "*.michaelchi.net"
#     port:
#       name: https
#       number: 443
#       protocol: HTTPS
#     tls:
#       mode: SIMPLE
#       privateKey: /etc/istio/ingressgateway-certs/tls.key
#       serverCertificate: /etc/istio/ingressgateway-certs/tls.crt  
```

####   改變網域

-   取得External IP. 這也是我們的Cloud Run on Anthos的端點. 然後到DNS provider網站上設定A Record將FQDN指向此IP位址

```shell
#   取得External IP
kubectl get service istio-ingressgateway --namespace istio-system

# NAME                   TYPE           CLUSTER-IP    EXTERNAL-IP     PORT(S)                                                       
# istio-ingressgateway   LoadBalancer   10.232.3.60   12.34.247.232   15020:31552/TCP,80:30627/TCP,443:30305/TCP,31400:30953/TCP,15029:31049/TCP,15030:31850/TCP,15031:32266/TCP,15032:30584/TCP,15443:30280/TCP   43m
```

-   改變Cloud Run on Anthos預設domain name

```shell
export MY_DOMAIN=michaelchi.net
kubectl patch configmap config-domain --namespace knative-serving --patch \
'{"data": {"example.com": null, "'$MY_DOMAIN'": ""}}'
```

####  部署Cloud Run

[Container Contract](https://cloud.google.com/run/docs/reference/container-contract)

-   設定必要權限(https://cloud.google.com/run/docs/reference/iam/roles#additional-configuration)

    我的映像檔放在asia.gcr.io/kalschi-demo-001/conversational-ai-demo:latest

```shell
export CLOUD_RUN_SERVICE=cloud-run-gke
export CONTAINER_IMAGE_URL=asia.gcr.io/kalschi-demo-001/conversational-ai-demo:latest

gcloud beta run deploy $CLOUD_RUN_SERVICE --image asia.gcr.io/kalschi-demo-001/conversational-ai-demo:latest --platform gke \
--namespace $NAMESPACE
```

-   將必要的環境變數傳入Cloud Run on Anthos, 在Container中會以環境變數的方式存取

```bash
gcloud beta run services update $CLOUD_RUN_SERVICE --platform gke --namespace $NAMESPACE --update-env-vars PROJECT_ID=kalschi-chatbot-workshop-demo,LOCATION=global,\MAP_KEY=xxxxxx,BIGDATA_TOPICNAME=kalschi-bot-event-publisher,LOCAL_SYSTEM_URL=http://192.168.1.2/
#   PROJECT_ID=kalschi-demo-001
#   LOCATION=global
#   MAP_KEY=xxxx
#   BIGDATA_TOPICNAME=kalschi-bot-event-publisher
#   LOCAL_SYSTEM_URL=http://192.168.1.2/
```

####    Auto Scaling

-   如果需要, 可以針對GKE設定Auto-Scaling

```shell
gcloud container clusters update $CLUSTER_NAME --enable-autoscaling \
    --min-nodes 1 --max-nodes 2 --zone $ZONE --node-pool default-pool 
```

####    Trobleshootibg

-   Run below to check failing reasions

```shell
kubectl descrive ksvc --namespace $NAMESPACE
```

####  建立並安裝憑證

```shell
openssl req -new -newkey rsa:2048 -nodes -keyout server.key -out server.csr

#   ... create cert with the key generated above in your SSL authority, ex, GoDaddy
kubectl create --namespace istio-system secret tls istio-ingressgateway-certs --key server.key --cert <GET CERT FROM YOUR AUTHORITY>.pem
```


####    References

-   [Godaddy自訂憑證Privae Key](https://stackoverflow.com/questions/43207922/how-do-i-get-the-private-key-for-a-godaddy-certificate-so-i-can-install-it-on-ub)

-   Let's Encrypt憑證產生方式

```bash
wget https://dl.eff.org/certbot-auto
chmod a+x ./certbot-auto
./certbot-auto --help
./certbot-auto certonly --manual --preferred-challenges dns -d '*.michaelchi.net'

sudo cp /etc/letsencrypt/live/michaelchi.net/fullchain.pem .
sudo cp /etc/letsencrypt/live/michaelchi.net/privkey.pem .

sudo chown root:kalschi ./fullchain.pem
sudo chown root:kalschi ./privkey.pem
chmod 640 ./fullchain.pem
sudo chmod 640 ./fullchain.pem
sudo chmod 640 ./privkey.pem
```