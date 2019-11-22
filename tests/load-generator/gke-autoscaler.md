##  Overview
In order to be able to auto scale my backend fulfillment API, I am to setup auto-scaling for kubernetes deployments based on custom metric as well as to scale cluster nodes based on resource usage.


####    Deployment Stackdriver adapter

-   Grant permission to current user

```bash
kubectl create clusterrolebinding cluster-admin-binding --clusterrole cluster-admin --user "$(gcloud config get-value account)"

kubectl create -f https://raw.githubusercontent.com/GoogleCloudPlatform/k8s-stackdriver/master/custom-metrics-stackdriver-adapter/deploy/production/adapter.yaml
```
##  References

-   [Resize nodes](https://cloud.google.com/kubernetes-engine/docs/how-to/resizing-a-cluster)

-   [Cuarom Metrics Autoscaling](https://cloud.google.com/kubernetes-engine/docs/tutorials/custom-metrics-autoscaling)