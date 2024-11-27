# Bluesky-comments-for-Static-Sites

1. Add a div with an ID of `bluesky-comments` anywhere on your page.
2. Load the `bluesky-comments.js` file (or add the contents to your JS).
3. Invoke this JavaScript anytime later:

   ```
   document.addEventListener('DOMContentLoaded', () => {
     loadBlueskyComments();
   });
   ```

See https://tomcreighton.com/bluesky-comments for more context.
