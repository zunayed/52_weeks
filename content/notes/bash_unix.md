+++
date = "2017-10-23"
draft = false
title = "Bash & Unix"
hidefromhome = true
+++

look at what commands you can run as sudo for user
`sudo -l`

copy file from local to remote
`scp canada-dev-backup.sql kbspdev@104.130.65.26:~/canada-dev-backup.sql`

Watching files/directory for changes
`tail -f *.txt`
look into `less +F`

search for string in directory
`grep -r "string" /path/to/directory`

untar file
`tar -xvf file.tar`

copyfiles ssh
`scp username@b:/path/to/file /path/to/destination`

login as another user
`sudo -u user2 zsh`

set user passwd
`passwd user`

set sudo for command
`joe ALL=(ALL) NOPASSWD: /full/path/to/command ARG1 ARG2`

`netstat -nlpt | grep 5000 | awk '{print $7}'`
`dpkg-query -l | grep logstash`

