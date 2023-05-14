setupUI();

const urlParams = new URLSearchParams(window.location.search);
const userId = urlParams.get("userId");

function getUser() {
  const url = `${BASE_URL}/users/${userId}`;
  axios
    .get(url)
    .then((res) => {
      const user = res.data.data;
      document.getElementById("user-info-email").innerHTML = user.email;
      document.getElementById("user-info-name").innerHTML = user.name;
      document.getElementById("user-info-username").innerHTML = user.username;
      document.getElementById("user-profile-image").src = user.profile_image;
      document.getElementById("user-posts-count").innerHTML = user.posts_count;
      document.getElementById("user-comments-count").innerHTML =
        user.comments_count;
      document.getElementById("user-name").innerHTML = user.name + "'s";
    })
    .catch((err) => console.log(err));
}

function getPosts() {
  toggleLoader(true);
  const url = `${BASE_URL}/users/${userId}/posts`;
  axios
    .get(url)
    .then((res) => {
      const postsArr = res.data.data;
      const posts = postsArr
        .map((post) => {
          let isMyPost =
            localStorage.getItem("user") != null &&
            JSON.parse(localStorage.getItem("user")).id == post.author.id;
          let editBtn = "";
          let deleteBtn = "";
          if (isMyPost) {
            editBtn = `<button
                class="btn btn-warning text-white ms-auto mb-1"
                onclick="editPost('${encodeURIComponent(
                  JSON.stringify(post)
                )}')"
              >
                Edit
              </button>`;
            deleteBtn = `<button
                class="btn btn-danger text-white ms-auto"
               onclick="deletePost('${encodeURIComponent(
                 JSON.stringify(post)
               )}')"
                
              >
                Delete
              </button>`;
          }
          return `
      <div class="card shadow mb-5" >
            <div class="card-header d-flex justify-content-between align-items-center">
            <div>
              <img
                src="${
                  Object.keys(post.author.profile_image).length !== 0
                    ? post.author.profile_image
                    : "./images/no-profile.png"
                }"
                alt="profile image"
                class="rounded-circle border border-secondary-subtle"
              />
              <span class="fw-bold">@${post.author.username}</span>
              </div>
              <div>
                  ${editBtn}
                  ${deleteBtn}
             </div>
            </div>
            <div class="card-body" style="cursor:pointer;" onclick="showPostInfo(${
              post.id
            })">
              <img src="${post.image}" alt="" class="w-100" />
              <h6 class="text-black-50 mt-1">${post.created_at}</h6>
              <h5>${!post.title ? "There is no Title" : post.title}</h5>
              <p>
              ${post.body}
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
                <span>(${post.comments_count}) Comments</span>

                <span class="post-tags">
                  <button class="btn btn-sm bg-secondary text-white rounded-pill">Policy</button>
                </span>

              </div>
            </div>
          </div>
   `;
        })
        .join("");
      document.getElementById("user-posts").innerHTML = posts;
      getUser();
    })
    .catch((err) => showAlert(err.response.data.message, "danger"))
    .finally(() => toggleLoader(false));
}

getUser();
getPosts();
