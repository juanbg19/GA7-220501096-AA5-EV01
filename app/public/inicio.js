document.getElementsByTagName('button')[0].addEventListener('click', () => {
    document.cookie = 'jwt=; path =/; expires=thu,01 Jan 1970 00:00:01 GMT;'// Elimina la cookie JWT
document.location.href = '/'; // Redirige al login

}   );
