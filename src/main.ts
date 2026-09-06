import "./styles/custom.scss";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/js/dist/collapse"; // active le toggler du menu mobile (data-bs-toggle="collapse")

import { loadPartials } from "./include";

document.addEventListener("DOMContentLoaded", () => {
  void loadPartials();

  // Emplacement pour les scripts propres a chaque page :
  // - accordéons dans les fiches compétences/réalisations
  // - filtres sur la page réalisations
  // - navigation circulaire compétences <-> réalisations
});
