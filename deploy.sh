#! /usr/bin/env bash

cd build/
find . -type f -printf '%p' -exec curl -s --write-out " - Status: %{response_code} Size: %{size_upload} Time: %{time_total}s\n" --user $ftpuser:$ftppassword --ftp-create-dirs -T {} ftp://$ftphost/{} \;
curl -XPOST -H "AccessKey: $bunnycdn_api_key" -H "Content-Type: application/json" https://bunnycdn.com/api/pullzone/$bunnycdn_zone_id/purgeCache -d ""
