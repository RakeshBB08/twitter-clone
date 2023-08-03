$(document).ready(() => {
  $.get("/api/posts", { followingOnly: false }, (results) => {
    outputPosts(results, $(".postsContainer"));
  });
});
