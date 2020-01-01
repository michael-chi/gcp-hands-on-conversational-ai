##  Overview

####   設定GKE Cluster

-   [Enable HTTP](https://cloud.google.com/run/docs/gke/enabling-cluster-https)

-   [Setup](https://cloud.google.com/run/docs/gke/setup)

    -   已啟用 Cloud Run on GKE
    -   Kubernetes 版本：請參閱[建議的版本](https://cloud.google.com/run/docs/gke/cluster-versions)
    -   具備 4 vCPU 的節點
    -   存取雲端平台、寫入記錄、寫入監控的範圍

-   [Permissions](https://cloud.google.com/run/docs/deploying)

        部署時需要的權限
        
        為了順利部署到 Cloud Run，您必須具備「擁有者」或「編輯者」角色，或是必須具備「Cloud Run 管理員」角色並且已完成額外設定。

        為了順利部署服務到 Cloud Run on GKE，您必須具備「擁有者」、「編輯者」、「GKE 管理員」或「GKE 開發人員」角色。

-   如果GKE需要存取其他Project中的Container Repository, 請將預設的Compute Engine Service Account，或是先前指定用於GKE的Service Account加到該Project的Storage Admin及Storage Object Viewer

    Servive Account預設為[Project-Number]-compute@developer.gserviceaccount.com


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

# Please edit the object below. Lines beginning with a '#' will be ignored,
# and an empty file will abort the edit. If an error occurs while saving this file will be
# reopened with the relevant failures.
#   -- configmap
#   apiVersion: v1
#   data:
#     istio.sidecar.includeOutboundIPRanges: '10.40.0.0/14,10.232.0.0/20'
#   kind: ConfigMap
#   metadata:
```

####   設定HTTPS

```shell
wget https://dl.eff.org/certbot-auto
chmod a+x ./certbot-auto
./certbot-auto --help
./certbot-auto certonly --manual --preferred-challenges dns -d '*.michaelchi.net'
# IMPORTANT NOTES:
#  - Congratulations! Your certificate and chain have been saved at:
#    /etc/letsencrypt/live/michaelchi.net/fullchain.pem
#    Your key file has been saved at:
#    /etc/letsencrypt/live/michaelchi.net/privkey.pem
#    Your cert will expire on 2020-03-30. To obtain a new or tweaked
#    version of this certificate in the future, simply run certbot-auto
#    again. To non-interactively renew *all* of your certificates, run
#    "certbot-auto renew"
sudo cp /etc/letsencrypt/live/michaelchi.net/fullchain.pem .
sudo cp /etc/letsencrypt/live/michaelchi.net/privkey.pem .


sudo chown root:kalschi ./fullchain.pem
sudo chown root:kalschi ./privkey.pem
chmod 640 ./fullchain.pem
sudo chmod 640 ./fullchain.pem
sudo chmod 640 ./privkey.pem

kubectl create --namespace istio-system secret tls istio-ingressgateway-certs \
--key privkey.pem \
--cert fullchain.pem

#   Edit knative-ingress-gateway
kubectl edit gateway knative-ingress-gateway --namespace knative-serving

# Please edit the object below. Lines beginning with a '#' will be ignored,
# and an empty file will abort the edit. If an error occurs while saving this file will be
# reopened with the relevant failures.
#
# apiVersion: networking.istio.io/v1alpha3
# kind: Gateway
# metadata:
#   creationTimestamp: "2019-12-31T01:28:11Z"
#   generation: 1
#   labels:
#     addonmanager.kubernetes.io/mode: EnsureExists
#     networking.knative.dev/ingress-provider: istio
#     serving.knative.dev/release: v0.9.0-gke.8
#   name: knative-ingress-gateway
#   namespace: knative-serving
#   resourceVersion: "1097"
#   selfLink: /apis/networking.istio.io/v1alpha3/namespaces/knative-serving/gateways/knative-ingress-gateway
#   uid: ce0fa524-390b-4d01-a5ef-119f608708ad
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

```shell
kubectl get service istio-ingressgateway --namespace istio-system

# NAME                   TYPE           CLUSTER-IP    EXTERNAL-IP     PORT(S)                                                       
# istio-ingressgateway   LoadBalancer   10.232.3.60   34.80.247.232   15020:31552/TCP,80:30627/TCP,443:30305/TCP,31400:30953/TCP,15029:31049/TCP,15030:31850/TCP,15031:32266/TCP,15032:30584/TCP,15443:30280/TCP   43m

export MY_DOMAIN=michaelchi.net
kubectl patch configmap config-domain --namespace knative-serving --patch \
'{"data": {"example.com": null, "'$MY_DOMAIN'": ""}}'
```

-   到DNS Provider(如Godaddy)加入一筆A Record, 將“*"指向剛剛取得的External IP


####  部署Cloud Run

[Container Contract](https://cloud.google.com/run/docs/reference/container-contract)

-   設定必要權限(https://cloud.google.com/run/docs/reference/iam/roles#additional-configuration)

    我的映像檔放在asia.gcr.io/kalschi-demo-001/conversational-ai-demo:latest

```shell
export CLOUD_RUN_SERVICE=cloud-run-gke
export CONTAINER_IMAGE_URL=asia.gcr.io/kalschi-demo-001/conversational-ai-demo:latest

gcloud beta run deploy $CLOUD_RUN_SERVICE --image $asia.gcr.io/kalschi-demo-001/conversational-ai-demo:latest --platform gke \
--namespace $NAMESPACE
```

-   更新環境變數

```shell
gcloud beta run services update $CLOUD_RUN_SERVICE --platform gke --namespace $NAMESPACE --update-env-vars PROJECT_ID=kalschi-chatbot-workshop-demo,LOCATION=global,\MAP_KEY=AIzaSyAbToxzDS7gN8t5Yp9zbBA909WampEXTqI,BIGDATA_TOPICNAME=kalschi-bot-event-publisher,LOCAL_SYSTEM_URL=http://192.168.1.2/
#   PROJECT_ID=kalschi-demo-001
#   LOCATION=global
#   MAP_KEY=AIzaSyAbToxzDS7gN8t5Yp9zbBA909WampEXTqI
#   TEST_URL=https://maps.googleapis.com/maps/api/staticmap?center=%E5%8F%B0%E5%8C%97%E7%81%AB%E8%BB%8A%E7%AB%99&zoom=18&size=600x300&maptype=roadmap&markers=color:red%7Clabel:Dest%7C25.033976,121.5645389&key=AIzaSyAbToxzDS7gN8t5Yp9zbBA909WampEXTqI
#   BIGDATA_TOPICNAME=kalschi-bot-event-publisher
#   LOCAL_SYSTEM_URL=http://192.168.1.2/
```

####    Auto Scaling

```shell
gcloud container clusters update $CLUSTER_NAME --enable-autoscaling \
    --min-nodes 1 --max-nodes 2 --zone $ZONE --node-pool default-pool 
```


####    Trobleshootibg

-   Run below to check failing reasions

```shell
kubectl descrive ksvc --namespace $NAMESPACE
```


##  Godaddy

```shell
openssl req -new -newkey rsa:2048 -nodes -keyout server.key -out server.csr

#   ...

kubectl create --namespace istio-system secret tls istio-ingressgateway-certs --key private.pem --cert 214c2d3a774706a1.pem
```


-   Reference

    -   https://stackoverflow.com/questions/43207922/how-do-i-get-the-private-key-for-a-godaddy-certificate-so-i-can-install-it-on-ub