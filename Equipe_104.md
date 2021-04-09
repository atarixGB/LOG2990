# Feedback Équipe 104

## Fonctionnalités


### Annuler-refaire

**Critères d'acceptabilité**

- [x] Il est possible d’annuler la dernière action réalisée.
- [x] La fonction d’annulation de dernière action peut être appelée un nombre illimité de fois.
- [ ] Toutes les modifications apportés à la même sélection sont considérés comme 1 seule action.
- [x] Il est possible de refaire toutes les actions annulées, une à la fois, dans l’ordre inverse.
- [ ] Une nouvelle action élimine la pile des actions annulées pouvant être refaite.
- [x] Annuler et Refaire sont accessible via la barre latérale.
- [x] Si l'action Annuler ou Refaire est indisponible, il doit être impossible de choisir respectivement l'action Annuler ou Refaire via la barre latérale.
- [x] Les deux options (annuler-refaire) devront être désactivées lorsqu’un outil est en cours d’utilisation.
- [x] Il est possible d'annuler une action avec le raccourci `CTRL + Z`.
- [x] Il est possible de refaire une action avec le raccourci `CTRL + SHIFT + Z`.

**Autres commentaires**
- Outil à améliorer
- Faire un dessin. Faire une sélection. La déplacer. Ensuite cliquer hors de la zone de travail. Une erreur apparaît dans la console. Et à partir de la, il n'est plus possible de faire des `undo`.
- Les undo ne fonctionnent pas sur les déplacements de sélection, polygones avec contour et sur le redimensionnent de la zone de dessin.


### Outil - Pipette

**Critères d'acceptabilité**

- [x] Il est possible de sélectionner l'outil Pinceau avec la touche `I`.
- [x] La couleur saisie est celle du pixel sous le pointeur de la souris.
- [x] Il est possible de saisir et d’assigner la couleur d'un point à la couleur principale.
- [x] Il est possible de saisir et d’assigner la couleur d'un point à la couleur secondaire.
- [x] Le changement de la couleur principale se fait avec un clic gauche.
- [x] Le changement de la couleur secondaire se fait avec un clic droit.
- [ ] Si le pointeur se retrouve hors de la surface de dessin, le cercle de prévisualisation n’est pas affiché.
- [x] Lorsque le pointeur se trouve près d’une frontière de la surface de dessin, les pixels hors surface n’ont pas à être dessinés.
- [x] Le cercle de prévisualisation est présent dans le panneau d’attributs.
- [x] Le cercle de prévisualisation met en évidence le pixel sous le pointeur de la souris.
- [x] Le cercle de prévisualisation est mis à jour lors du mouvement de la souris.

**Autres commentaires**
- Bon travail
- Il est possible de faire sortir la souris de la zone de travail et de quand même voir le cercle de prévisualisation avec un mouvement légèrement rapide.
- Pipette testée à seulement 60 %


### Outil - Aérosol

**Critères d'acceptabilité**

- [x] Il est possible d'utiliser l'aérosol.
- [x] Il est possible de sélectionner l'outil Aérosol avec la touche `A`.
- [x] Il est possible de définir le nombre d'émissions par seconde.
- [x] L'émission de peinture se fait à intervalle régulier.
- [x] Le motif de vaporisation change à chaque émission.
- [x] Il est possible de définir le diamètre du jet.
- [x] Il est possible de définir le diamètre des gouttelettes du jet.
- [x] Les attributs modifiables par l'utilisateur sont vérifiés avant d'être appliqués (validation).

**Autres commentaires**
- Bon travail
- Quand on sort de la zone de dessin et on revient, on ne peut continuer à vaporiser.
- Aerosol testé à 85%. Beaucoup de branches non couvertes.

### Outil - Polygone

**Critères d'acceptabilité**

- [x] Il est possible de créer des polygones.
- [x] Il est possible de sélectionner l'outil Polygone avec la touche `3`.
- [x] Un glisser-déposer permet de créer un périmètre circulaire.
- [x] La forme à créer est inscrite dans le périmètre.
- [x] La forme à créer occupe la plus grande aire possible dans le périmètre.
- [x] La forme est dessinée et mise à jour en temps réel.
- [x] Si le pointeur de la souris quite la surface de dessin, le périmètre continue d’être affiché au complet.
- [x] Il est possible de définir l’épaisseur du trait de contour.
- [x] Il est possible de choisir le type de tracé (*Contour*, *Plein* ou *Plein avec contour*).
- [x] L’intérieur d’une forme est dessiné avec la couleur principale.
- [x] Le contour d’une forme est dessiné avec la couleur secondaire.
- [x] Il est possible de définir le nombre de côtés du polygone à créer (minumum 3, maximum 12).
- [x] Les polygones dessinés sont réguliers et convexes.
- [x] Les attributs modifiables par l'utilisateur sont vérifiés avant d'être appliqués (validation).

**Autres commentaires**
- Bon travail

### Outil - Sélection par rectangle et ellipse

**Critères d'acceptabilité**
- [x] Il est possible de sélectionner l'outil Sélection par Rectangle avec la touche `R`.
- [x] Il est possible de forcer l'outil Sélection par Rectangle en forme carré avec la touche `SHIFT`.
- [x] Il est possible de sélectionner l'outil Sélection par Ellipse avec la touche `S`.
- [x] Il est possible de forcer l'outil Sélection Ellipse en forme de cercle avec la touche `SHIFT`.
- [x] L'utilisation de la touche d'échappement (`ESC`) annule la sélection en entier.
- [x] Il est possible de sélectionner toute la surface de dessin avec le raccourci `CTRL + A`.
- [x] Il est possible de sélectionner toute la surface de dessin avec un bouton dans la barre latérale.
- [x] Il est possible de sélectionner un ou plusieurs pixels avec un rectangle ou un ellipse de sélection.
- [x] Un rectangle ou un ellipse de sélection s’effectue avec un glisser-déposer.
- [x] L’affichage du rectangle et l'ellipse de sélection est en tout temps mis à jour pendant le glisser-déposer.
- [x] Le rectangle et l'ellipse de sélection résultent en une boîte englobante seulement à la fin du glisser-déposer.
- [x] La boite englobante doit être minimale, peu importe son orientation.
- [x] La boite englobante a 8 points de contrôle.
- [x] La sélection est en tout temps mise à jour pendant le glisser-déposer.
- [x] Un pixel est sélectionné si la sélection est en collision avec.
- [x] La région de pixels sélectionnée est entourée d'une boîte pointillé (Sélect. rectangle) ou d'une forme ronde pointillé (Sélect. ellipse).
- [x] La sélection inclut toujours les pixels de l'arrière-plan.
- [x] La région de sélection ne peut jamais dépasser la zone de dessin, même si la souris dépasse cette zone.

**Autres commentaires**
- sélection de en bas-droite vers haut-gauche avec shift et mouvement de souris affiche des rectangles de sélections un peu partout
- lacher la sélection en dehors du canvas de dessin ne fait pas la sélection

### Exporter le dessin

**Critères d'acceptabilité**

- [x] Il est possible d'exporter le dessin localement via une fenêtre d'export de fichier.
- [x] Il est possible d'ouvrir la fenêtre d'export avec le raccourci `CTRL + E`.
- [x] Une seule fenêtre modale parmi: (sauvegarder, carrousel et exporter) peut être affichée en même temps (pas de _stack_ non plus).
- [x] Les différent raccourcis ne sont pas disponibles lorsque cette fenêtre est affichée.
- [x] Il est possible d'exporter une image en format JPG.
- [x] Il est possible d'exporter une image en format PNG.
- [ ] Il est possible d'appliquer un filtre à l'image exportée.
- [ ] Un choix d'au moins 5 filtres _sensiblement_ différents est offert.
- [ ] Les différents filtres sont clairement identifiés pour leur sélection.
- [ ] Un seul filtre est appliqué à l'image exportée.
- [x] Il doit être possible d'annuler le filtre appliqué en choisissant l'option _Aucun filtre_
- [x] Il est possible d'entrer un nom pour le fichier exporté.
- [x] Il est possible de voir une vignette de prévisualisation de l'image à exporter.
- [x] Un bouton de confirmation doit être présent pour exporter l'image.

**Autres commentaires**
- Exportation retourne des images noirs


### Déplacement d'une sélection

**Critères d'acceptabilité**

- [x] Il est possible de déplacer une sélection avec un glisser-déposer avec le bouton gauche de la souris.
- [x] La sélection suite le pointeur de la souris en tout temps.
- [x] Le point de sélection sous le pointeur de la souris doit rester le même.
- [x] Il est possible de déplacer une sélection avec les touches directionnelles (flèches) du clavier.
- [x] La sélection est déplacée de 3 pixels dans la direction de la touche appuyée.
- [x] Il est possible de déplacer la sélection de manière continue si au moins une touche est maintenue appuyée pendant 500 ms.
- [x] La sélection est déplacée de 3 pixels dans la direction de la touche appuyée à chaque 100 ms pendant un déplacement continu.
- [x] Il est possible de déplacer la sélection dans plusieurs directions en même temps.
- [ ] Toutes les modifications apportés à la même sélection sont considérés comme 1 seule action.

**Autres commentaires**
- sélection eclipse et sélection de tout le canvas laisse des traces du vieux dessins lors du déplacement
### Sauvegarder le dessin sur serveur

**Critères d'acceptabilité**

- [x] Il est possible de sauvegarder le dessin sur un serveur via une fenêtre de sauvegarde.
- [x] Il est possible de sauvegarder le dessin dans le format de votre choix.
- [x] Il est possible d'ouvrir la fenêtre de sauvegarde avec le raccourci `CTRL + S`.
- [x] Une seule fenêtre modale parmi: (sauvegarder, ouvrir et exporter) peut être affichée en même temps (pas de _stack_ non plus)
- [ ] Les différent raccourcis ne sont pas disponibles lorsque cette fenêtre est affichée.
- [x] Il est possible d'associer un nom au dessin à sauvegarder.
- [x] Il est possible d'associer zéro ou plusieurs étiquettes au dessin.
- [x] Il est possible d'enlever les étiquettes si elles sont choisies dans la fenêtre.
- [x] Il est possible de sauvegarder des dessins avec le même nom et avec les mêmes étiquettes (cette condition simultanément ou non) dans le serveur.
- [ ] Les règles de validation pour les étiquettes sont clairement présentées dans l'interface.
- [x] Des vérifications (client ET serveur) sont présentes pour la sauvegarde. _Vérification minimale: nom non vide et étiquettes valides_
- [x] S'il est impossible de sauvegarder le dessin, l'utilisateur se fait mettre au courant avec un message pertinent (message d'erreur).
- [x] Un bouton de confirmation doit être présent pour sauvegarder le dessin.
- [ ] La modale de sauvegarde (ou du moins le bouton de confirmation) est mise non disponbile lorsque le dessin est en pleine sauvegarde.

### Carrousel de dessins

**Critères d'acceptabilité**

- [x] Il est possible de voir les dessins sauvegardés sur un serveur via le carrousel de dessins.
- [x] Il est possible d'ouvrir la fenêtre du carrousel avec le raccourci `CTRL + G`.
- [x] Le carrousel doit présenter 3 fiches à la fois.
- [x] Le carrousel doit gérer les cas oũ moins de 3 dessins sont disponibles.
- [x] Il est possible de faire défiler le carrousel en boucle avec les touches du clavier.
- [x] Il est possible de faire défiler le carrousel en boucle avec des boutons présents dans l'interface.
- [x] Une seule fenêtre modale parmi: (sauvegarder, carrousel et exporter) peut être affichée en même temps (pas de _stack_ non plus).
- [ ] Les différent raccourcis ne sont pas disponibles lorsque cette fenêtre est affichée.
- [x] Chaque fiche de dessin comporte un nom, des étiquettes (s'il y en a) et un aperçu du dessin en format réduit.
- [x] Le nom, les étiquettes et l'aperçu doivent être ceux qui ont été définis lorsque l'utilisateur les a sauvegardé.
- [x] Lors des requêtes pour charger les dessins dans la liste, un élément de chargement doit indiquer que la requête est en cours.
- [x] La liste doit être chargeable sans délai excessif.
- [x] Il est possible de filtrer les dessins par leurs étiquettes. Voir la carte **Filtrage par étiquettes**.
- [ ] Il est possible de charger un dessin en cliquant sur sa fiche.
- [ ] Si un dessin choisi ne peut pas être ouvert, l'utilisateur doit être invité à choisir un autre via la même fenêtre modale.
- [x] Si un dessin présent non-vide est sur la zone de travail, l'utilisateur doit recevoir une alerte confirmant ou non vouloir abandonner ses changements.
- [x] Il est possible de supprimer un dessin à l'aide d'un bouton de suppression.
- [x] Lorsqu'un dessin est supprimé, le carrousel doit se mettre automatiquement à jour et ne doit plus contenir ce dessin .
- [ ] Si un dessin choisi ne peut pas être supprimé, l'utilisateur doit être informé de la raison et le carrousel doit être mis à jour.
- [x] Lorsqu'un dessin est sauvegardé, _au moins à_ la prochaine ouverture, le carrousel doit pouvoir afficher le nouveau dessin sauvegardé.
- [x] Les anciens paramètres d'ouverture ne sont plus visibles lors de la réouverture du carrousel (les paramètres sont remis à leur état original). _ie: pas de filtre d'activé_

**Autres commentaires**

- Lorsqu'on charge un dessin qui n'existe pas sur le serveur, l'affichage dans le carrousel est brisé
- Lorsqu'on essaye de supprimer un image qui n'est pas sur le serveur, il crash

### Base de données

**Critères d'acceptabilité**

- [x] Il est possible de sauvegarder le nom et les tags d'un nouveau dessin sur une base de données MongoDB.
- [x] La base de données est à distance et non localement sur la machine du serveur.
- [x] Lorsqu'un dessin est supprimé par un utilisateur, la base de données est mise à jour.
- [x] Le client est capable de récupérer l'information d'un ou plusieurs dessins à partir de la base de données.
- [ ] La récupération de données se fait à partir de la base de données et non des fichiers locaux.
- [ ] Si la base de données contient des informations sur des dessins non-existants sur le serveur, ces dessins ne sont pas montrés à l'utilisateur.

**Autres commentaires**

### Filtrage par étiquettes

**Critères d'acceptabilité**

- [x] Il doit être possible de filtrer les dessins en utilisant des étiquettes.
- [x] Pour chaque dessin de la liste, les étiquettes, si présentes, doivent toutes être visibles (via un mécanisme de votre choix).
- [x] Le filtrage par étiquette - Lorsque vide, tous les dessins doivent être possibles d'être chargés. _ie: pas d'étiquette, pas de filtre_.
- [x] Le filtrage par étiquette - Lorsqu'une étiquette est sélectionnée pour filtrage, seulement les dessins sur le serveur avec cette étiquette sont visibles dans le carrousel.
- [x] Le filtrage par étiquette - Lorsque mutliples étiquettes sont sélectionnées pour filtrage, seulement les dessins sur le serveur qui contiennent au moins une des étiquettes doivent être visibles dans la liste (_OU_ logique).
- [x] Il doit être possible d'accéder à tous les dessins du carrousel, pour un critère de recherche donné.
- [x] Si aucun dessin n'est trouvable par les étiquettes sélectionnées, l'utilisateur doit en être informé.
- [x] Les anciens paramètres d'ouverture ne sont plus visibles lors de la réouverture du carrousel (les paramètres sont remis à leur état original). _ie: pas de filtre d'activé_
## Assurance qualité

# Qualité des classes

### La classe minimise l'accessibilité des membres (public/private/protected)
- [caroussel.component.ts] `URL_POSITION` devrait être privée
- [*.component.ts] Tous vos attributs ViewChild sont publics 


### Les valeurs par défaut des attributs de la classe sont initialisés de manière consistante (soit dans le constructeur partout, soit à la définition)
- [drawing.component.ts] `dragPosition` initialisée différemment
- [export-modal.component.ts] `maxLength` initialisée différemment
- [line.service.ts] `pointJoin` initialisée différemment
- [move-selection.service.ts] `intervalId` initialisée différemment
  

## Qualités des fonctions


### Les noms des fonctions sont précis et décrivent les tâches voulues. 
- [app.component.ts] `Func` 
- [polygon-config.component.ts] `getSides` est une méthode get qui ne retournent rien. À voir l'implémentation on aurait plus dit un `set`. Et elle n'es jamais utilisée à part dans les tests.


### Les fonctions minimisent les paramètres en entrée (pas plus de trois).
- [line.service.ts] `solveLinearEquationsSystem` prend 6 arguments. La limite est de 3.


### Utilisation d'interfaces ou de classe pour des paramètres pouvant être regroupé logiquement.
- [ellipse.ts et autres outils] Regrouper les paramètres de l'outil constructeur dans une interface


### Tous les paramètres de fonction sont utilisés
- [move-selection.service.ts] `event` pas utilisée dans `onMouseUp()`
- [database.controller.ts] Beaucoup d'arguments de fonctions non utilisés
- [index.service.ts] Beaucoup d'arguments de fonctions non utilisés


## Exceptions

### Les exceptions sont claires et spécifiques (Pas d'erreurs génériques). Les messages d'erreur affichés à l'utilisateur sont compréhensible pour l'utilisateur moyen (pas de code d'erreur serveur, mais plutôt un message descriptif du genre "Un problème est survenu lors de la sauvegarde du dessin")
-  On s'attendait à une gestion des exception avec messages très descriptifs.
### QA
L29: polygon.service.ts(120)
L30: enum du polygon.ts et ellipse.ts, rgba.ts(2)
L35: config-panel.component.ts (21), index.service.ts(92), selection.service.ts(63)
L56: package json dans le root# Qualité générale

- L39: `pencil-service.ts` devrait être `pencil.service.ts`
- L41: Avoir une logique pour organiser les méthodes dans une classe (public d'abord et protected puis private en bas par exemple)
- L42: Uniformisez la langue utilisée pour les commentaires
- L43: Code/tests commenté
- L47: Tslint rule disabled sans jusrtification + erreur de lint
- L48: Pas utilisé
