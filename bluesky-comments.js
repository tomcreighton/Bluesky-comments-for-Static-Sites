async function loadBlueskyComments() {
  const currentUrl = window.location.href;
  const commentsDiv = document.getElementById("bluesky-comments");

  try {
    // Search for posts containing current URL
    const searchParams = new URLSearchParams({ q: currentUrl });
    const searchResponse = await fetch(
      `https://public.api.bsky.app/xrpc/app.bsky.feed.searchPosts?${searchParams}`,
      { headers: { Accept: "application/json" } }
    );

    if (!searchResponse.ok) {
      throw new Error("Failed to search posts");
    }

    const searchData = await searchResponse.json();

    // For each post found, fetch its thread
    const allComments = [];
    for (const post of searchData.posts) {
      const threadParams = new URLSearchParams({ uri: post.uri });
      const threadResponse = await fetch(
        `https://public.api.bsky.app/xrpc/app.bsky.feed.getPostThread?${threadParams}`,
        { headers: { Accept: "application/json" } }
      );

      if (threadResponse.ok) {
        const threadData = await threadResponse.json();
        if (threadData.thread?.replies) {
          allComments.push(...threadData.thread.replies);
        }
      }
    }

    if (allComments.length === 0) {
      return;
    }

    const commentsList = document.createElement("ul");

    // Sort all comments by time
    const sortedComments = allComments.sort(
      (a, b) => new Date(a.post.indexedAt) - new Date(b.post.indexedAt)
    );

    // Format each of the comments
    sortedComments.forEach((reply) => {
      if (!reply?.post?.record?.text) return;
      const author = reply.post.author;

      const li = document.createElement("li");
      li.innerHTML = `
        <small><a href="https://bsky.app/profile/${author.did}" target="_blank">
          ${author.displayName || author.handle}
        </a></small>
        <p>${reply.post.record.text}</p>
        <small>
          💬 ${reply.post.replyCount || 0}&nbsp;
          🔁 ${reply.post.repostCount || 0}&nbsp;
          🩷 ${reply.post.likeCount || 0}&nbsp;
          <a href="https://bsky.app/profile/${
            reply.post.author.did
          }/post/${reply.post.uri.split("/").pop()}" target="_blank">
            Link
          </a>
        </small>
      `;
      commentsList.appendChild(li);
    });

    commentsDiv.appendChild(commentsList);
  } catch (error) {
    throw new Error(error);
  }
}
