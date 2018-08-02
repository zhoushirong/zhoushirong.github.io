#!/bin/bash
echo 'hexo clean && hexo g && hexo d:'
hexo clean && hexo g && hexo d

echo 'git add .; git commit -m "message"; git push;'
git add .; git commit -m "message"; git push
echo 'done!'