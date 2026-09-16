/* ================================
   MENU DOS TRÊS PONTINHOS
================================ */

const moreButton = document.getElementById("moreButton");
const moreDropdown = document.getElementById("moreDropdown");

moreButton.addEventListener("click", function (event) {
    event.stopPropagation();
    moreDropdown.classList.toggle("active");
});

document.addEventListener("click", function () {
    moreDropdown.classList.remove("active");
});