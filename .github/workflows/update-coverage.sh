#!/bin/bash

isAffected=$(eval "npx nx print-affected | node -pe 'JSON.parse(fs.readFileSync(0)).projects.length > 0'")

if [ $isAffected = "false" ]
then
  echo "nothing changed"
  exit 0
fi

affected=$(eval "nx print-affected | node -pe 'JSON.parse(fs.readFileSync(0)).projects.join(\", \")'")

echo "affected: $affected"

git restore --staged .
git add -f ../../coverage
git commit -m "build(artifacts): update coverage for $affected"
git push origin head:artifacts

exit 0
