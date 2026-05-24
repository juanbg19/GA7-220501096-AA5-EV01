const mensajeError = document.querySelector('.error');

document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const usuario = e.target.elements.usuario.value;
  const contraseña = e.target.elements.contraseña.value;

  const res = await fetch("http://localhost:4000/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ usuario, contraseña })
  });

  const resJson = await res.json();

  if (!res.ok || resJson.status === "error") {
    mensajeError.textContent = resJson.message || "Credenciales incorrectas";
    mensajeError.style.display = "block";
    return;
  }

  if (resJson.redirect) {
    window.location.href = resJson.redirect;
  }
});
