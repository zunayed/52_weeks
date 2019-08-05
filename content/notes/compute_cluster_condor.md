+++
date = "2017-07-23"
draft = false
title = "25k cores compute cluster w/Condor & Google Cloud"
+++

# condor setup
## Step 0. Requirements
- Google Compute Engine (henceforth gce) account.
- Go to cloud.google.com and sign up for google compute engine account. Login with that account.
- (one time) - create a project "towercondor". Go to compute engine and enable billing


```bash
$ gcloud projects list
PROJECT_ID          NAME              PROJECT_NUMBER
towercondor         TowerCondor       117063094529
supple-flux-126514  My First Project  180501337810

$ gcloud projects describe towercondor
createTime: '2016-04-07T13:49:53.091Z'
lifecycleState: ACTIVE
name: TowerCondor
projectId: towercondor
projectNumber: '117063094529'
```

Setup a service account

## Step 1. download locally the gcloud sdk
Setup gcloud sdk
https://cloud.google.com/sdk/gcloud/
```bash
curl https://sdk.cloud.google.com | bash
exec -l $SHELL
```

## Step 2. gcloud init

Setup the access credentials. Now you're ready to interact with gce via gcloud cli tool

```bash
gcloud init
```

>  Make sure you set up the the default project to match your account

## Step 3. setting up saltmaster node
### a. Create the salt master instance
```bash
 $ gcloud compute --project "towercondor" instances create "saltmaster" --zone "us-east1-b" \
 --machine-type "n1-standard-1" --image "centos-7"  --no-boot-disk-auto-delete \
 --boot-disk-type "pd-ssd" --boot-disk-device-name "saltmaster"


Created [https://www.googleapis.com/compute/v1/projects/towercondor/zones/us-east1-b/instances/saltmaster].
NAME       ZONE       MACHINE_TYPE  PREEMPTIBLE INTERNAL_IP EXTERNAL_IP    STATUS
saltmaster us-east1-b n1-standard-1             10.142.0.2  104.196.139.29 RUNNING
```
### b. Connect to the salt master instance
```bash
gcloud compute ssh saltmaster
Updated [https://www.googleapis.com/compute/v1/projects/towercondor].
Warning: Permanently added '104.196.139.29' (ECDSA) to the list of known hosts.
X11 forwarding request failed on channel 0
Warning: Permanently added '104.196.139.29' (ECDSA) to the list of known hosts.
X11 forwarding request failed on channel 0

[fpisupati@saltmaster ~]$ sudo su -
[root@saltmaster ~]#

```
### c. Install the salt-master
```bash
yum -y install epel-release
yum -y install salt-master salt-minion
```

### d. Enable the salt master and start up Salt service on the master
``` bash
sed -i '/^#master:/a master: saltmaster' /etc/salt/minion
systemctl enable salt-master.service salt-minion.service
systemctl status salt-master.service salt-minion.service
systemctl start salt-master.service salt-minion.service
```
### e. Setup gcloud on the saltmaster

``` bash
curl https://sdk.cloud.google.com | bash
exec -l $SHELL
```

### f. We want to have salt spin up instances and auto accept their keys
install salt-cloud
```bash
yum install -y salt-cloud
```
### g. generate a service account on gcloud console
### h. generate private key

>  **Note** -  .json (preferred) or .p12 file that contains a private authorization key

### i. setup salt provider config file
> **Note** - provider changes to driver in future versions of salt cloud

```yaml
[root@saltmaster zali]# cat /etc/salt/cloud.providers
  tower-gce:
    project: "towercondor"
    service_account_email_address: << insert email>>"
    service_account_private_key: "/root/<< priv key name >>.json"

    minion:
      master: saltmaster

    grains:
      node_type: broker
      release: 1.0.1

    #driver: gce
    provider: gce
```
### j. setup salt profile
>  **Note** - the image is set to a custom image we plan on creating in a another step

```yaml
[root@saltmaster zali]# cat /etc/salt/cloud.profiles.d/my-gce-profile.conf
condornode:
  minion:
    master: saltmaster
  image: salt-minion-img
  size: n1-standard-1
  location: us-east1-b
  network: default
  tags: '["one", "two", "three"]'
  metadata: '{"one": "1", "2": "two"}'
  use_persistent_disk: False
  delete_boot_pd: False
  deploy: True
  make_master: False
  provider: gce-config
```
----------

## Step 4. setup tower condor master
### a. Spin up condor master vm
### b. add condor yum repo
```bash
[htcondor-development]
name=HTCondor Development RPM Repository for Redhat Enterprise Linux 7
baseurl=http://research.cs.wisc.edu/htcondor/yum/development/rhel7
enabled=1
gpgcheck=0
```
### c. install condor packages
```bash
yum install -y condor
```
### d. configure condor
```bash
modify settings
# ALLOW_WRITE > host range for allowed machines
# CONDOR_HOST > fully qualified domain
systemctl enable condor.service
systemctl start condor.service
```

### e. misc settings
```bash
disable selinux
sed -i '/^SELINUX/s/enforcing/disabled' /etc/selinux/config
```
disable google daemons
```bash
systemctl disable google-accounts-manager.service google-address-manager.service google-clock-sync-manager.service google-shutdown-scripts.service google-startup-scripts.service google.service
```


----------
## Step 5. setup minion base image

Core steps :
a. create a sample minion vm instance with persistent disk
b. edit this instance and put all the settings/rpms/custom stuff needed
b. power down this instance
d. delete the instance (this disassociates the disk from the instance)
e. create an image template from the disk that was attached to this instance (instance is now deleted)
f. with this image template, use gcloud or salt-cloud to create further vm instances and using a different salt profile called "tower-condornode"

 Setup base image for minions
(one time step) create salt minion manually which will be used later as a template for rest of the salt minions

### a. Create a sample minion vm instance with persistent disk
```bash
gcloud compute --project "towercondor" instances create minion-template --zone us-east1-b --machine-type n1-standard-1 --boot-disk-size=10 --boot-disk-type pd-ssd --image=centos-7

Created [https://www.googleapis.com/compute/v1/projects/towercondor/zones/us-east1-b/instances/minion-template].
NAME            ZONE       MACHINE_TYPE  PREEMPTIBLE INTERNAL_IP EXTERNAL_IP    STATUS
minion-template us-east1-b n1-standard-1             10.142.0.3  104.196.120.81 RUNNING
```

### b. edit this instance and put all the settings/rpms/custom stuff needed
- setup yum repo for condor
-
```bash
 yum install -y epel-release wget vim
 yum install -y salt-minion
 cd /etc/yum.repos.d && wget http://research.cs.wisc.edu/htcondor/yum/repo.d/htcondor-stable-rhel6.repo

# condor config
ALLOW_WRITE = 10.196.*
CONDOR_HOST = tower-condor-master.c.supple-flux-126514.internal
DAEMON_LIST = MASTER, STARTD
chkconfig condor on
service condor start
chkconfig salt-minonion on

```

- install salt-minion, condor
- config hostname for saltminion
- config settings for condor

### c. power down this instance
```bash
gcloud compute instances stop minion-template
Updated [https://www.googleapis.com/compute/v1/projects/towercondor/zones/us-east1-b/instances/minion-template].
```
### d. delete the instance
this disassociates the disk from the instance
```bash
gcloud compute instances delete minion-template
The following instances will be deleted. Attached disks configured to
be auto-deleted will be deleted unless they are attached to any other
instances. Deleting a disk is irreversible and any data on the disk
will be lost.
 - [minion-template] in [us-east1-b]

Do you want to continue (Y/n)?

Deleted [https://www.googleapis.com/compute/v1/projects/towercondor/zones/us-east1-b/instances/minion-template].
```
### e. create an image template from the disk that was attached to this instance (instance is now deleted)
```bash
: skae fpisupati@fpisupatilinux ~; gcloud compute images create salt-minion-image --description "Template image with all Tower settings from which to create further condornodes" --source-disk=minion-template
Created [https://www.googleapis.com/compute/v1/projects/towercondor/global/images/salt-minion-image].
NAME              PROJECT     ALIAS DEPRECATED STATUS
salt-minion-image towercondor                  READY

```
### f. with this image template, use gcloud or salt-cloud to create further vm instances and using a different salt profile called "condornode-profile"
```bash
: skae fpisupati@fpisupatilinux ~; gcloud compute images list
NAME                                PROJECT           ALIAS              DEPRECATED STATUS
salt-minion-image                   towercondor                                     READY

centos-6-v20160329                  centos-cloud      centos-6                      READY
centos-7-v20160329                  centos-cloud      centos-7                      READY
...
```

### g. saltmaster ssh key setup
```bash
[root@saltmaster ~]# gcloud compute ssh saltmaster
WARNING: The private SSH key file for Google Compute Engine does not exist.
WARNING: You do not have an SSH key for Google Compute Engine.
WARNING: [/bin/ssh-keygen] will be executed to generate a key.
This tool needs to create the directory [/root/.ssh] before being able
 to generate SSH keys.

Do you want to continue (Y/n)?

Generating public/private rsa key pair.
Enter passphrase (empty for no passphrase):
Enter same passphrase again:
Your identification has been saved in /root/.ssh/google_compute_engine.
Your public key has been saved in /root/.ssh/google_compute_engine.pub.
The key fingerprint is:
33:35:81:da:db:4b:ba:68:4b:8a:d0:5a:76:00:1c:b6 root@saltmaster
The key's randomart image is:
+--[ RSA 2048]----+
| o       ..      |
|o o     .  .     |
|.E     o  o      |
| .    . .. .     |
|  .     So       |
| . .    .oo      |
|. + . .  o .     |
| = o o... .      |
|. . ..o...       |
+-----------------+
Updated [https://www.googleapis.com/compute/v1/projects/towercondor].
Warning: Permanently added '104.196.139.29' (ECDSA) to the list of known hosts.
Warning: Permanently added '104.196.139.29' (ECDSA) to the list of known hosts.
Last login: Fri Apr  8 19:22:30 2016
[root@saltmaster ~]#

```

### h. provision the node via salt-cloud
```bash
[root@saltmaster salt]# salt-cloud -p condornode-profile condornode0001
[INFO    ] salt-cloud starting
[INFO    ] Creating GCE instance condornode0001 in us-east1-b
[ERROR   ] Error creating condornode0001 on GCE

The following exception was thrown by libcloud when trying to run the initial deployment:
u"The user does not have access to service account '117063094529-compute@developer.gserviceaccount.com'.  User: '117063094529-compute@developer.gserviceaccount.com'"
Error: There was a profile error: Failed to deploy VM

[root@saltmaster salt]# gcloud compute instances create condornode0001 --machine-type n1-standard-1 --image=salt-minion-image --zone=us-east1-b
ERROR: (gcloud.compute.instances.create) Some requests did not succeed:
 - Insufficient Permission
```


## Step 6: Grow cluster
(repeatedly) create the salt minions which run condor and are condornodes for the above tower condor master


```bash
gcloud compute --project "supple-flux-126514" instance-groups managed create "instance-group-1" --zone "us-central1-b" --base-instance-name "instance-group-1" --template "condor-minion-r6" --size "3"
```


## Useful commands
Check list of claimed condor nodes


```bash
[fpisupati@tower-condor-master ~]$ condor_status -claimed -wide
Name                                                OpSys       Arch   LoadAv RemoteUser                                                  ClientMachine

instance-group-1-b43y.c.supple-flux-126514.internal LINUX       X86_64  0.930 fpisupati@tower-condor-master.c.supple-flux-126514.internal tower-condor-master.c.supple-flux-126514.internal
instance-group-1-exs0.c.supple-flux-126514.internal LINUX       X86_64  0.030 fpisupati@tower-condor-master.c.supple-flux-126514.internal tower-condor-master.c.supple-flux-126514.internal
instance-group-1-ziz8.c.supple-flux-126514.internal LINUX       X86_64  0.580 fpisupati@tower-condor-master.c.supple-flux-126514.internal tower-condor-master.c.supple-flux-126514.internal
instance-group-2-idlm.c.supple-flux-126514.internal LINUX       X86_64  0.120 fpisupati@tower-condor-master.c.supple-flux-126514.internal tower-condor-master.c.supple-flux-126514.internal
             Machines         MIPS       KFLOPS   AvgLoadAvg

X86_64/LINUX        4        75114      6345172   0.415

       Total        4        75114      6345172   0.415
```

check list of available condor nodes

``` bash
[fpisupati@tower-condor-master ~]$ condor_status -avail -wide
Name                                                OpSys      Arch   State     Activity LoadAv Mem  ActivityTime

instance-group-1-11ri.c.supple-flux-126514.internal LINUX      X86_64 Unclaimed Idle      0.030 3578   0+00:04:32
instance-group-1-2rn4.c.supple-flux-126514.internal LINUX      X86_64 Unclaimed Idle      0.140 3578   0+00:00:04
instance-group-1-hwhk.c.supple-flux-126514.internal LINUX      X86_64 Unclaimed Idle      0.010 3578   0+00:04:35
instance-group-1-lt9u.c.supple-flux-126514.internal LINUX      X86_64 Unclaimed Idle      0.540 3578   0+00:04:39
instance-group-1-nsh3.c.supple-flux-126514.internal LINUX      X86_64 Unclaimed Idle      0.010 3578   0+00:04:41
instance-group-1-qhbm.c.supple-flux-126514.internal LINUX      X86_64 Unclaimed Idle      0.010 3578   0+00:04:32
instance-group-1-r91o.c.supple-flux-126514.internal LINUX      X86_64 Unclaimed Idle      0.030 3578   0+00:04:35
instance-group-1-rhu4.c.supple-flux-126514.internal LINUX      X86_64 Unclaimed Idle      0.490 3578   0+00:04:36
instance-group-1-ubr5.c.supple-flux-126514.internal LINUX      X86_64 Unclaimed Idle      0.020 3578   0+00:04:35
instance-group-1-up0y.c.supple-flux-126514.internal LINUX      X86_64 Unclaimed Idle      0.080 3578   0+00:00:04
instance-group-1-vrvu.c.supple-flux-126514.internal LINUX      X86_64 Unclaimed Idle      0.010 3578   0+00:00:04
instance-group-1-y9tc.c.supple-flux-126514.internal LINUX      X86_64 Unclaimed Idle      0.160 3578   0+00:00:04
instance-group-1-zz0z.c.supple-flux-126514.internal LINUX      X86_64 Unclaimed Idle      0.000 3578   0+00:00:04
instance-group-2-cvkv.c.supple-flux-126514.internal LINUX      X86_64 Unclaimed Idle      0.000 3578   0+00:04:57
instance-group-2-gunt.c.supple-flux-126514.internal LINUX      X86_64 Unclaimed Idle      0.010 3578   0+00:04:56
instance-group-2-iwyd.c.supple-flux-126514.internal LINUX      X86_64 Unclaimed Idle      0.000 3578   0+00:04:57
instance-group-2-l8pz.c.supple-flux-126514.internal LINUX      X86_64 Unclaimed Idle      0.060 3578   0+00:00:04
tower-condor-master.c.supple-flux-126514.internal   LINUX      X86_64 Unclaimed Idle      0.000 3578   0+00:02:10
             Machines Owner Claimed Unclaimed Matched Preempting

X86_64/LINUX       18     0       0        18       0          0

       Total       18     0       0        18       0          0
```

Create gcloud instance group instances

``` bash
: skae fpisupati@fpisupatilinux ~; gcloud compute --project "supple-flux-126514" instance-groups managed create "instance-group-1" --zone "us-east1-b" --base-instance-name "instance-group-1" --template "condor--minion-r6" --size "16"
Created [https://www.googleapis.com/compute/v1/projects/supple-flux-126514/zones/us-east1-b/instanceGroupManagers/instance-group-1].
NAME             ZONE       BASE_INSTANCE_NAME SIZE TARGET_SIZE INSTANCE_TEMPLATE AUTOSCALED
instance-group-1 us-east1-b instance-group-1        16          condor--minion-r6

: skae fpisupati@fpisupatilinux ~; gcloud compute --project "supple-flux-126514" instance-groups managed create "instance-group-2" --zone "us-east1-b" --base-instance-name "instance-group-2" --template "condor--minion-r6" --size "8"
Created [https://www.googleapis.com/compute/v1/projects/supple-flux-126514/zones/us-east1-b/instanceGroupManagers/instance-group-2].
NAME             ZONE       BASE_INSTANCE_NAME SIZE TARGET_SIZE INSTANCE_TEMPLATE AUTOSCALED
instance-group-2 us-east1-b instance-group-2        8           condor--minion-r6

```

Delete gcloud instance groups

``` bash
: skae fpisupati@fpisupatilinux ~; echo Y | gcloud compute  --project "supple-flux-126514" instance-groups managed delete instance-group-1
The following instance group managers will be deleted:
 - [instance-group-1] in [us-east1-b]

Do you want to continue (Y/n)?
Deleted [https://www.googleapis.com/compute/v1/projects/supple-flux-126514/zones/us-east1-b/instanceGroupManagers/instance-group-1].

```

Check CPU quota/consumption

```bash
: skae fpisupati@fpisupatilinux ~; gcloud compute regions list
NAME         CPUS          DISKS_GB     ADDRESSES RESERVED_ADDRESSES STATUS TURNDOWN_DATE
asia-east1      0.00/24.00      0/10240      0/23      0/7           UP
europe-west1    0.00/24.00      0/10240      0/23      0/7           UP
us-central1     0.00/24.00      0/10240      0/23      0/7           UP
us-east1       41.00/48.00     80/10240     10/23      0/7           UP

```

## Presentation

### build out twrcondormaster1
### show running instances
```bash
➜  ~ gcloud compute instances list --sort-by status
NAME                     ZONE       MACHINE_TYPE  PREEMPTIBLE INTERNAL_IP EXTERNAL_IP    STATUS
fileserver1              us-east1-b n1-standard-1             10.142.0.10 104.196.98.184 RUNNING
minion-template-instance us-east1-b n1-standard-1             10.142.0.4  104.196.44.200 RUNNING
netops1                  us-east1-b n1-standard-1             10.200.0.2  104.196.59.191 RUNNING
saltmaster               us-east1-b n1-standard-1             10.142.0.2  104.196.139.29 RUNNING
systems1                 us-east1-b n1-standard-1             10.142.0.9  104.196.27.99  RUNNING
systems2                 us-east1-b n1-standard-1             10.142.0.11 104.196.34.2   RUNNING
twrcondormaster1         us-east1-b n1-standard-1             10.142.0.7  104.196.60.213 RUNNING
avere-sdk                us-east1-b n1-standard-1             10.142.0.5                 TERMINATED
averetest-1              us-east1-b n1-highmem-8              10.240.0.4                 TERMINATED
averetest-2              us-east1-b n1-highmem-8              10.240.0.5                 TERMINATED
averetest-3              us-east1-b n1-highmem-8              10.240.0.6                 TERMINATED
nat-gateway              us-east1-b n1-standard-4             10.240.0.2                 TERMINATED
shepherd-1               us-east1-b n1-standard-4             10.240.0.3                 TERMINATED
```
### connect to tower condor master
```bash
➜  ~ gcloud compute ssh twrcondormaster1
Warning: Permanently added '104.196.60.213' (ECDSA) to the list of known hosts.
X11 forwarding request failed on channel 0
Last login: Wed Apr 27 14:15:21 2016 from 64.245.141.10
[zali@twrcondormaster1 ~]$
```
### submit jobs and show queue
```bash
condor_q
condor_submit submit
```
### show the quotas per region
```bash
gcloud compute regions list
```

### spin up windows and watch condor_status -total and condor_q -run


submit a condor job with 60 cores
   cat submit.2
```bash
Universe   = vanilla
Executable = simple
Arguments  = 90 20
Log        = simple.log
Output     = simple.\$(Process).out
Error      = simple.\$(Process).error
Queue

Arguments = 60 500
Queue 60

Arguments = 180 12
Queue 80
```
  condor_submit submit.2


add several instances in different regions
```bash
gcloud compute instance-groups managed create "towercondor-batch1" --zone "us-east1-b" --base-instance-name "condornode" --template "condornode-rhel7-8cpu" --size "100"

  gcloud compute --project "towercondor" instance-groups managed create "towercondor-batch1"
  --zone "us-east1-c" --base-instance-name "condornode" --template "condornode-rhel7"
  --size "24"
```

checking the usage
```bash
   gcloud compute regions list
```
once all condor jobs are complete, remove all the instances created
```bash
   echo Y | gcloud compute --project "towercondor" instance-groups managed delete towercondor-batch1
```
verify with condor_status on twrcondormaster1

```bash
condor_status -avail -wide
```

Testing :

Test 1 -
    using twrcondormaster1 (1vcpu,3.75GB mem,10GB PD) -
     - submit a simple 20,000 queue job
     - allocate 625 x 16vcpu,32GB mem VM instances (10,000 cores) in us-east1-b
     - allocate 625 x 16vcpu,32GB mem VM instances (10,000 cores) in us-east1-c
     - condor_status shows upto 9717 cores in cluster
     - twrcondormaster1 became unresponsive with kernel stack trace on console
     - ran out of memory on condormaster


instance group create starttime - 11:11:45
spinning up 625 x 16vcpu/32GB/10GBdisk vm instances
spin up time -
instance group create completetime - 11:17:45  (6 mins)
instance group ready and joined to condor cluster: 11:18:22


11:45:45 - job submitted (30sec sleep and 1 simple math op) - 10k jobs
11:46:10 - job accepted into condor
11:47:10 - jobs now matched to condornodes and execution started
11:50:53 - jobs finished completely

12:02:25 - job submitted (30sec sleep and 1 simple math op) - 14k jobs

- Ensure MAX_JOBS_RUNNING is set to proper limit
- Ensure MAX_JOBS_PER_SUBMISSION is set to proper limit

Timings:



## Multi region/zone load test`o
### 10k cores in us-east1b -> 1 IG 625 (16 cores)
```bash
gcloud compute instance-groups managed create "towercondor-batch1" --zone "us-east1-b" --base-instance-name "condornode" --template "condornode-rhel7-16cpu-preemptable" --size "625"
```
### 10k cores in us-east1c -> 1 IG 625 (16 cores)
```bash
gcloud compute instance-groups managed create "towercondor-batch2" --zone "us-east1-c" --base-instance-name "condornode" --template "condornode-rhel7-16cpu-preemptable" --size "625"
```
### 10k cores in us-central1-a -> 1 IG 625 (16 cores)
```bash
gcloud compute instance-groups managed create "towercondor-batch3" --zone "us-central1-a" --base-instance-name "condornode" --template "condornode-rhel7-16cpu-preemptable" --size "625"
```
### 20k cores in us-central1-b -> 2 IG 625 (16 cores)
```bash
gcloud compute instance-groups managed create "towercondor-batch4" --zone "us-central1-b" --base-instance-name "condornode" --template "condornode-rhel7-16cpu-preemptable" --size "625"
```
### 25k cores in us-central1-b -> 2 IG 625 (16 cores) x2
```bash
gcloud compute instance-groups managed create "towercondor-batch5" --zone "us-central1-b" --base-instance-name "condornode" --template "condornode-rhel7-16cpu-preemptable" --size "625"
```
### 25k cores in us-central1-f -> 2 IG 781 (16 cores)
```bash
gcloud compute instance-groups managed create "towercondor-batch6" --zone "us-central1-f" --base-instance-name "condornode" --template "condornode-rhel7-16cpu-preemptable" --size "781"
```
### 25k cores in us-central1-f -> 2 IG 781 (16 cores) x2
```bash
gcloud compute instance-groups managed create "towercondor-batch7" --zone "us-central1-f" --base-instance-name "condornode" --template "condornode-rhel7-16cpu-preemptable" --size "781"
```


