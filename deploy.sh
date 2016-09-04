#! /usr/bin/env bash

if [ "$TRAVIS_BRANCH" == "master" ]; then
	remote_dir="/srv/htdocs"
else
	remote_dir="/srv/htdocs_preview"
fi

rsync -av --delete -e 'ssh -i deploy.key' build/ travisci@www.timroes.de:$remote_dir
