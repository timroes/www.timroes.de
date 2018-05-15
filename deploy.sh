#! /usr/bin/env bash

cd build/
find . -type f -printf '%p' -exec curl -s --write-out " - Status: %{response_code} Size: %{size_upload} Time: %{time_total}s\n" --user $ftpuser:$ftppassword --ftp-create-dirs -T {} ftp://$ftphost/{} \;
