# Unreleased

- Removed: `fs-extra` dependency
- Fixed: keyboard shortcut suggestion per Manifest v3 spec
- Deps update

# v3.0.1

- Fixed: Capture status was stale when link input changes

# v3.0.0

- New: Migrated to Web Manifest v3 for compatibility with Chrome
- New: Detect existing URLs for which "Save" becomes "Update"
- Changed: Link input is moved above Title input

# v2.3.3

- Fixed: "Saved" status is displayed before the API request is completed
- Chore: Update testing library to vitest

# v2.3.2

- Chore: Migrated deprecated web extension polyfill

# v2.3.1

- Fixed: Wrong title displayed for YouTube after client-side navigation between videos
- Fixed: A HTML syntax error in the added tag element
- Chore: Refactored title/url extraction logic to be extensible
- Chore: Added unit test infrastructure
- Thank you @dinh, @joshatt

# v2.3.0

- Added: Support unicode characters in all input fields. e.g., you can use Chinese or even emoji in tags now.
- Fixed: YouTube url missing video IDs.
- Fixed: Typo in "connecting..." status label.
- Thank you @jerrylususu, @dinh

# v2.2.1

- Fixed: Case sensitive URLs were transformed to lowercase.
- Thank you @dinh.

# v2.2.0

- Added: `Alt+Shift+D` to capture the current page.
- Fixed: A typo on settings UI.

# v2.1.2

- Added: Placeholder that reminds you to curate for your future self.
- Changed: More crisp and recognizable logo
- Changed: Spellcheck is now deactivated for url input.

# v2.1.1

- Initial public release
