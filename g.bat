::git add ./
::git commit -m %1
::git push origin dev
git checkout release
git merge dev
git push origin release
git checkout dev