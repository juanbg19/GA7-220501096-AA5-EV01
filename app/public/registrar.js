const mensajeError = document.getElementsByClassName('error')[0];

document.getElementById("registro-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const user = e.target.elements.user.value;
  const email = e.target.elements.email.value;
  const password = e.target.elements.password.value;

  const res = await fetch("http://localhost:4000/registrar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user, email, password })
  });

  if (!res.ok) {
    mensajeError.classList.toggle("escondido", false);
    return;
  }

  const resJson = await res.json();
  if (resJson.redirect) {
    window.location.href = resJson.redirectUrl || '/';
  }
});
