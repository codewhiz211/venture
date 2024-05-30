Currently we need to support two designs:
* the old Venture design (used by staff area)
* the new Venture design (used by Subbies area)

This necessitates importing different styles in styles.scss based body having a class of new-shell / old-shell.

When we move to a single design;
* remove the old-shell styles
* remove the conditional application of new shell styes
* split design into imports (like chrome-buttons) - we can start doing this now
* rename chrome to venture