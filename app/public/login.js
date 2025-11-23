const mensajeError = document.querySelector('.error');

document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const user = e.target.elements.user.value;
  const password = e.target.elements.password.value;
  const res = await fetch("http://localhost:4000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user, password })
    });

    if (!res.ok) {
      mensajeError.classList.toggle("escondido", false);
      return;
    }

    const resJson = await res.json();
    if (resJson.redirect) {
      window.location.href = resJson.redirect;
    }  
});