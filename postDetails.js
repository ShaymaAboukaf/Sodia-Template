setupUI();

const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get("postId");

function showPostInfo() {
  axios
    .get(`${BASE_URL}/posts/${postId}`)
    .then((res) => {
      toggleLoader(true);
      const postInfo = res.data.data;
      const comments = res.data.data.comments;
      const commentsArr = comments
        .map(
          (comment) => `
                   <div class="comment">
                   <div class="d-flex align-items-center mb-3">
                   <img src=${comment.author.profile_image} class="rounded-circle" />
                   <h6>${comment.author.username}</h6>
                   </div>
                   <p class="ms-3">${comment.body}</p>
                   </div>
         `
        )
        .join("");
      const content = `
         <h1>${postInfo.author.name} Post</h1>
         <div class="card shadow mb-5">
               <div class="card-header">
                 <img
                   src="${
                     Object.keys(postInfo.author.profile_image).length !== 0
                       ? postInfo.author.profile_image
                       : "./images/no-profile.png"
                   }"
                   alt="profile image"
                   class="rounded-circle border border-secondary-subtle"
                 />
                 <span class="fw-bold">@${postInfo.author.username}</span>
               </div>
               <div class="card-body">
                 <img src="${postInfo.image}" alt="" class="w-100" />
                 <h6 class="text-black-50 mt-1">${postInfo.created_at}</h6>
                 <h5>${
                   !postInfo.title ? "There is no Title" : postInfo.title
                 }</h5>
                 <p>
                 ${postInfo.body}
                 </p>
                 <hr />
                 <div>
                   <svg
                     xmlns="http://www.w3.org/2000/svg"
                     width="16"
                     height="16"
                     fill="currentColor"
                     class="bi bi-pen"
                     viewBox="0 0 16 16"
                   >
                     <path
                       d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001zm-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708l-1.585-1.585z"
                     />
                   </svg>
                   <span>(${postInfo.comments_count}) Comments</span>
                  
                 </div>
                  <div id="comments" class="mt-3">
                  ${commentsArr}
                  </div>
                  <div class="input-group mt-5" id="add-comment">
                    <input id="user-comment" type="text" class="form-control" placeholder="Write a comment ..." aria-label="write a comment" aria-describedby="button-addon2">
                    <button class="btn btn-outline-primary" type="button" id="button-addon2" onclick="addComment()">Send</button>
                  </div>
               </div>
             </div>
      `;
      document.querySelector(".post-detail").innerHTML = content;
      setupUI();
    })
    .catch((err) => showAlert.log(err, response.data.message, "danger"))
    .then(() => toggleLoader(false));
}

function addComment() {
  const comment = document.getElementById("user-comment").value;
  const url = `${BASE_URL}/posts/${postId}/comments`;
  const token = localStorage.getItem("token");
  const bodyParams = {
    body: comment,
  };
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  axios
    .post(url, bodyParams, config)
    .then(() => {
      toggleLoader(true);
      showPostInfo();
      showAlert("Comment Added Successfully!", "success");
    })
    .catch((err) => showAlert(err.response.data.message, "danger"))
    .finally(() => toggleLoader(false));
}

showPostInfo();
