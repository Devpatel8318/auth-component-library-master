#!/bin/bash

# Stage all changes
git add .

# Commit changes with a message
git commit -m "bug fix"

# Push changes to the main branch
git push origin main

# Publish the package to npm
npm publish
