#!/bin/bash
echo 'hexo clean'
hexo clean
echo 'hexo g'
hexo g
echo 'cp img'
cp -R ./img ./.deploy_git/
echo 'hexo d'
hexo d