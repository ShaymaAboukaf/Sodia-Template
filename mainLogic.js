const BASE_URL = "https://tarmeezacademy.com/api/v1";
function setupUI() {
  const token = localStorage.getItem("token");
  const addPostBtn = document.getElementById("add-post-btn");
  const navRight = document.getElementById("nav-buttons");
  const addComment = document.getElementById("add-comment");
  if (token) {
    const user = JSON.parse(localStorage.getItem("user"));
    navRight.innerHTML = `
      <span class="fw-bold">${user.name}</span>
      <img src=${
        Object.keys(user.profile_image).length !== 0
          ? user.profile_image
          : "./images/no-profile.png"
      } alt="" class="rounded-circle"  />
      <button type="button" class="btn btn-outline-danger ms-2" onclick="logout()">
                  Logout
                </button>
    `;
    if (addPostBtn) {
      addPostBtn.style.display = "flex";
    }
    if (addComment) {
      addComment.style.display = "flex";
    }
  } else {
    navRight.innerHTML = `
      <button
                  type="button"
                  class="btn btn-outline-success"
                  data-bs-toggle="modal"
                  data-bs-target="#login-modal"
                >
                  Login
                </button>
                <button type="button" class="btn btn-outline-success ms-2"  data-bs-toggle="modal"
                  data-bs-target="#register-modal">
                  Register
                </button>
    `;
    if (addPostBtn) addPostBtn.style.display = "none";
    if (addComment) {
      addComment.style.display = "none";
    }
  }
}

function login() {
  toggleLoader(true);
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const url = `${BASE_URL}/login`;
  const params = {
    username,
    password,
  };

  axios
    .post(url, params)
    .then((res) => {
      const token = res.data.token;
      const user = res.data.user;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // Close Modal
      const loginModal = document.getElementById("login-modal");
      const modalInstance = bootstrap.Modal.getInstance(loginModal);
      modalInstance.hide();
      showAlert("Logged in Successfully!", "success");
      setupUI();
    })
    .catch((err) => showAlert(err.response.data.message, "danger"))
    .finally(() => toggleLoader(false));
}

function register() {
  toggleLoader(true);
  const username = document.getElementById("register-username").value;
  const name = document.getElementById("register-name").value;
  const password = document.getElementById("register-password").value;
  const profileImage = document.getElementById("profile-image").files[0];

  const url = `${BASE_URL}/register`;
  const formData = new FormData();
  formData.append("username", username);
  formData.append("name", name);
  formData.append("password", password);
  formData.append("image", profileImage);

  axios
    .post(url, formData)
    .then((res) => {
      const token = res.data.token;
      const user = res.data.user;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // Close Modal
      const registerModal = document.getElementById("register-modal");
      const modalInstance = bootstrap.Modal.getInstance(registerModal);
      modalInstance.hide();
      showAlert("You Registered Successfully!", "success");
      setupUI();
    })
    .catch((err) => {
      const message = err.response.data.message;
      showAlert(message, "danger");
    })
    .finally(() => toggleLoader(false));
}

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  setupUI();
  showAlert("Logged out successfully!", "success");
}

function showAlert(message, color) {
  const alertPlaceholder = document.getElementById("success-alert");
  const appendAlert = (message, type) => {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = [
      `<div class="alert alert-${type} alert-dismissible" role="alert">`,
      `   <div>${message}</div>`,
      '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
      "</div>",
    ].join("");

    alertPlaceholder.append(wrapper);
  };
  appendAlert(message, color);

  // Hide alert after 2 sec
  // setTimeout(() => {
  //   const alert = bootstrap.Alert.getOrCreateInstance("#success-alert");
  //   alert.close();
  // }, 5000);
}

function addBtnClicked() {
  document.getElementById("post-id").value = "";
  document.getElementById("post-title").value = "";
  document.getElementById("post-body").value = "";
  document.getElementById("post-modal-title").innerHTML = "Add A New Post";
  document.getElementById("create-btn").innerHTML = "Create";
  const editModal = new bootstrap.Modal(
    document.getElementById("add-post-modal")
  );
  editModal.toggle();
}

function createNewPost() {
  toggleLoader(true);
  const postId = document.getElementById("post-id").value;
  const isCreate = postId ? false : true;

  const title = document.getElementById("post-title").value;
  const body = document.getElementById("post-body").value;
  const image = document.getElementById("post-image").files[0];

  const token = localStorage.getItem("token");

  const formData = new FormData();
  formData.append("body", body);
  formData.append("title", title);
  formData.append("image", image);

  let url = "";
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  if (isCreate) {
    url = `${BASE_URL}/posts`;
    axios
      .post(url, formData, config)
      .then(() => {
        // Close Modal
        const addNewPostModal = document.getElementById("add-post-modal");
        const modalInstance = bootstrap.Modal.getInstance(addNewPostModal);
        modalInstance.hide();
        showAlert("Post Added Successfully!", "success");
        getPosts();
      })
      .catch((err) => {
        const message = err.response.data.message;
        showAlert(message, "danger");
      });
  } else {
    formData.append("_method", "put");
    url = `${BASE_URL}/posts/${postId}`;
    axios
      .post(url, formData, config)
      .then(() => {
        // Close Modal
        const addNewPostModal = document.getElementById("add-post-modal");
        const modalInstance = bootstrap.Modal.getInstance(addNewPostModal);
        modalInstance.hide();
        showAlert("Post Edited Successfully!", "success");
        getPosts();
      })
      .catch((err) => {
        const message = err.response.data.message;
        showAlert(message, "danger");
      })
      .finally(() => toggleLoader(false));
  }
}

function editPost(post) {
  post = JSON.parse(decodeURIComponent(post));

  document.getElementById("post-id").value = post.id;
  document.getElementById("post-modal-title").innerHTML = "Edit Post";
  document.getElementById("create-btn").innerHTML = "Edit";
  document.getElementById("post-title").value = post.title;
  document.getElementById("post-body").value = post.body;
  const editModal = new bootstrap.Modal(
    document.getElementById("add-post-modal")
  );
  editModal.toggle();
}

function deletePost(post) {
  post = JSON.parse(decodeURIComponent(post));
  document.getElementById("delete-post-id").value = post.id;
  const editModal = new bootstrap.Modal(
    document.getElementById("delete-post-modal")
  );
  editModal.toggle();
}

function confirmDeletePost() {
  toggleLoader(true);
  const postId = document.getElementById("delete-post-id").value;
  const token = localStorage.getItem("token");
  const url = `${BASE_URL}/posts/${postId}`;
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  axios
    .delete(url, config)
    .then(() => {
      // Close Modal
      const addNewPostModal = document.getElementById("delete-post-modal");
      const modalInstance = bootstrap.Modal.getInstance(addNewPostModal);
      modalInstance.hide();
      showAlert("Post Deleted Successfully!", "success");
      getPosts();
    })
    .catch((err) => showAlert(err.response.data.message, "danger"))
    .finally(() => toggleLoader(false));
}

function profileClicked() {
  const userId = JSON.parse(localStorage.getItem("user")).id;
  window.location = `Profile.html?userId=${userId}`;
}

function toggleLoader(show = true) {
  if (show) document.getElementById("loader").style.display = "flex";
  else document.getElementById("loader").style.display = "none";
}

// Event Handlers
document.getElementById("login-btn").addEventListener("click", login);
document.getElementById("register-btn").addEventListener("click", register);
document.getElementById("create-btn").addEventListener("click", createNewPost);
