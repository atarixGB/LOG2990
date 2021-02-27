### Fonctionnalités

### Point d'entrée dans l'application

En tant qu'utilisateur, je dois avoir un point d'entrée dans l'application.
Celle-ci contient un message de bienvenue ainsi que les options suivantes:
- Créer un nouveau dessin.
- Ouvrir le carrousel de dessins disponibles sur le serveur.
- Continuer un dessin.

Je ne dois pas voir l'option _Continuer un dessin_ s'il n'y a pas de dessin à continuer.

Je dois pouvoir revenir au point d'entrée de l'application si je décide de fermer le carrousel seulement s'il était ouvert directement du point d'entrée de l'application.

_Note : pour le Sprint 1, le carrousel de dessins peut être un bouton qui ne fait rien (placeholder), mais doit être quand même présent dans l'interface. Similairement, "Continuer un dessin" peut être un bouton caché._

**Critères d'acceptabilité**

- [x] Le point d’entrée sur le site contient l'option *Créer un nouveau dessin* .
- [x] Le point d’entrée sur le site contient l'option *Ouvrir le carrousel de dessins*.
- [x] Le point d’entrée sur le site contient l'option *Continuer un dessin*.
- [x] L'option *Continuer un dessin* est visible seulement s'il y a un dessin à continuer.
- [x] L'application retourne à son point d'entrée si on ferme une des options et qu'on leur ait accédé directement du point d'entrée.

**Autres points**

- Couleurs un peu trop vives au point d'entrée

### Surface de dessin

En tant qu'utilisateur, je dois avoir accès à une surface de dessin sur laquelle dessiner. Elle est représentée par une matrice de pixels que je modifie avec les différents outils.

_Note: Vous devez utiliser un élément [HTML Canvas](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API) pour votre surface de dessin._

Je dois pouvoir redimensionner la surface de dessin sur sa hauteur, sa largeur, ou les deux en même temps.
Je ne dois pas pouvoir baisser la taille de la surface à moins de 250 x 250 pixels.
Je dois pouvoir utiliser les trois points de contrôles : un sur son côté du bas, au centre ; un sur le côté droit, encore au centre ; un sur le coin inférieur droit.

Je dois pouvoir manipuler chaque point de contrôle à l’aide d’un glisser-déposer du bouton gauche de la souris. Pendant le déplacement d’un point de contrôle, un aperçu de la nouvelle taille doit m'être affiché en tout temps à l’aide d’un cadre pointillé. 
Je dois pouvoir confirmer mon redimensionnement simplement en lâchant le bouton de la souris. Toute partie de la surface de dessin qui se trouve désormais en dehors du cadre pointillé est perdue ; toute partie de la zone de travail qui se trouve à l’intérieur du cadre pointillé est colorée en blanc.

**Critères d'acceptabilité**

- [x] La couleur de la surface de dessin est le *blanc* (###FFFFFF).
- [x] La surface de dessin est représentée sous forme matricielle.
- [x] La taille minimale de la surface de dessin est de 250 x 250 pixels.
- [x] La surface de dessin contient 3 points de contrôle.
- [x] Il est possible de redimensionner la surface de dessin en utilisant les points de contrôle avec un glisser-déposer.
- [x] Il est possible de voir une prévisualisation du redimensionnement sous la forme d'un cadre pointillé.
- [x] Il est possible de confirmer un redimensionnement en lâchant le bouton de la souris. 
- [x] Après un redimensionnement, tout ce qui est en dehors de la nouvelle surface de travail est perdu.
- [x] Après un redimensionnement, tout ce qui à été rajouté à la nouvelle surface de travail est coloré en blanc.

**Autres points**

- Il est possible en redimensionnant à moins de 250 x 250 px de détacher les points de contrôles de la surface de dessin
- Il est possible en effectuant des manipulations de créer plusieurs bordures au canvas
- La zone de dessin change légèrement de taille en Y quand on redimensionne en X et vice versa.
- Il manque beaucoup de tests dans `drawing.component.ts`.

### Vue de dessin

En tant qu'utilisateur, je dois avoir accès à une vue de dessin. 
Cette vue doit avoir une surface de dessin, une zone de travail et une barre latérale, contenant un panneau d'attributs. 

Je dois pouvoir dessiner seulement sur la surface de dessin. Cette surface est ancrée au coin supérieur gauche de la zone de travail. 
Je dois toujours pouvoir distinguer entre la zone de travail et la surface de dessin. 
Je dois voir des barres défilement seulement si la surface de dessin et la zone de travail ne sont pas visibles sur l'écran. 

La barre latérale contient tous les outils de dessins, options et actions disponibles pour le bon fonctionnement de l'application.
Je dois voir **clairement** quel outil ou option sont actifs à tout moment.
Le contenu du panneau d'attribut doit changer en fonction de l'outil actif.
Lorsque le pointeur de la souris reste au-dessus d’un bouton de la barre pendant un certain temps, une infobulle apparait avec le nom de l'outil ou fonctionnalité ainsi que le raccourci clavier associé.
  
_Note: Vous pouvez ajouter tous les boutons et éléments d'interface dès le Sprint 1 ou les ajouter au fur et à mesure que les fonctionnalités sont implémentées. Un élément d'interface visible pour une fonctionnalité non-implémentée ne doit pas interférer avec le reste de l'application._

**Critères d'acceptabilité**

- [x] La vue de dessin contient une surface de dessin.
- [x] La vue de dessin contient une zone de travail.
- [x] Le coin supérieur gauche de la surface de dessin est ancrée au coin supérieur gauche de la zone de travail.
- [x] Il est possible de distinguer la zone de travail de la zone de dessin.
- [x] Il est possible de toujours voir une section de la zone de travail à droite et en bas de la surface de dessin.
- [x] Des barres de défilement sont présentes seulement si la surface de dessin et la zone de travail ne sont pas complètement visible sur l'écran.
- [x] La vue de dessin contient une barre latérale.
- [x] La barre latérale doit contenir les outils de dessin et les autres fonctionnalités diverses (options de fichiers, etc.).
- [x] La barre latérale contient un panneau d'attributs.
- [x] Le panneau d'attribut contient les différents paramètres de l'outil actif.
- [x] L'outil ou l'option choisis sont clairement indiqués dans l'interface.
- [x] Il est possible d'avoir une infobulle sur les boutons de la barre latérale avec le nom de l'outil ou fonctionnalité associé au bouton.
- [x] L'infobulle contient le nom de l'outil ou fonctionnalité ainsi que le raccourci clavier associe, si applicable.

### Créer un nouveau dessin

En tant qu'utilisateur, je dois pouvoir créer un nouveau dessin.

La création du dessin présente la surface de dessin vide avec un fond blanc dont les dimensions en largeur et hauteur sont égales à la moitié de celles de la zone de travail. 
La taille de la surface de dessin doit être d’au minimum 250 x 250 pixels. Si la zone de travail a une taille inférieure à 500 x 500 pixels, alors la taille de la surface de dessin est fixée à sa taille minimale.

Je dois pouvoir toujours voir un peu de la zone de travail en bas et à droite, peu importe la taille de la surface de dessin.
Le coin supérieur gauche de la surface de dessin est toujours ancré au coin supérieur gauche de la zone de travail. 

**Critères d'acceptabilité**

- [x] Il est possible créer un nouveau dessin via l'option *Créer un nouveau dessin* du point d'entrée dans l'application.
- [x] Il est possible créer un nouveau dessin via un bouton dans la barre latérale.
- [x] Il est possible de créer un nouveau dessin avec le raccourci `CTRL + O`.
- [x] Si un dessin présent non-vide est sur la zone de travail, l'utilisateur doit recevoir un avertissement confirmant ou non vouloir abandonner ses changements.
- [x] La taille initiale de la surface de dessin est la moité de la zone de travail au moment de la création.
- [x] La taille minimale de la surface de dessin est de 250 x 250 pixels.
- [x] Le coin supérieur gauche de la surface de dessin est ancré au coin supérieur gauche de la zone de travail.

**Autres points**

- Quand on appuie plusieurs fois `CTRL + O` on obtient un empilement de modales.

### Efface

- [x] Il est possible de supprimer une partie du dessin avec l'outil Efface.
- [x] Il est possible de sélectionner l'outil Efface avec la touche `E`.
- [x] Il est possible de définir la taille de l’efface.
- [x] La taille minimale de l'efface est de 5 pixels.
- [x] L'efface est représentée par un carée blanc avec une mince bordure noire.
- [x] La taille de la représentation de l'efface doit être mise à jour lors d'un changement de la taille de l'efface.
- [x] Il est possible d’utiliser l’efface comme une brosse avec un glisser-déposer.
- [x] Le trait d'effacement doit toujours être continu.
- [x] Un effacement par glisser-déposer ne constitue qu’une seule action dans un contexte d’annuler-refaire.
- [x] Les attributs modifiables par l'utilisateur sont vérifiés avant d'être appliqués (validation).
- Les traits se relient lorsque nous sortons et retournons dans le canvas.

### Couleur

- [x] La configuration de la couleur est partagée pour tous les outils.
- [x] L’attribut de couleur est en tout temps présent sur le panneau.
- [x] Il est possible de définir la couleur principale.
- [x] Il est possible de définir l'opacité de la couleur principale.
- [x] Il est possible de définir la couleur secondaire.
- [x] Il est possible de définir l'opacité de la couleur secondaire.
- [x] Il est possible d’intervertir la couleur principale et secondaire.
- [x] La configuration de la couleur se fait à partir d'une palette de couleurs.
- [x] La palette de couleurs permet d'afficher tous les couleurs du spectre RGB.
- [x] Il est possible de spécifier textuellement la couleur avec des valeurs hexadécimales pour chaque composante (R,G et B).
- [x] Lorsqu'une palette non intégrée au paneau est utilisée pour choisir une couleur, cette dernière est masquée suite à la confirmation du choix de couleur.
- [x] Un changement d'opacité ne compte pas comme un changement de couleur pour les 10 couleurs utilisées.
- [x] Le panneau doit présenter les 10 dernières couleurs utilisées.
- [x] L'utilisateur peut choisir parmi les 10 dernières couleurs utilisées pour choisir sa couleur primaire ou secondaire.
- [x] Un clic gauche sur une des 10 dernières couleurs choisit la couleur  comme couleur primaire.
- [x] Un clic droit sur une des 10 dernières couleurs choisit la couleur  comme couleur secondaire.
- [x] Il est impossible de mettre une couleur non-valide.
- il y a plus que 10 couleurs en historique

### Crayon

- [x] Il est possible d'utiliser le crayon.
- [x] Il est possible de sélectionner l'outil Crayon avec la touche `C`.
- [x] Le crayon a une pointe ronde.
- [x] Il est possible de définir l'épaisseur du trait en pixels.
- [x] Le crayon prends en compte les attributs de couleur.
- [x] Un trait ne comportant aucun déplacement est quand même valide et crée un point sur la surface de dessin.
- [x] Il est possible de dessiner un trait de longueur long inifinie. Le trait de crayon est dessiné tant que le bouton gauche de la souris reste appuyé.
- [x] Si le pointeur de la souris quite la surface de dessin, rien n'est dessiné.
- [x] Si le pointeur de la souris quite la surface de dessin et revient, le trait continue d'être dessiné à partir du point d'entrée du curseur.
- [x] Les attributs modifiables par l'utilisateur sont vérifiés avant d'être appliqués (validation).
- Les traits se relient lorsque nous sortons et retournons dans le canvas.
- Glisser un peu, le trait fait des formes bizarres

### Outil Ligne

- [x] Il est possible de créer une ligne composée de plusieurs segments liés.
- [x] Il est possible de sélectionner l'outil Ligne avec la touche L.
- [x] Il est possible de voir un segment temporaire de prévisualisation en tout temps pendant le tracage de la ligne.
- [x] Le segment de prévisualisation suit le pointeur de la souris.
- [x] Chaque segment est créé par un clic après le clic initial.
- [x] Il est possible de terminer la ligne avec un double-clic.
- [ ] Un double clic à 20 pixels du point intial de la ligne lie le dernier segment au point intial peu importe l'état de la touche SHIFT
- [ ] Il est possible d’annuler une ligne en cours de création (touche ESCAPE)
- [ ] Il est possible d’annuler le segment le plus récente (touche BACKSPACE)
- [ ] À la suppression d’un point, l’affichage doit aussitôt être mis à jour (ligne et segment temporaire).
- [x] Il est possible de définir l’épaisseur de la ligne.
- [x] Il est possible de choisir le type de jonction (avec ou sans point).
- [ ] Il est possible de définir le diamètre des points de jonction (si présents).
- [x] Les attributs modifiables par l'utilisateur sont vérifiés avant d'être appliqués (validation).
- [x] Il est possible de forcer l'alignement du segment en gardant la touche SHIFT appuyée.
- [x] Il est possible d'avoir un aligment avec l'axe des X avec un angle multiple de 45 degrés (0, 45, 90, 135, 180, 225, 270 ou 315).
- [x] Le deuxième point d’un segment fixé à un angle de 0 ou 180 degrés doit avoir une position en x égale à la position en x du pointeur de la souris etune position en y égale à la position en y du premier point (origine).
- [x] Le deuxième point d’un segment fixé à un angle de 90 ou 270 degrés doit avoir une position en y égale à la position en y du pointeur de la souris et une position en x égale à la position en x du premier point (origine).
- [x] Le deuxième point d’un segment fixé à un angle de 45, 135, 225 ou 315 degrés doit avoir une position en x égale à la position en x du pointeur de lasouris et une position en y calculée en fonction de la position en x et de l’angle à respecter.
- [x] Lorsque la touche SHIFT est relâchée, le segment suit le pointeur de la souris.
- [ ] Le passage d'alignement forcé à libre et vice-versa se fait automatiquement, sans le déplacement de la souris.

**Commentaires:**

### Outil ellipse

- [x] Il est possible de créer des ellipses.
- [x] Il est possible de sélectionner l'outil Ellipse avec la touche 2.
- [x] Un glisser-déposer permet de créer un périmètre rectangulaire.
- [ ] La forme à créer est inscrite dans le périmètre.
- [x] La forme à créer occupe la plus grande aire possible dans le périmètre.
- [x] Le périmètre et la forme sont dessinés et mis à jour en temps réel.
- [x] Si le pointeur de la souris quite la surface de dessin, le périmètre continue d’être affiché au complet.
- [x] Il est possible de définir l’épaisseur du trait de contour.
- [x] Il est possible de choisir le type de tracé (Contour, Plein ou Plein avec contour).
- [x] L’intérieur d’une forme est dessiné avec la couleur principale.
- [x] Le contour d’une forme est dessiné avec la couleur secondaire.
- [x] Il est possible de forcer la création d’un cercle avec la touche SHIFT.
- [x] Si la touche SHIFT est relâchée, la forme à créer redevient une ellipse.
- [x] Le passage d'ellipse à cercle et vice-versa se fait automatiquement, sans le déplacement de la souris.
- [x] Les attributs modifiables par l'utilisateur sont vérifiés avant d'être appliqués (validation).

**Commentaires:**

- Le perimètre rectangulaire n'est pas affiché pour l'option plein

### Outil rectangle

- [x] Il est possible de dessiner un rectangle.
- [x] Il est possible de sélectionner l'outil Rectangle avec la touche 1.
- [ ] Un glisser-déposer permet de créer un périmètre rectangulaire.
- [x] La forme à créer est inscrite dans le périmètre.
- [x] La forme à créer occupe la plus grande aire possible dans le périmètre.
- [ ] Le périmètre et la forme sont dessinés et mis à jour en temps réel.
- [x] Si le pointeur de la souris quite la surface de dessin, le périmètre continue d’être affiché au complet.
- [ ] Il est possible de définir l’épaisseur du trait de contour.
- [x] Il est possible de choisir le type de tracé (Contour, Plein ou Plein avec contour).
- [x] L’intérieur d’une forme est dessiné avec la couleur principale.
- [x] Le contour d’une forme est dessiné avec la couleur secondaire.
- [x] Il est possible de forcer la création d’un carré avec la touche SHIFT.
- [x] Si la touche SHIFT est relâchée, la forme à créer redevient un rectangle.
- [x] Le passage de rectangle à carré et vice-versa se fait automatiquement, sans le déplacement de la souris.
- [x] Les attributs modifiables par l'utilisateur sont vérifiés avant d'être appliqués (validation).

**Commentaires:**

- Le perimètre rectangulaire n'est pas affiché pour l'option plein

# Assurance qualité

## Qualité des classes

#### La classe minimise l'accessibilité des membres (public/private/protected)
- [*.component.ts] @ViewChild publics même lorsque non nécessaires.


#### Les valeurs par défaut des attributs de la classe sont initialisés de manière consistante (soit dans le constructeur partout, soit à la définition)

- [drawing.component.ts] `canvasSize` et `dragPosition` ne sont initialisés de ma même manière.
- [color-displayer.component.ts] `ColorOrder` et `primaryColor` ne sont pas initialisés de la même manière.
- [line-config.component.ts] `lineService` et `TypeOfJunctions` ne sont pas initialisés de la même manière.


## Qualités des fonctions


#### Les noms des fonctions sont précis et décrivent les tâches voulues. 
- [color-picker.component.ts] `colorPicker()` dans une classe ColorPicker ?


#### Les fonctions minimisent les paramètres en entrée (pas plus de trois).
- [color-manager.service.ts] `updateWithHex()` prend trop de paramètres


#### Utilisation d'interfaces ou de classe pour des paramètres pouvant être regroupé logiquement.
- [event-listeners.ts] EventListeners est assez vague comme nom d'interface
- [rgba.ts] Les attributs ne sont pas regroupés logiquement


#### Tous les paramètres de fonction sont utilisés
- [rectangle.service.ts] Beaucoup de paramètres non utilisés
- [color-picker.component.ts] `primary` pas utilisé dans colorPicker()


## Variables

#### L'utilisation d'une variable locale (let ou const) doit être justifiée par son utilisation.
- [line.service.ts] L153, L157


#### Les variables et les constantes ont des noms explicites et sont uniformes dans tous les fichiers. Le format à utiliser pour les variables est le camelCase et pour les constantes est SCREAMING_SNAKE_CASE. La troncation des noms ne doit pas être excessive. (ex: utiliser background au lieu de seulement bg)
- [type-style.ts-colorOrder.ts-constants.ts] nomage de enum

## Gestion de Version

#### Chaque commit concerne une seule "issue" et les messages sont pertinents et suffisamment descriptifs pour chaque commit
- "temp"

#### Bonne utilisation de Gitlab : des Merge Requests sont utilisées pour fusionner vers la branche de production, des politiques de branches sont mises en place, des commentaires sont ajoutés sur les Merge Requests pour documenter les demandes de changement lors du feedback, les Merge Requests sont approuvé par au moins un membre de l'équipe avant la fusion les issues sont mises à jour, etc.
- les issues de sprint 1 ne sont pas fermés

#### Le repo git ne contient que les fichiers nécessaires. (pas de dossier node_modules ou coverage. Les fichiers package-lock.json et package.json ne se retrouvent que les dossiers client et server)
- Package.json au root

## Qualité générale

- L39: `pencil-service.ts` devrait être `pencil.service.ts`
- L41: Avoir une logique pour organiser les méthodes dans une classe (public d'abord et protected puis private en bas par exemple)
- L42: Uniformisez la langue utilisée pour les commentaires
- L43: Code/tests commenté
- L48: Pas utilisé
