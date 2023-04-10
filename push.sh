#!/bin/bash

# Parse command-line arguments
username="$1"
repo_name="$2"
folder_path="/mnt/c/Users/Malek/Desktop/CodeMagician-BackEnd-youssef"
token="$3"
email="$4"
commit="$5"

echo "test"

remote_url="https://${username}:${token}@github.com/${username}/${repo_name}.git"

destination_path="$(mktemp -d)"

git clone "$remote_url" "$destination_path"


cd "$destination_path"
git init

cp -r $folder_path/* $destination_path

git config --global user.name "$username"
git config --global user.email "$email"

git add .
git commit -m "$commit"
git push origin main

rm -rf "$destination_path"