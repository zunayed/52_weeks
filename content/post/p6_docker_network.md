+++
date = "2017-08-15"
draft = false
title = "p6 - Docker networking"
+++

I spent some time learning a bit more about docker networking. My current workflow for inter-container communication, such as a web server communicating with a MySQL container involves exposing the port on one container. Then in the second container, you access that port via the host machine IP/name. This works well enough but what if you don’t want to expose the port to the public? Another issue is in your configuration you could be pointed to your host machine, for example, mymachine.ny but if you ever developed on another machine you would have to switch out the names to make sure the containers all communicate within the same host There is a solution built into docker that involves creating a network bridge.


Let's create a bridge
```bash
zali@dockerub01:~$ docker network create -d bridge --subnet 10.0.0.1/24 zali-bridge
bccdf546312c188b709a97d42a191c981c2975d0b3cb

zali@dockerub01:~$ docker network ls
NETWORK ID          NAME                DRIVER              SCOPE
ac1a0e81f881        bridge              bridge              local
db76ba37ae35        host                host                local
11a6bb3457d7        none                null                local
bccdf546312c        zali-bridge         bridge

```

and spin up some containers
```bash
zali@dockerub01:~$ docker run -dt --name node1 --network zali-bridge alpine sleep 1d
f87d023a8040654fa367353ba752580dc20ba67b5d58a616777a9aebd8e76658
zali@dockerub01:~$ docker run -dt --name node2 --network zali-bridge alpine sleep 1d
5eba11d63c83e034864035a2af8b770776ee9c8ed8d0aa722cf13ae92ffc556b

zali@dockerub01:~$ docker network inspect zali-bridge
[
    {
        "Name": "zali-bridge",
        "Id": "bccdf546312c188b709a97d42a191c981c2975d0b3cb62f1f0b7cac0f17e5489",
        "Scope": "local",
        "Driver": "bridge",
        "EnableIPv6": false,
        "IPAM": {
            "Driver": "default",
            "Options": {},
            "Config": [
                {
                    "Subnet": "10.0.0.1/24"
                }
            ]
        },
        "Internal": false,
        "Containers": {
            "5eba11d63c83e034864035a2af8b770776ee9c8ed8d0aa722cf13ae92ffc556b": {
                "Name": "node2",
                "EndpointID": "65893cf60ecf21de7f9eeef4da738820d0bc5d3a11165ec8420ece6d3a884eed",
                "MacAddress": "02:42:0a:00:00:03",
                "IPv4Address": "10.0.0.3/24",
                "IPv6Address": ""
            },
            "f87d023a8040654fa367353ba752580dc20ba67b5d58a616777a9aebd8e76658": {
                "Name": "node1",
                "EndpointID": "1ed062b67e08ba2d4613ad9b27a5365f956ef39c9224ac95a4da87bc7046756f",
                "MacAddress": "02:42:0a:00:00:02",
                "IPv4Address": "10.0.0.2/24",
                "IPv6Address": ""
            }
        },
        "Options": {},
        "Labels": {}
    }
```

Now lets hop into the containers and try to communicate between containers
```bash
/ # zali@dockerub01:~$ docker exec -it node1 sh
/ # ip a
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN qlen 1
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
       valid_lft forever preferred_lft forever
    inet6 ::1/128 scope host
       valid_lft forever preferred_lft forever
1286: eth0@if1287: <BROADCAST,MULTICAST,UP,LOWER_UP,M-DOWN> mtu 1500 qdisc noqueue state UP
    link/ether 02:42:0a:00:00:02 brd ff:ff:ff:ff:ff:ff
    inet 10.0.0.2/24 scope global eth0
       valid_lft forever preferred_lft forever
    inet6 fe80::42:aff:fe00:2/64 scope link
       valid_lft forever preferred_lft forever
/ # ping node2
PING node2 (10.0.0.3): 56 data bytes
64 bytes from 10.0.0.3: seq=0 ttl=64 time=0.075 ms
64 bytes from 10.0.0.3: seq=1 ttl=64 time=0.094 ms
64 bytes from 10.0.0.3: seq=2 ttl=64 time=0.084 ms
^C
--- node2 ping statistics ---
3 packets transmitted, 3 packets received, 0% packet loss
round-trip min/avg/max = 0.075/0.084/0.094 ms
```

And thats it!
