const registerForm = document.getElementById("registerForm");

registerForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  const data = Object.fromEntries(new FormData(registerForm));
  fetch("/api/session/register", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.error) {
        registerForm.firstChild.textContent = `${res.error}`;
        console.log(res.error);
        return;
      } else {
        console.log(res);
        location.assign("http://localhost:8080/login");
        return;
      }
    });
});
