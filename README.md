Mariage
=======

Site de notre mariage optimisé pour mobile, avec un accent mis sur les performances.

Site visible sur www.mariage-greg-anne.fr et www.mariage-greg-anne.fr/save-the-date.html

# Technologies utilisées

- HTML5 
- SASS & Bootstrap
- jQuery / Vanilly JS
- Grunt Bower

# Performances

CSS
- utilisation de grunt-contrib-cssmin pour la minification des CSS
- utilisation de grunt-uncss pour la génération d'un fichier CSS avec seulement les selecteurs nécessaires.

JS
- utilisation de grunt-contrib-uglify pour la minification des JS
- utilisation de javascript sur les pages ou jQuery n'est pas nécessaire.

IMG
- utilisation de grunt-contrib-imagemin pour l'optimisation des images
- chargement d'image de taille différentes selon la taille de la fenêtre grâce aux media queries
- utilisation de grunt-webp pour une meilleure optimisation des images pour les navigateurs webkit/blink

FONTS
- chargement des fonts seulement sur grands écrans grâce aux média queries
- police d'icones vectorielle
