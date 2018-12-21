

//Lorsque l'on supprime un caractere, il faut outrepasser les interdictions d'écrire un caractere tout en récuperant tout de même les nouvelles interdictions.

Ecrire("--------------- DEBOGUAGE ---------------");

// Variables initiales.
var ligne = "";
var nombreBinaire = false;
var resultatAffiche = false;
var nbVirgule = false; // Variable explicitant si le nombre actuellement saisi est un nombre à virgule afin d'empêcher de saisir plusieurs virgules dans un meme nombre (3.12.25)
var compteurNbVirgule = 0;
var div0 = false; // variable explicitant la présence d'une division par 0. 
var Xrect = [570, 650, 330, 410, 490, 570, 650, 330, 410, 490, 570, 650, 330, 410, 490, 570, 650, 330, 410, 490, 570, 650, 330, 410, 490, 570, 650, 330, 410]; // Coordonnées en X de l'angle supérieur gauche de chaque touche.
var Yrect = [350, 350, 400, 400, 400, 400, 400, 450, 450, 450, 450, 450, 500, 500, 500, 500, 500, 550, 550, 550, 550, 550, 600, 600, 600, 600, 600, 250, 250]; // Coordonnées en Y de l'angle supérieur gauche de chaque touche.
var touche = ["^", "3.14", "cos", "sin", "tan", "ln", "log", "1", "2", "3", "s", "", "4", "5", "6", "*", "/", "7", "8", "9", "+", "-", "0", ".", "(", ")", "=", "", ""]; // Valeurs de chaque touche.
var verif = ["puissance", "nbSpecial", "nbSpecial", "nbSpecial", "nbSpecial", "nbSpecial", "nbSpecial", "nombre", "nombre", "nombre", "suppr", "dflt", "nombre", "nombre", "nombre", "operateur", "operateur", "nombre", "nombre", "nombre", "operateur", "moins", "nombre", "virgule", "parOuverte", "parFermee", "egal"]; // Type de chaque touche.
initialiserGraph(); // Initialisation de l'affichage graphique (dessin de la calculatrice etc.)
/* 
isAllowed est un objet ayant plusieurs propriétés booléennes. Cela sert à expliciter quelles touches peuvent être enfoncées. A chaque fois que l'on appuie sur une touche
on vérifie si la touche est autorisée (isAllowed.touche) et si oui alors on ajoute le caractère de cette touche à la ligne de calcul. Ensuite, on modifie les différentes 
autorisations pour avoir une ligne cohérente (après avoir appuyé sur "." on ne peut pas réappuyer.
*/

var isAllowed = {
  parOuverte: true,
  parFermee: false,
  nombre: true,
  // Les fonctions trigonométriques, logarithmique, et le nombre PI sont considérés comme des nombres spéciaux car lorsqu'ils sont affichés, ils ont une virgule.
  nbSpecial: true,
  virgule: false,
  operateur: false,
  // Concerne seulement les opérateurs suivants : * / +
  egal: false,
  // Note : ecrire un égal en premier ne serait pas dérangeant
  moins: true,
  // Le moins est dissocié des autres opérateurs car on peut taper deux moins d'affilé mais pas deux fois, deux plus, ou deux div. On le traitera donc de façon différente.
  suppr: true,
  // Nous sommes toujours autorisé à utiliser le bouton supprimer.
  puissance: false,
  dflt: true
};

function afficher(chaine) { // Fonction gérant l'affichage de la ligne de calcul en train d'être saisie (ligne du haut)
  var depassement, tmp8, codeTmp8, doKeyPressed = true;
  if (Longueur(chaine) <= 2 && CaractereEn(chaine, Longueur(chaine) - 1) == "s") codeTmp8 = 5588; // Si l'on supprime le dernier caractère de la chaine, on remet les valeurs de l'objet isAllowed à leurs valeurs par défaut.
  if (CaractereEn(chaine, Longueur(chaine) - 1) == "s" && CaractereEn(chaine, Longueur(chaine) - 2) == ".") nbVirgule = false; // Si l'on supprime une virgule, on dit que le nombre n'est plus un nombre à virgule.
  RectanglePlein(321, 71, 408, 148, 'white');
  if (Longueur(chaine) > 42) { // Si la chaine fait plus de 42 caractères (ce qui correspond en moyenne à la largeur de l'écran) alors on sait qu'elle dépasse.
    depassement = true;
  } else {
    depassement = false;
  }

  var z = 3;

  if (CaractereEn(chaine, Longueur(chaine) - 1) == "s") { // Vrai si l'on supprime un caractère
    var m = Longueur(chaine) - 3; // index par défaut caractère précédent le caractère que l'on souhaite supprimer.
    if (CaractereEn(chaine, Longueur(chaine) - 2) == "]") { // Vrai si l'on supprime un crochet fermé (la puissance).
      var nbSuppCrochetOuvert = 0;
      var nbSuppCrochetFerme = -1;
      var i = Longueur(chaine) - 2;
      while (CaractereEn(chaine, i) != "^" || nbSuppCrochetOuvert != nbSuppCrochetFerme) { // On cherche l'accent circonflexe débutant la puissance. On compte le nombre de crochets dans le cas ou il y ai également une (ou plusieurs) puissance(s) dans cette puissance.
        if (CaractereEn(chaine, i) == "]") {
          if (nbSuppCrochetFerme == -1) nbSuppCrochetFerme = 1;
          else nbSuppCrochetFerme++;
        } else if (CaractereEn(chaine, i) == "[") {
          nbSuppCrochetOuvert++;
        }
        i--;
      }
      z = Longueur(chaine) - i + 1;
      m = i - 1; // modification de l'index du caratère précédent l'accent circonflexe.
    }
    tmp8 = CaractereEn(chaine, m); // Récupération du caractère précédent le caractère que l'on souhaite supprimer.
    switch (tmp8) { // On récupère le code ASCII du caractère précédent le caractère que l'on souhaite supprimer.
    case "+":
      codeTmp8 = 107;
      break;
    case "-":
      codeTmp8 = 109;
      break;
    case "/":
      codeTmp8 = 111;
      break;
    case "*":
      codeTmp8 = 106;
      break;
    case "(":
      codeTmp8 = 53;
      break;
    case ")":
      codeTmp8 = 219;
      break;
    case ".":
      codeTmp8 = 110;
      break;
    case "":
      codeTmp8 = 5588;
      break;
    }
    if (tmp8 >= 0 && tmp8 <= 9 && codeTmp8 != 5588) {
      codeTmp8 = enEntier(tmp8) + 96;
    }

    chaine = SousChaine(chaine, 0, Longueur(chaine) - z); // On supprime les caractères à supprimer ainsi que le caractère précédent (on le rajoutera après).
    ligne = SousChaine(ligne, 0, Longueur(ligne) - z);
    if (depassement) { // Si la chaine dépasse de l'écran, alors on affiche que les 42 premiers caractères, ce qui permet de la garder à l'intérieur.
      Texte(340, 100, SousChaine(chaine, Longueur(chaine) - 42, Longueur(chaine)), "black");
    } else {
      Texte(340, 100, chaine, "black");
    }
    if (doKeyPressed) Keypressed(codeTmp8, true); // Ici, on rajoute le caractère précédent le caractère que l'on souhaitait supprimer. Le but est ainsi de mettre les autorisations du isAllowed et que la ligne soit toujours cohérente.
  } else {
    if (depassement) {
      Texte(340, 100, SousChaine(chaine, Longueur(chaine) - 42, Longueur(chaine)), "black");
    } else {
      Texte(340, 100, chaine, "black");
    }
  }


  if (CaractereEn(chaine, Longueur(chaine) - 1) == "=") { // Si le dernier caractère est un égal, on calcul la ligne.
    chaine = SousChaine(chaine, 0, Longueur(chaine) - 1);
    calculer("(" + chaine + ")");
  }
}

function Keypressed(c, sup) { // En cas de suppression, il faut outrepasser les isAllowed pour forcer l'écriture du caractère précédent et également récupérer les autorisations associées. C'est pourquoi on a une variable "sup".
  if (sup != true) sup = false; // Lors d'un simple appui sur une touche, sup est non défini, on le passe donc à la valeur booléen false.
  var caractere = "";
  if (resultatAffiche == true) { // Si on a déjà un résultat affiché, on remet tout à 0.
    RectanglePlein(400, 125, 325, 50, "white");
    ligne = "";
    resultatAffiche = false;
  }
  var char = "",
   depassement;
 /* 
 Récupération du caractère saisi en fonction de sa valuer ASCII. Ce ne sont pas les mêmes selon les différents systèmes d'exploitation, 
 c'est pourquoi certains caractères ont plusieurs codes associés. L'intérêt de limiter le catalogue de caractères est de contrôler ce qui est saisi.
*/
  switch (c) { 
  case 8:
    char = "s";
    caractere = "suppr";
    break;
  case 106:
    char = "*";
    caractere = "operateur";
    if (sup) isAllowed.operateur = true;
    break;
  case 107:
    char = "+";
    caractere = "operateur";
    if (sup) isAllowed.operateur = true;
    break;
  case 109:
    char = "-";
    caractere = "moins";
    if (sup) isAllowed.moins = true;
    break;
  case 111:
  case 58:
    char = "/";
    caractere = "operateur";
    if (sup) isAllowed.operateur = true;
    break;
  case 187:
  case 61:
    char = "=";
    caractere = "egal";
    break;
  case 53:
    char = "(";
    caractere = "parOuverte";
    if (sup) isAllowed.parOuverte = true;
    break;
  case 219:
  case 169:
    char = ")";
    caractere = "parFermee";
    if (sup) isAllowed.parFermee = true;
    break;
  case 188:
  case 110:
    char = ".";
    caractere = "virgule";
    if (sup) isAllowed.virgule = true;
    break;
  case 5588:
    caractere = "dflt";
    char = "";
    break;
  default:
    char = "";
    caractere = "";
    break;
  }

  if (c >= 96 && c <= 105) { // 96 correspond à 0 et 105 correspond à 9 (en ASCII)
    char = c - 96;
    caractere = "nombre";
    if (sup) isAllowed.nombre = true;
  }

  if (caractere != "") {
    if (Allowed(caractere)) { // On appelle la fonction Allowed et on test si on a le droit de saisir ce caractère.
      ligne += char;
    }
  }

  afficher(ligne); // Instruction finale d'affichage de la ligne.
}

function calculer(ligne, afficher) {

  if (afficher != false) afficher = true;

  var calcul = enChaine(ligne);
  calcul = SousChaine(calcul, 1, Longueur(calcul) - 2) + " "; //ajout d'un espace afin de détecter la fin de la ligne à calculer.
  Ecrire(calcul);
  var op = []; // tableau regroupant les opérateurs, dans l'ordre d'apparition.
  var nb = []; // tableau regroupant les nombres,dans l'ordre d'apparition.
  var m = 0; // index des opérateurs.
  var nbParOuverte = -1;
  var nbParFermee = 0;

  var i = 0,
   db = 0;

  while (calcul.indexOf("^") != -1) {

    var nbParOuvertePuissance = 0;
    var nbParFermeePuissance = 0;
    var nbCrochetOuvert = 0;
    var nbCrochetFermee = 0;
    var exposantPuissance = "";
    var indexDbtPuissance;
    var indexFinPuissance;
    var charPuissance;

    var indexPuissance = calcul.indexOf("^") - 1;
    var nbPuissance = "";

    do {
      if (CaractereEn(calcul, indexPuissance) == "(") nbParOuvertePuissance++;
      if (CaractereEn(calcul, indexPuissance) == ")") nbParFermeePuissance++;
      nbPuissance = CaractereEn(calcul, indexPuissance) + nbPuissance;
      indexPuissance--;
    } while (nbParOuvertePuissance != nbParFermeePuissance);
    indexDbtPuissance = indexPuissance + 1;
    Ecrire(nbPuissance);


    indexPuissance = calcul.indexOf("^") + 1;
    do {
      charPuissance = CaractereEn(calcul, indexPuissance);
      if (charPuissance == "[") nbCrochetOuvert++;
      else if (charPuissance == "]") nbCrochetFermee++;
      exposantPuissance += charPuissance;
      indexPuissance++;
    } while (nbCrochetOuvert != nbCrochetFermee);

    indexFinPuissance = indexPuissance;
    Ecrire(exposantPuissance);
    Ecrire(indexDbtPuissance + " " + indexFinPuissance);

    calcul = SousChaine(calcul, 0, indexDbtPuissance) + enChaine(Math.pow(calculer(nbPuissance), calculer(exposantPuissance))) + SousChaine(calcul, indexFinPuissance, Longueur(calcul) - indexFinPuissance) + " ";
    Ecrire("calc : " + calcul);

  }

  //ETALONNAGE DES OPERATEURS
  while (i < Longueur(calcul)) {
    var charPrecedent = "";
    if (i > 0) charPrecedent = CaractereEn(calcul, i - 1);
    var char = CaractereEn(calcul, i);
    switch (char) {
    case "*":
      op[m] = "*";
      m++;
      break;
    case "+":
      if (charPrecedent != "e") { // Sinon, il prend les grands nombres comme 3.2e+165 comme une addition.
        op[m] = "+";
        m++;
      }
      break;
    case "-":
      if (charPrecedent != op[m - 1] && charPrecedent != "e") {
        op[m] = "-";
        m++;
      }
      break;
    case "/":
      op[m] = "/";
      m++;
      break;
    case "(":
      var z = 0;
      do {
        var newChar = CaractereEn(calcul, i);
        if (newChar == "(") {
          if (nbParOuverte == -1) {
            nbParOuverte = 1;
          } else {
            nbParOuverte++;
          }
        } else if (newChar == ")") {
          nbParFermee++;
        }
        i++;
      } while (nbParOuverte != nbParFermee);
      i--;
      break;
    default:
      break;
    }
    i++;
  }

  //CALCUL
  var resultat = 0;

  while (nbParOuverte > 0) {
    var parenthese = "",
     indexParOuverte = -1,
     indexParFermee = -1,
     TMPnbPar = 0,
     i = 0,
     parOuverteFound = false,
     parFermeeFound = false;

    while (i < Longueur(calcul) && !parOuverteFound) { // Recuperation de l'index de la parenthèse ouvrante à effectuer
      char = CaractereEn(calcul, i);
      if (char == "(") TMPnbPar++;
      if (TMPnbPar == nbParOuverte) {
        indexParOuverte = i;
        parOuverteFound = true;
      }
      i++;
    }

    i = indexParOuverte;

    while (i < Longueur(calcul) && !parFermeeFound) { // Recuperation de l'index de la parenthèse fermante à effectuer
      char = CaractereEn(calcul, i);
      if (char == ")") {
        indexParFermee = i;
        parFermeeFound = true;
      }
      i++;
    }


    for (i = indexParOuverte; i <= indexParFermee; i++) {
      char = CaractereEn(calcul, i);
      parenthese += char;
    }
    Ecrire(parenthese);

    calcul = SousChaine(calcul, 0, indexParOuverte) + calculer(parenthese) + SousChaine(calcul, indexParFermee + 1, Longueur(calcul) - indexParFermee);
    Ecrire(calcul);

    nbParOuverte--;


  }

  //ETALONNAGE DES NOMBRES
  var nombre = "",
   index = 0; //nombre et index des nombres.
  i = 0;
  while (i < Longueur(calcul)) {
    var char = CaractereEn(calcul, i);
    if (char != "(") {
      if (char != op[index]) {
        nombre += char;
      } else {
        if (CaractereEn(nombre, 0) != "(") nb[index] = enEntier(nombre);
        else nb[index] = enChaine(nombre);
        index++;
        nombre = "";
      }
    } else {
      nbParFermee = 0;
      while (nbParOuverte != nbParFermee) {
        if (char == ")") nbParFermee++;

        nombre += char;
        i++;
        char = CaractereEn(calcul, i);

      }
      //i++;
      nb[index] = enChaine(nombre);
      index++;
      nombre = "";
    }
    if (Taille(nb) == Taille(op)) {
      var charSuivant = CaractereEn(calcul, i + 1);
      if (charSuivant != "(") {
        var n = i + 1;
        while (char != " ") {
          char = CaractereEn(calcul, n);
          nombre += char;
          n++;


        }
      }
      if (CaractereEn(nombre, 0) != "(") nb[index] = enEntier(nombre);
      else nb[index] = enChaine(nombre);

    }
    i++;

  }
  AfficherTableau(nb);
  AfficherTableau(op);




/*
  Aller chercher la parenthèse ouverte la plus élevée, stocker son indice dans la chaine, mettre tous les caractères dans une nouvelle chaine jusqu'à ce que l'on rencontre une parenthèse fermée (à inclure)
  Stocker également l'indice de la parenthèse fermée
  La chaine nb[i] prend ce qu'il y a avait avant l'index de la parenthèse ouverte, remplace de la par ouverte à la par fermée par calcul(nvChaine) et ajoute ce qu'il y avait après la par fermée.
  
 */



  //PRIORITE
  while (op.indexOf("*") != -1 || op.indexOf("/") != -1 || op.indexOf("-") != -1) {
    var i = 0;
    var recommencer = false;
    while (i < Taille(op) && recommencer == false) {
      if (op[i] == "*") {
        nb[i] = nb[i] * nb[i + 1];
        op[i] = "+";
        for (var n = i; n < Taille(op); n++) {
          op[n] = op[n + 1];
        }
        op[Taille(op) - 1] = " ";
        for (var n = i + 1; n < Taille(nb); n++) {
          nb[n] = nb[n + 1];
        }
        nb[Taille(nb) - 1] = 0;
        recommencer = true;

      } else if (op[i] == "/") {
        if (nb[i + 1] == "0") {
          Ecrire("Erreur. Division par 0");
          div0 = true;
        }

        nb[i] = nb[i] / nb[i + 1];
        op[i] = "+";
        for (var n = i; n < Taille(op); n++) {
          op[n] = op[n + 1];
        }
        for (var n = i + 1; n < Taille(nb); n++) {
          nb[n] = nb[n + 1];
        }
        nb[Taille(nb) - 1] = 0;
        recommencer = true;
      } else if (op[i] == "-") {
        op[i] = "+";
        nb[i + 1] = -nb[i + 1];
      }
      i++;
    }
  }
  //ADDITION FINALE
  for (var i = 0; i <= Taille(op); i++) {
    if (nb[i] != undefined) resultat = resultat + nb[i];
  }

  Ecrire("Résultat : " + resultat);
  Ecrire("");
  if (afficher) afficherResultat(resultat);
  return resultat;

}

function MouseClick(x, y) {
  if (resultatAffiche == true) { // De la même façon que dans la fonction Keypressed, si un resultat est affiché alors on remet toutes les lignes à 0 (calcul et résultat).
    RectanglePlein(400, 125, 325, 50, "white");
    ligne = "";
    resultatAffiche = false;
  }
  contours(x, y); // On noirci les contours de la touche séléctionnée (si on clique hors d'une touche alors rien ne se passe).
  var char = "";
  var caractere = "";

  for (var i = 0; i < Taille(Xrect); i++) {
    if (x >= Xrect[i] && x <= Xrect[i] + 60 && y >= Yrect[i] && y <= Yrect[i] + 35) { // Test pour savoir si le clic est sur l'une des touches.
      char = touche[i]; // caractère de la touche sélectionnée.
      caractere = verif[i]; // type du caractère de la touche sélectionnée.
    }
  }

  // Affichage d'un son lors d'une pression de touche, fonctionnalité trouvée sur le memento  
  for (var i = 0; i < Taille(Xrect); i++) {
    if (x >= Xrect[i] && x <= Xrect[i] + 60 && y >= Yrect[i] && y <= Yrect[i] + 35) {
      var data = [];
      for (var i = 0; i < 1500; i++) {
        data[i] = Math.sin(i * 0.37);
      }
      var LA = CreerSon16bits(data, 15000);
      LA.play();
    }
  }

  if (x >= 330 && x <= 390 && y >= 250 && y <= 285) { // Vrai si l'on clique sur la touche "DEC".
    enDecimal(ligne);
    return;
  }
  if (x >= 410 && x <= 470 && y >= 250 && y <= 285) { // Vrai si l'on clique sur la touche "BIN".
    enBinaire(ligne);
    return;
  }
  if (x >= 330 && x <= 390 && y >= 400 && y <= 435) {
    char = fcts("le cosinus");
  }
  if (x >= 410 && x <= 470 && y >= 400 && y <= 435) {
    char = fcts("le sinus");
  }
  if (x >= 490 && x <= 550 && y >= 400 && y <= 435) {
    char = fcts("la tangente");
  }
  if (x >= 570 && x <= 630 && y >= 400 && y <= 435) {
    char = fcts("le logarithme népérien");
  }
  if (x >= 650 && x <= 710 && y >= 400 && y <= 435) {
    char = fcts("le logarithme décimal");
  }
  if (x >= 570 && x <= 630 && y >= 350 && y <= 385) {
    char = "^[" + fcts("exposant") + "]";
    if (char == "^[]")
    {
      Ecrire("Exposant invalide.");
      char = "";
    }
    
  }


  if (caractere == "dflt") {
    ligne = "";
  }

  if (caractere != "" && char != "") {
    if (Allowed(caractere)) {
      ligne += char;
    }
  }
  afficher(ligne);
}

function initialiserGraph() {
  turtleEnabled = false;
  Initialiser(); // Initialise l'affichage graphique.
  MouseClick(0, 0); // Initialise les rectangles ainsi que les contours.
  // Rectangle externe et 3D de ce rectangle.
  Rectangle(300, 50, 450, 650, 'black');
  Ligne(300, 50, 310, 40, "grey");
  Ligne(750, 700, 760, 690, "grey");
  Ligne(750, 50, 760, 40, "grey");
  Ligne(310, 40, 760, 40, "grey");
  Ligne(760, 40, 760, 690, "grey");

  Rectangle(320, 70, 410, 150, 'black'); // Rectangle affichage
  setCanvasFont("helvetica", "12pt", "normal"); // Définition de la police.
  // Affichage des lettres.
  Texte(355, 475, '1', 'black');
  Texte(435, 475, '2', 'black');
  Texte(515, 475, '3', 'black');
  Texte(585, 475, 'DEL', 'black');
  Texte(665, 475, 'AC', 'red');
  Texte(355, 523, '4', 'black');
  Texte(435, 523, '5', 'black');
  Texte(515, 523, '6', 'black');
  Texte(595, 523, 'X', 'black');
  Texte(355, 575, '7', 'black');
  Texte(435, 575, '8', 'black');
  Texte(515, 575, '9', 'black');
  Texte(355, 625, '0', 'black');
  Texte(435, 625, '.', 'black');
  Texte(515, 622, '(', 'black');
  Texte(595, 575, '+', 'black');
  Texte(598, 622, ')', 'black');
  Texte(677, 523, '/', 'black');
  Texte(676, 575, '-', 'black');
  Texte(665, 625, 'EXE', 'black');
  Texte(347, 425, 'cos', 'black');
  Texte(430, 425, 'sin', 'black');
  Texte(508, 425, 'tan', 'black');
  Texte(592, 425, 'ln', 'black');
  Texte(668, 425, 'log', 'black');
  Texte(670, 375, "π", 'black');
  Texte(593, 375, "^", 'black');
  Texte(342, 273, "DEC", 'black');
  Texte(425, 273, "BIN", 'black');

}

function contours(x, y) {
  //Contour des touches du clavier 
  for (i = 0; i < Taille(Xrect); i++) {
    if (x >= Xrect[i] && x <= Xrect[i] + 60 && y >= Yrect[i] && y <= Yrect[i] + 35) { // On teste chaque touche pour savoir si on a cliqué dessus.
      ShadowOff();
      Rectangle(Xrect[i], Yrect[i], 60, 35, "black"); // On répète l'action plusieurs fois afin d'avoir une case très noircie.
      Rectangle(Xrect[i], Yrect[i], 60, 35, "black");
      Rectangle(Xrect[i], Yrect[i], 60, 35, "black");
      Rectangle(Xrect[i], Yrect[i], 60, 35, "black");
      Ligne(Xrect[i], Yrect[i], Xrect[i] + 5, Yrect[i] - 5, "black");
      Ligne(Xrect[i] + 60, Yrect[i], Xrect[i] + 65, Yrect[i] - 5, "black");
      Ligne(Xrect[i] + 60, Yrect[i] + 35, Xrect[i] + 65, Yrect[i] + 30, "black");
      Ligne(Xrect[i] + 5, Yrect[i] - 5, Xrect[i] + 65, Yrect[i] - 5, "black");
      Ligne(Xrect[i] + 65, Yrect[i] - 5, Xrect[i] + 65, Yrect[i] + 30, "black");
    } else { // Si la touche n'est pas enfoncé alors on définit les contours comme à l'initialisation.
      ShadowOff();
      Rectangle(Xrect[i], Yrect[i], 60, 35, "grey");
      Rectangle(Xrect[i], Yrect[i], 60, 35, "grey");
      Rectangle(Xrect[i], Yrect[i], 60, 35, "grey");
      Rectangle(Xrect[i], Yrect[i], 60, 35, "grey");
      Ligne(Xrect[i], Yrect[i], Xrect[i] + 5, Yrect[i] - 5, "grey");
      Ligne(Xrect[i] + 60, Yrect[i], Xrect[i] + 65, Yrect[i] - 5, "grey");
      Ligne(Xrect[i] + 60, Yrect[i] + 35, Xrect[i] + 65, Yrect[i] + 30, "grey");
      Ligne(Xrect[i] + 5, Yrect[i] - 5, Xrect[i] + 65, Yrect[i] - 5, "grey");
      Ligne(Xrect[i] + 65, Yrect[i] - 5, Xrect[i] + 65, Yrect[i] + 30, "grey");
    }
  }

}

function enDecimal(bin) { // Fonction qui converti un nombre binaire en décimal.
  if (!check("dec", bin)) { // On vérifie grâce à la fonction check définie plus bas si chaque caractère de la ligne est un 1 ou un 0.
    afficherResultat("ERR");
    return;
  }
  var binaire = bin;
  var decimal = 0;
  var char = "";
  var n;
  var taille = Longueur(binaire) - 1;

  for (n = 0; n <= taille; n++) { // On test chaque caractère, de droite à gauche. 
    char = CaractereEn(binaire, taille - n);
    if (char == "1") {
      decimal += Math.pow(2, n); // On ajoute à chaque "1", 2 à la puissance n.
    } else if (char != "0") { // Si le caractère n'est ni un 1 ni un 0 alors ce n'est pas un nombre binaire : erreur.
      afficherResultat("ERR");
      return;
    }
  }
  afficherResultat(decimal);
}


function afficherResultat(resultat) { // Fonction qui affiche le résultat (ligne au milieu à droite).
  if (nombreBinaire && Longueur(resultat) > 37) { // Pour les nombres binaires, il arrive qu'ils soient très longs, on l'empêche donc de dépasser de l'écran.
    Ecrire("Le nombre est trop long pour être affiché sur l'écran. Voici le résultat : " + resultat);
    resultat = "ERR";
  }
  if (nombreBinaire) nombreBinaire = false;
  if (div0) resultat = "ERR"; // Si l'on a divisé un nombre par 0, alors on affiche un message d'erreur.
  RectanglePlein(400, 125, 325, 50, "white");
  var posX = 710,
   resultatChaine = enChaine(resultat),
   resultatLongueur = Longueur(resultatChaine);
  for (var i = 1; i < resultatLongueur; i++) { // Un caractère fait environ 10 pixels, on décale l'affichage du résultat à gauche de 10 pixels à chaque caractère du résultat afin que le dernier caractère soit toujours aux mêmes coordonées (le résultat ne sort pas de l'écran).
    posX -= 10;
  }
  resultatAffiche = true;
  Texte(posX, 150, resultat, "black");
  resultat = 0;
}

function enBinaire(dec) { // Fonction qui converti un nombre décimal en binaire.
  if (!check("bin", dec)) { // On vérifie qu'il n'y ai que des nombres entiers compris entre 0 et 9.
    afficherResultat("ERR");
    return;
  }
  nombreBinaire = true;
  var decimal = dec;
  var binaire = "";
  var reste;
  while (decimal != 0) { 
    reste = decimal % 2;
    decimal = (decimal - reste) / 2;
    binaire = enChaine(reste) + binaire;
  }
  afficherResultat(binaire);
}

function Allowed(caractere) { // Pour chaque caractère que l'on veut saisir, on vérifie si l'on "a le droit" de le saisir, afin d'empêcher l'utilisateur de taper une ligne de calcul incohérente.
  var nbParOuverteAllowed = 0;
  var nbParFermeeAllowed = 0;
  for (var z = 0; z < Longueur(ligne); z++) {
    var char = CaractereEn(ligne, z);
    if (char == "(") nbParOuverteAllowed++;
    else if (char == ")") nbParFermeeAllowed++;
  }
  if (nbParOuverteAllowed == nbParFermeeAllowed) isAllowed.egal = true; 
  else isAllowed.egal = false; // Si l'on tente de calculer une ligne avec un nombre différent de parenthèses, alors on obtient une boucle infinie.
  if (isAllowed[caractere]) {
    switch (caractere) {
    case "parOuverte":
    case "operateur":
      isAllowed.parOuverte = true;
      isAllowed.parFermee = false;
      isAllowed.nombre = true;
      isAllowed.virgule = false;
      isAllowed.operateur = false;
      isAllowed.egal = false;
      isAllowed.moins = true;
      isAllowed.nbSpecial = true;
      isAllowed.nbVirgule = true;
      isAllowed.puissance = false;
      if (nbVirgule) nbVirgule = !nbVirgule;
      break;
    case "parFermee":
      isAllowed.parOuverte = false;
      isAllowed.parFermee = true;
      isAllowed.nombre = false;
      isAllowed.virgule = false;
      isAllowed.operateur = true;
      isAllowed.moins = true;
      isAllowed.nbSpecial = false;
      isAllowed.puissance = true;
      // isAllowed.egal dépend ici du nombre de parenthèses ouvertes et fermées, condition testée auparavant.
      break;
    case "nombre":
      isAllowed.parOuverte = false;
      isAllowed.parFermee = true;
      isAllowed.nombre = true;
      isAllowed.nbSpecial = true;
      isAllowed.virgule = true;
      isAllowed.operateur = true;
      isAllowed.moins = true;
      isAllowed.puissance = false;
      if (nbVirgule) {
        isAllowed.virgule = false;
        isAllowed.nbSpecial = false;
      }
      break;
    case "virgule":
      isAllowed.parOuverte = false;
      isAllowed.parFermee = false;
      isAllowed.nombre = true;
      isAllowed.nbSpecial = false;
      isAllowed.virgule = false;
      isAllowed.operateur = false;
      isAllowed.egal = false;
      isAllowed.moins = false;
      isAllowed.puissance = false;
      nbVirgule = true;
      break;
    case "moins":
      isAllowed.parOuverte = true;
      isAllowed.parFermee = false;
      isAllowed.nombre = true;
      isAllowed.virgule = false;
      isAllowed.operateur = false;
      isAllowed.egal = false;
      isAllowed.puissance = false;
      isAllowed.egal = false;
      if (nbVirgule) nbVirgule = !nbVirgule;
      if (CaractereEn(ligne, Longueur(ligne) - 1) == "-") isAllowed.moins = false; // On peut seulement saisir 2 moins d'affilé.
      else isAllowed.moins = true;
      break;
    case "puissance":
      isAllowed.parOuverte = false;
      isAllowed.parFermee = true;
      isAllowed.nombre = false;
      isAllowed.virgule = false;
      isAllowed.operateur = true;
      isAllowed.puissance = false;
      isAllowed.moins = true;
      break;
    case "nbSpecial": // Les nombres spéciaux correspondent aux nombres qui sont saisis directement avec une virgule (trigonomètriques, PI, log).
      nbVirgule = true;
      isAllowed.parOuverte = true;
      isAllowed.parFermee = true;
      isAllowed.nombre = true;
      isAllowed.virgule = false;
      isAllowed.operateur = true;
      isAllowed.moins = true;
      isAllowed.puissance = false;
      isAllowed.nbSpecial = false;
      break;
    case "dflt":
    case "egal": // Lors d'un appui sur "=", on remet les autorisations à 0, c'est pourquoi égal et dflt (default) ont la même action.
      isAllowed.parOuverte = true;
      isAllowed.parFermee = false;
      isAllowed.nombre = true;
      isAllowed.nbSpecial = true;
      isAllowed.virgule = false;
      isAllowed.operateur = false;
      isAllowed.egal = false;
      isAllowed.moins = true;
      isAllowed.suppr = true;
      isAllowed.puissance = false;
      nbVirgule = false;
      div0 = false;
      break;

    }

    return true;
  } else
  return false;
}

function fcts(fct) { // Pour calculer les valeurs des cosinus / sinus / tan / log / ln
  var precision, valeur, valReturn = "NaN";

  if (fct == "la tangente" || fct == "le cosinus" || fct == "le sinus") precision = ", en radians.";
  else precision = ".";

  if (fct != "exposant") {
    valeur = Saisie("Entrez la valeur dont vous voulez obtenir " + fct + precision);
  } else {
    valeur = Saisie("Entrez la valeur de l'exposant.");
  }
  switch (fct) {
  case "le cosinus":
    if (check("fct", valeur)) {
      valReturn = enEntier(precise(Math.cos(calculer("(" + valeur + ")", false)), 3));
    } else {
      return "";
    }
    break;
  case "le sinus":
    if (check("fct", valeur)) {
      valReturn = enEntier(precise(Math.sin(calculer("(" + valeur + ")", false)), 3));
    } else {
      return "";
    }
    break;
  case "la tangente":
    if (check("fct", valeur)) {
      valReturn = enEntier(precise(Math.tan(calculer("(" + valeur + ")", false)), 3));
    } else {
      return "";
    }
    break;
  case "le logarithme népérien":
    if (check("fct", valeur)) {
      valReturn = enEntier(precise(Math.log(calculer("(" + valeur + ")", false)), 3));
    } else {
      return "";
    }
    break;
  case "le logarithme décimal":
    if (check("fct", valeur)) {
      valReturn = enEntier(precise(Math.log10(calculer("(" + valeur + ")", false)), 3));
    } else {
      return "";
    }
    break;
  case "exposant":
    if (check("fct", valeur)) {
      valReturn =  enEntier(calculer("(" + valeur + ")", false));
      Ecrire(valReturn);
    } else {
    return "";
    }

  }
  valReturn = enChaine(valReturn);
  if (valReturn == "NaN") {
    Ecrire("");
    return "";
  } else if (fct != "exposant") {
    return enEntier(valReturn);
  } else {
    return valeur;
  }
}

function precise(x, p) { // Permet de fixer le nombre de chiffres après la virugle (fonction trouvée sur Internet)
  return Number.parseFloat(x).toPrecision(p);
}

function check(type, ligneVerif) {
  var compteur = 0;
  var char;
  var checked = true;
  switch (type) {
  case "fct":
    var nbParOuverteCheck = 0;
    var nbParFermeeCheck = 0;
    var nbCrochetOuvertCheck = 0;
    var nbCrochetFermeeCheck = 0;
    while (compteur < Longueur(ligneVerif) && checked) {
      char = CaractereEn(ligneVerif, compteur);
      if (char < 0 && char > 9 && char != "(" && char != ")" && char != "+" && char != "-" && char != "*" && char != "/" && char != "^" && char != "[" && char != "]") checked = false; // On vérifie que tous les caractères saisis peuvent être traités par le programme (éviter les lettres par exemple).
      if (char == "(") nbParOuverteCheck++;
      if (char == ")") nbParFermeeCheck++;
      if (char == "]") nbCrochetFermeeCheck++;
      if (char == "[") nbCrochetOuvertCheck++;
      compteur++;
    }
    if (nbParOuverteCheck != nbParFermeeCheck || nbCrochetOuvertCheck != nbCrochetFermeeCheck) { // De la même façon qu'avec les parenthèses, si le nombre de crochets ouverts et fermés est différents, alors on obtient une boucle infini.
      checked = false;
    }
    break;
  case "dec": // si l'on souhaite convertir un nombre binaire en décimal, on vérifie qu'il n'ai que des 1 et des 0.
    while (compteur < Longueur(ligneVerif) && checked) {
      char = CaractereEn(ligneVerif, compteur);
      if (Caractere_vers_Ascii(char) - Caractere_vers_Ascii("0") < 0 || Caractere_vers_Ascii(char) - Caractere_vers_Ascii("0") > 1) checked = false;
      compteur++;
    }
    break;
  case "bin": // si l'on souhaite convertir un nombre décimal en binaire, on vérifie qu'il n'ai que des chiffres compris entre 0 et 9 (inclus).
    while (compteur < Longueur(ligneVerif) && checked) {
      char = CaractereEn(ligneVerif, compteur);
      if (Caractere_vers_Ascii(char) - Caractere_vers_Ascii("0") < 0 || Caractere_vers_Ascii(char) - Caractere_vers_Ascii("0") > 9) checked = false;
      compteur++;
    }
    break;


  }
  return checked; // Si l'on retourne true, alors la chaine saisie peut être incorporée dans la ligne de calcul, sinon on ne change rien.
}