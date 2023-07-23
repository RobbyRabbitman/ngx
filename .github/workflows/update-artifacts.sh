#!/bin/bash

isAffected=$(eval "npx nx print-affected | node -pe 'JSON.parse(fs.readFileSync(0)).projects.length > 0'")

tmpDir=${TEMP_DIR:-"./tmp"}

mkdir -p $tmpDir

echo creating tmp dir: $tmpDir

if [ $isAffected = "false" ]
then
  echo "nothing changed"
  exit 0
fi

affected=$(eval "npx nx print-affected | node -pe 'JSON.parse(fs.readFileSync(0)).projects.join(\", \")'")

echo "affected: $affected"

mkdir -p $tmpDir

cp -r ./coverage $tmpDir/coverage/
cp -r ./dist/storybook $tmpDir/storybook/

git checkout -B artifacts origin/artifacts
git restore --staged .
cp -Tr $tmpDir/coverage/ coverage/
git add .
git commit -m "build(artifacts): update coverage for $affected"
git push origin artifacts

exit 0
