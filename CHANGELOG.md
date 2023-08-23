# Sample react app Changelog

All notable changes to the sample react app will be documented in this file.

## 2.0.1
- This action making a CHANGELOG note via special syntax from the GitHub PR commit message, like it could automatically update CHANGELOG.md with the message. First job checks if PR body has changelog note or not if it's not there then it asked them to add it and second job is to check if changelog note has been added in changelog.md file or not. (#99)

- Bugfix: Schema file was not included, preventing installation as a component
- Bugfix: Manifest build content template was never resolved, so it has been removed.


## 2.0.0

- Breaking change: The app was enhanced to work with Zowe v2. It is not guaranteed to work with the v1 desktop.
- Enhancement: The app now contains a manifest file so that it can be installed with `zwe components install`
