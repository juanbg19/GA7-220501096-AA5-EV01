const mensajeError = document.getElementsByClassName('error')[0];

document.getElementById("registro-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const usuario = e.target.elements.usuario.value;
  const email = e.target.elements.email.value;
  const contraseña = e.target.elements.contraseña.value;

  const res = await fetch("http://localhost:4000/registrar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ usuario, email, contraseña })
  });

  if (!res.ok) {
    mensajeError.textContent = "Error al registrar usuario";
    mensajeError.style.display = "block";
    return;
  }

  const resJson = await res.json();
  if (resJson.redirect) {
    window.location.href = resJson.redirectUrl || '/login';
  } else {
    alert("Usuario registrado con éxito");
    window.location.href = "/login";
  }
});
