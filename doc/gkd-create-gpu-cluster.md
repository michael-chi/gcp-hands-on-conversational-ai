##  Overview

GPU is not available in all zones, if we want to make sure that our pods only runs on GPU-equipped nodes, or, if we want to have all our nodes only created in those zones with GPU available, there are several ways to archive this.

####    Create Node Pool in GPU zones

-   Specify --node-locations parameter

So that GKE only create nodes in these zones. The result of this command creates two instance group in each region.

```bash
gcloud container clusters create test-gpu --accelerator type=nvidia-tesla-p100,count=1 --region asia-east1 --num-nodes 1 --node-locations asia-east1-a,asia-east1-c --enable-autoscaling --max-nodes 1 --min-nodes 3

#   or
# if --num-nodes not specified, default 3 nodes each zone
gcloud container clusters create test-no-autoscaling --accelerator type=nvidia-tesla-p100,count=1 --region asia-east1 --node-locations asia-east1-a,asia-east1-c

```


####    Create Regional Cluster and specify GPU requirement

```bash
gcloud container clusters create test-gpu --accelerator type=nvidia-tesla-p100,count=1 --region asia-east1 --num-nodes 1 --enable-autoscaling --max-nodes 1 --min-nodes 1
```
####    Reference

-   https://cloud.google.com/kubernetes-engine/docs/how-to/gpus?hl=zh-tw

-   https://cloud.google.com/kubernetes-engine/docs/how-to/gpus?hl=zh-tw

-   https://cloud.google.com/kubernetes-engine/docs/how-to/managing-clusters?hl=zh-tw#add_or_remove_zones

