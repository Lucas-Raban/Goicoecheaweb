// Adapta la maqueta 3D que arma Claude para mostrarla dentro de la ficha:
// los accesos al tour 360 avisan a la ficha (que abre su solapa Tour 360) y "Todos los tours" se oculta.
const avisoTour = "parent.postMessage({ tipo: 'abrir-tour360' }, '*')";

const script = `<script>
(function () {
  // Delegado en el documento: también toma los puntos 360° que la maqueta crea después.
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a');
    if (a && a.getAttribute('href') === './') { e.preventDefault(); ${avisoTour}; }
  }, true);
  document.querySelectorAll('a[href="../"]').forEach(function (a) { a.style.display = 'none'; });
})();
</script>`;

export function adaptarMaqueta(html: string) {
  const adaptado = html.replace(/(?:window\.)?location\.href\s*=\s*(['"])\.\/\1/g, avisoTour);
  return adaptado.includes("</body>") ? adaptado.replace("</body>", `${script}</body>`) : adaptado + script;
}
