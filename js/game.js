
// ===== IMAGE PRELOADER =====
const SPRITE_CACHE = {};
function preloadSprites() {
  Object.entries(SPRITES).forEach(([key, path]) => {
    const img = new Image();
    img.src = path;
    SPRITE_CACHE[key] = img;
  });
}

// ===== ANIMATION HELPERS =====
function animateElement(el, animClass, duration) {
  if (!el) return;
  el.classList.add(animClass);
  setTimeout(() => el.classList.remove(animClass), duration || 500);
}

function showFloatingDmg(parentEl, text, type) {
  if (!parentEl) return;
  const el = document.createElement('div');
  el.className = 'dmg-float ' + (type || '');
  el.textContent = text;
  parentEl.style.position = 'relative';
  el.style.left = (30 + Math.random() * 50) + 'px';
  el.style.top = '10px';
  parentEl.appendChild(el);
  setTimeout(() => el.remove(), 1000);
}

// ===== DONNÉES =====
const LIEUX = [
  // 0
  { nom:"Caravane (Base)",   danger:0, ressources:["eau","nourriture","eau","bois","nourriture"],
    desc:"Ta base. Securisee et calme." },
  // 1
  { nom:"Foret",             danger:1, ressources:["bois","eau","nourriture","bois","nourriture","herbe","champignon"],
    desc:"Calme. Des rodeurs la nuit." },
  // 2
  { nom:"Lac",               danger:1, ressources:["eau","poisson","eau","poisson","pierre","herbe"],
    desc:"Eau en abondance. Quelques predateurs." },
  // 3
  { nom:"Marche noir",       danger:1, ressources:["capsules","capsules","vetement","nourriture","medicament"],
    desc:"Marche clandestin. Des marchands douteux.", marchand:true },
  // 4
  { nom:"Village abandonne", danger:2, ressources:["nourriture","vetement","medicament","metal","eau","cle","nourriture"],
    desc:"Village pille. Survivants hostiles." },
  // 5
  { nom:"Ferme isolee",      danger:2, ressources:["nourriture","nourriture","eau","bois","cuir","graine","nourriture"],
    desc:"Ferme desertee. Animaux sauvages." },
  // 6
  { nom:"Entrepot",          danger:2, ressources:["metal","bois","carburant","metal","corde","plastique","metal"],
    desc:"Grand entrepot industriel. Materiel abondant." },
  // 7
  { nom:"Station essence",   danger:2, ressources:["metal","carburant","metal","carburant","bois","plastique","metal"],
    desc:"Partiellement pillee." },
  // 8
  { nom:"Mine abandonnee",   danger:3, ressources:["metal","metal","charbon","pierre","metal","cristal","metal"],
    desc:"Mine souterraine. Riche en minerai, infestee." },
  // 9
  { nom:"Laboratoire",       danger:3, ressources:["medicament","serum","produit_chimique","bandage","serum","metal"],
    desc:"Labo pharmaceutique. Serums experimentaux." },
  // 10
  { nom:"Prison",            danger:3, ressources:["metal","arme","capsules","vetement","nourriture","arme"],
    desc:"Ancienne prison. Les detenus ont pris le controle." },
  // 11
  { nom:"Ville en ruine",    danger:3, ressources:["metal","medicament","arme","metal","cuir","capsules","plastique","metal"],
    desc:"Batiments effondres. Zombies partout." },
  // 12
  { nom:"Centrale nucleaire",danger:4, ressources:["metal","cristal","produit_chimique","serum","metal","capsules"],
    desc:"Zone irradiee. Mutants ultra-dangereux." },
  // 13
  { nom:"Hopital",           danger:4, ressources:["medicament","bandage","medicament","serum","bandage","metal","medicament"],
    desc:"Infeste. Plein de medicaments." },
  // 14
  { nom:"Camp militaire",    danger:4, ressources:["arme","arme","metal","metal","capsules","serum","arme_lourde","munitions"],
    desc:"Ancien camp de l'armee. Armes lourdes et soldats zombies." },
  // 15
  { nom:"Metro souterrain",  danger:3, ressources:["metal","capsules","vetement","cle","plastique","nourriture","arme","cristal"],
    desc:"Tunnels sombres. Gangs et mutants aveugles s'y terrent." },
];

// Ennemis generiques fallback
const ENNEMIS = ["Zombie errant","Zombie enrage","Zombie mutant","Pillard","Rodeur","Mercenaire","Loup"];

const ENNEMIS_LIEUX = {
  0: [],
  1: [ // Foret
    {nom:"Lapin",            niv:1, vie:8,   att:2,  def:0, xp:5,  butin:["nourriture","nourriture"]},
    {nom:"Renard",           niv:1, vie:12,  att:4,  def:1, xp:8,  butin:["nourriture","cuir"]},
    {nom:"Cerf",             niv:2, vie:25,  att:5,  def:1, xp:15, butin:["nourriture","cuir"]},
    {nom:"Sanglier",         niv:2, vie:30,  att:8,  def:2, xp:20, butin:["nourriture","nourriture","cuir","cuir"]},
    {nom:"Loup",             niv:3, vie:35,  att:12, def:2, xp:25, butin:["cuir","cuir","nourriture"]},
    {nom:"Ours",             niv:4, vie:80,  att:18, def:5, xp:55, butin:["nourriture","nourriture","cuir","cuir","cuir"]},
    {nom:"Zombie errant",    niv:1, vie:20,  att:6,  def:1, xp:12, butin:["bandage","vetement"]},
    {nom:"Rodeur",           niv:2, vie:28,  att:9,  def:2, xp:18, butin:["metal","nourriture"]},
    {nom:"Bandit de foret",  niv:3, vie:38,  att:11, def:3, xp:28, butin:["capsules","nourriture"]},
  ],
  2: [ // Lac
    {nom:"Grenouille mutante",niv:1,vie:10,  att:3,  def:0, xp:6,  butin:["nourriture"]},
    {nom:"Zombie aquatique", niv:2, vie:22,  att:7,  def:1, xp:14, butin:["bandage"]},
    {nom:"Crocodile mutant", niv:3, vie:55,  att:14, def:6, xp:40, butin:["cuir","cuir","nourriture"]},
    {nom:"Bandit pecheur",   niv:2, vie:30,  att:9,  def:2, xp:18, butin:["poisson","capsules"]},
    {nom:"Piranhas mutants", niv:2, vie:18,  att:11, def:0, xp:15, butin:["nourriture"]},
  ],
  3: [ // Marche noir
    {nom:"Voleur",           niv:2, vie:25,  att:10, def:2, xp:20, butin:["capsules","capsules"]},
    {nom:"Garde du corps",   niv:3, vie:45,  att:13, def:5, xp:32, butin:["arme","capsules"]},
    {nom:"Pillard opportuniste",niv:2,vie:30,att:11, def:3, xp:22, butin:["capsules","nourriture"]},
  ],
  4: [ // Village
    {nom:"Zombie errant",    niv:2, vie:25,  att:8,  def:1, xp:15, butin:["vetement"]},
    {nom:"Zombie enrage",    niv:3, vie:35,  att:14, def:2, xp:28, butin:["medicament"]},
    {nom:"Chien errant",     niv:2, vie:22,  att:10, def:1, xp:16, butin:["nourriture","cuir"]},
    {nom:"Pillard",          niv:3, vie:40,  att:12, def:4, xp:30, butin:["nourriture","capsules"]},
    {nom:"Survivant hostile",niv:2, vie:32,  att:11, def:3, xp:22, butin:["vetement","nourriture"]},
    {nom:"Zombie enfant",    niv:1, vie:15,  att:8,  def:0, xp:10, butin:["vetement"]},
  ],
  5: [ // Ferme
    {nom:"Cochon mutant",    niv:2, vie:28,  att:9,  def:2, xp:18, butin:["nourriture","nourriture"]},
    {nom:"Vache zombie",     niv:2, vie:35,  att:7,  def:3, xp:20, butin:["nourriture","cuir"]},
    {nom:"Zombie fermier",   niv:2, vie:25,  att:9,  def:1, xp:15, butin:["bois","nourriture"]},
    {nom:"Chien errant",     niv:2, vie:22,  att:10, def:1, xp:16, butin:["nourriture"]},
    {nom:"Ours affame",      niv:4, vie:70,  att:16, def:4, xp:48, butin:["cuir","cuir","nourriture"]},
    {nom:"Poulet mutant",    niv:1, vie:8,   att:4,  def:0, xp:6,  butin:["nourriture"]},
  ],
  6: [ // Entrepot
    {nom:"Zombie ouvrier",   niv:2, vie:30,  att:10, def:2, xp:18, butin:["metal","bois"]},
    {nom:"Pillard",          niv:3, vie:40,  att:12, def:4, xp:30, butin:["metal","capsules"]},
    {nom:"Chien de garde",   niv:3, vie:32,  att:14, def:2, xp:24, butin:["nourriture","cuir"]},
    {nom:"Mercenaire",       niv:4, vie:55,  att:16, def:6, xp:45, butin:["arme","capsules"]},
    {nom:"Rat geant",        niv:1, vie:10,  att:5,  def:0, xp:7,  butin:["nourriture"]},
  ],
  7: [ // Station
    {nom:"Pillard biker",    niv:3, vie:45,  att:13, def:5, xp:32, butin:["carburant","capsules"]},
    {nom:"Zombie mecano",    niv:2, vie:28,  att:9,  def:1, xp:15, butin:["metal","carburant"]},
    {nom:"Chien errant",     niv:2, vie:20,  att:11, def:1, xp:14, butin:["nourriture"]},
    {nom:"Gang de bikers",   niv:3, vie:50,  att:14, def:3, xp:38, butin:["carburant","capsules","metal"]},
    {nom:"Mercenaire",       niv:4, vie:55,  att:16, def:6, xp:45, butin:["arme","capsules"]},
  ],
  8: [ // Mine
    {nom:"Zombie mineur",    niv:3, vie:40,  att:12, def:3, xp:28, butin:["metal","charbon"]},
    {nom:"Rat geant",        niv:2, vie:15,  att:8,  def:0, xp:10, butin:["nourriture"]},
    {nom:"Chauve-souris mut.",niv:2,vie:18,  att:10, def:1, xp:12, butin:["cuir"]},
    {nom:"Golem de pierre",  niv:5, vie:90,  att:20, def:10,xp:75, butin:["metal","metal","cristal"]},
    {nom:"Mercenaire arme",  niv:4, vie:60,  att:17, def:6, xp:48, butin:["arme","metal"]},
    {nom:"Zombie colosse",   niv:4, vie:75,  att:15, def:5, xp:55, butin:["metal","metal","charbon"]},
  ],
  9: [ // Labo
    {nom:"Zombie chimiste",  niv:3, vie:38,  att:13, def:2, xp:30, butin:["produit_chimique","medicament"]},
    {nom:"Mutant de labo",   niv:5, vie:75,  att:22, def:5, xp:68, butin:["serum","medicament"]},
    {nom:"Robot de securite",niv:4, vie:65,  att:18, def:8, xp:55, butin:["metal","metal","cristal"]},
    {nom:"Zombie scientifique",niv:3,vie:35, att:10, def:2, xp:25, butin:["serum","produit_chimique"]},
    {nom:"Mutant araignee",  niv:4, vie:50,  att:16, def:3, xp:42, butin:["serum","cuir"]},
  ],
  10: [ // Prison
    {nom:"Prisonnier zombie",niv:3, vie:42,  att:13, def:3, xp:30, butin:["metal","vetement"]},
    {nom:"Gardien zombie",   niv:3, vie:50,  att:14, def:5, xp:35, butin:["arme","capsules"]},
    {nom:"Chef de gang",     niv:5, vie:85,  att:22, def:7, xp:72, butin:["arme","arme","capsules"]},
    {nom:"Prisonnier mutant",niv:4, vie:65,  att:18, def:4, xp:52, butin:["metal","nourriture"]},
    {nom:"Sniper embusque",  niv:4, vie:40,  att:25, def:3, xp:55, butin:["arme","capsules"]},
  ],
  11: [ // Ville
    {nom:"Zombie enrage",    niv:4, vie:50,  att:16, def:3, xp:40, butin:["metal","capsules"]},
    {nom:"Zombie mutant",    niv:5, vie:80,  att:20, def:6, xp:65, butin:["medicament","metal"]},
    {nom:"Pillard arme",     niv:4, vie:60,  att:18, def:7, xp:55, butin:["arme","capsules"]},
    {nom:"Mercenaire elite", niv:5, vie:70,  att:22, def:8, xp:70, butin:["capsules","arme"]},
    {nom:"Zombie colosse",   niv:5, vie:120, att:18, def:8, xp:80, butin:["metal","metal","cuir"]},
    {nom:"Sniper embusque",  niv:5, vie:45,  att:28, def:4, xp:65, butin:["arme","capsules","capsules"]},
    {nom:"Zombie berserker", niv:4, vie:55,  att:24, def:2, xp:50, butin:["metal","cuir"]},
  ],
  12: [ // Centrale
    {nom:"Zombie irradie",   niv:5, vie:85,  att:20, def:6, xp:70, butin:["produit_chimique","metal"]},
    {nom:"Mutant nucleaire", niv:6, vie:110, att:25, def:8, xp:90, butin:["cristal","serum"]},
    {nom:"Robot sentinelle", niv:5, vie:95,  att:22, def:10,xp:80, butin:["metal","metal","cristal"]},
    {nom:"Zombie colossale", niv:6, vie:140, att:22, def:10,xp:100,butin:["metal","cristal","serum"]},
    {nom:"Boss : Reactor",   niv:9, vie:300, att:45, def:20,xp:500,butin:["cristal","serum","arme","capsules"]},
  ],
  13: [ // Hopital
    {nom:"Zombie mutant",         niv:6, vie:100, att:25, def:8,  xp:90,  butin:["medicament","medicament"]},
    {nom:"Zombie docteur",        niv:5, vie:70,  att:18, def:5,  xp:65,  butin:["bandage","medicament"]},
    {nom:"Zombie infirmier",      niv:4, vie:55,  att:14, def:4,  xp:45,  butin:["medicament"]},
    {nom:"Zombie chirurgien",     niv:6, vie:80,  att:22, def:6,  xp:78,  butin:["serum","medicament"]},
    {nom:"Zombie colosse",        niv:5, vie:110, att:20, def:8,  xp:85,  butin:["metal","medicament"]},
    {nom:"Mini-Boss : Directeur", niv:7, vie:160, att:30, def:12, xp:180, butin:["serum","serum","armure_cuir"], miniBoss:true},
    {nom:"Boss : Patient Zero",   niv:9, vie:250, att:40, def:18, xp:400, butin:["arme","serum","serum","medicament"], boss:true},
  ],
  14: [ // Camp militaire
    {nom:"Soldat zombie",         niv:5, vie:80,  att:20, def:8,  xp:65,  butin:["metal","munitions"]},
    {nom:"Zombie tireur d'elite", niv:5, vie:55,  att:28, def:4,  xp:70,  butin:["arme","capsules"]},
    {nom:"Zombie blindé",         niv:6, vie:120, att:18, def:14, xp:88,  butin:["metal","armure_metal"]},
    {nom:"Mercenaire militaire",  niv:5, vie:90,  att:22, def:10, xp:78,  butin:["arme","capsules","metal"]},
    {nom:"Drone de combat",       niv:5, vie:70,  att:25, def:6,  xp:75,  butin:["metal","cristal"]},
    {nom:"Mini-Boss : Sergent",   niv:7, vie:180, att:32, def:14, xp:200, butin:["arme_lourde","armure_metal","capsules"], miniBoss:true},
    {nom:"Boss : Général Mort",   niv:9, vie:280, att:42, def:20, xp:450, butin:["arme_lourde","arme_lourde","serum","capsules"], boss:true},
  ],
  15: [ // Métro souterrain
    {nom:"Zombie aveugle",        niv:3, vie:45,  att:14, def:2,  xp:30,  butin:["vetement","metal"]},
    {nom:"Rat géant",             niv:2, vie:18,  att:10, def:0,  xp:12,  butin:["nourriture"]},
    {nom:"Mutant des tunnels",    niv:4, vie:65,  att:18, def:4,  xp:50,  butin:["cristal","metal"]},
    {nom:"Gang souterrain",       niv:4, vie:60,  att:16, def:5,  xp:48,  butin:["capsules","arme"]},
    {nom:"Golem ferraille",       niv:5, vie:100, att:20, def:12, xp:80,  butin:["metal","metal","plastique"]},
    {nom:"Zombie conducteur",     niv:3, vie:50,  att:13, def:3,  xp:35,  butin:["cle","metal"]},
    {nom:"Mini-Boss : Le Roi du Métro", niv:7, vie:170, att:28, def:10, xp:190, butin:["cristal","arme","capsules"], miniBoss:true},
  ],
};

// Mini-boss par lieu (ajout dans tous les lieux existants)
// Déjà intégrés directement dans ENNEMIS_LIEUX ci-dessus

// ===== JOUEUR =====
let J = {};
let combat = null;

function newJoueur(nom) {
  return {
    nom, niveau: 1, xp: 0, xpMax: 500,
    vie: 100, vieMax: 100,
    faim: 100, soif: 100, confort: 100,
    att: 10, def: 5, capsules: 50,
    // === STATS SECONDAIRES ===
    stats5: { force:1, agilite:1, endurance:1, intelligence:1, survie:1 },
    pointsStats: 3, // points à distribuer au level up
    mutations: [],  // mutations passives débloquées
    lieu: 0, inventaire: {},
    heure: 8, jour: 1,
    fileEnnemis: [],
    competences: [],
    bonusFouille: 0, bonusSoin: 0, bonusVoyage: 0, bonusCraft: 0,
    statuts: [],
    meteo: 'ensoleille',
    lieuxVisites: [0],
    journal: [],
    quetes: [],
    quetesTerminees: [],
    stockBase: {},
    // Équipement visible
    armeEquipee: null,    // nom de l'arme équipée
    armureEquipee: null,  // nom de l'armure équipée
    // Réputation
    reputation: 0,        // -100 (criminel) à +100 (héros)
    // Compagnon
    compagnon: null,      // { nom, vie, vieMax, att, def, loyaute }
    // Stats de jeu
    stats: { ennemisVaincus:0, lieuxVisites:0, objectsCraftes:0, joursVecus:0, ventesTotal:0, fouilles:0 },
    // Dernier lieu fouillé + durée mémorisée
    derniereFouilleDuree: null,
    // Nuit/Jour
    estNuit: false,
    base: {
      niveau: 1,
      population: 0,
      popMax: 0,
      defense: 5,
      feu: 1,
      cuisine: null,
      ferme: null,
      infirmerie: null,
      habitation: null,
      atelier: null,
      rempart: null,
      // Rôles des habitants
      chasseurs: 0,    // produisent nourriture/cuir
      fermiers: 0,     // produisent nourriture/eau
      forgerons: 0,    // produisent metal
      gardes: 0,       // augmentent defense
      // Dernier raid
      dernierRaid: 0,
    }
  };
}

// ===== START =====
function startGame() {
  const nom = document.getElementById('start-input').value.trim() || "Inconnu";
  J = newJoueur(nom);
  document.getElementById('start-screen').style.display = 'none';
  document.getElementById('nav').style.display = 'flex';
  document.getElementById('global-log-wrap').style.display = 'block';
  showTab('profil');
  log(`Bienvenue ${J.nom}. Survie commence maintenant.`, 'info');
  log(`Tu te trouves dans ta caravane. Explore le monde.`, 'info');
  initQuetes();
  changerMeteo();
  updateUI();
  sauvegarder();
  // Demander si tuto voulu
  demanderTuto();
}

window.addEventListener('load', () => {
  preloadSprites();
  const save = chargerSauvegarde();
  if (save) {
    J = save;
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('nav').style.display = 'flex';
    document.getElementById('global-log-wrap').style.display = 'block';
    showTab('profil');
    log(`Sauvegarde chargee. Bon retour ${J.nom} !`, 'good');
    // Migrations — champs absents des anciennes sauvegardes
    if (!J.lieuxVisites) J.lieuxVisites = [0];  // brouillard : seulement la base connue
    if (!J.stats) J.stats = {};
    if (!J.stockBase) J.stockBase = {};
    if (!J.quetes) J.quetes = [];
    if (!J.quetesTerminees) J.quetesTerminees = [];
    if (!J.journal) J.journal = [];
    if (!J.statuts) J.statuts = [];
    if (J.reputation === undefined) J.reputation = 0;
    if (!J.competences) J.competences = [];
    if (!J.stats5) J.stats5 = { force:1, agilite:1, endurance:1, intelligence:1, survie:1 };
    if (J.pointsStats === undefined) J.pointsStats = 0;
    if (!J.mutations) J.mutations = [];
    initQuetes();
    productionQuotidienne();
    verifierRaid();
    updateUI();
    verifierActionEnCours();
  }
});

// ===== TEMPS RÉEL / OFFLINE =====
function lancerActionDifferee(typeAction, dureeHeures, donneesAction) {
  J.actionEnCours = {
    type: typeAction,
    debut: Date.now(),
    duree: dureeHeures * 3600 * 1000, // en millisecondes
    donnees: donneesAction
  };
  sauvegarder();
}

function verifierActionEnCours() {
  if (!J.actionEnCours) return;
  const maintenant = Date.now();
  const elapsed = maintenant - J.actionEnCours.debut;
  const duree = J.actionEnCours.duree;
  const heuresEcoulees = elapsed / 3600000;
  const heuresTotales = duree / 3600000;

  if (elapsed >= duree) {
    // Action terminée
    const type = J.actionEnCours.type;
    const donnees = J.actionEnCours.donnees;
    J.actionEnCours = null;

    // Appliquer la consommation de stats pour le temps écoulé
    passerTemps(heuresTotales);

    if (type === 'fouille') {
      if (J.vie > 0) {
        const lieu = LIEUX[donnees.lieuIdx];
        const nbItemsBrut = donnees.nbItems || 1;
        const nbItems = bonusSurvItems(nbItemsBrut);
        const xpGain  = donnees.xpGain  || 10;
        const secs = Math.round(heuresTotales * 3600);

        // Nombre max d'ennemis selon durée
        let maxEnnemis = 1;
        if      (secs >= 28800) maxEnnemis = 25; // 8h
        else if (secs >= 14400) maxEnnemis = 18; // 4h
        else if (secs >= 7200)  maxEnnemis = 14; // 2h
        else if (secs >= 3600)  maxEnnemis = 10; // 1h
        else if (secs >= 1800)  maxEnnemis = 8;  // 30min
        else if (secs >= 300)   maxEnnemis = 8;  // 5min
        else if (secs >= 180)   maxEnnemis = 6;
        else if (secs >= 60)    maxEnnemis = 4;
        else if (secs >= 30)    maxEnnemis = 3;
        else if (secs >= 10)    maxEnnemis = 2;

        // Probabilité par ennemi selon durée + danger
        let probBase = 0.20;
        if      (secs >= 300) probBase = 0.98;
        else if (secs >= 180) probBase = 0.92;
        else if (secs >= 60)  probBase = 0.80;
        else if (secs >= 30)  probBase = 0.70;
        else if (secs >= 20)  probBase = 0.60;
        else if (secs >= 10)  probBase = 0.50;
        else if (secs >= 5)   probBase = 0.35;
        const prob = lieu.danger === 0 ? 0 : Math.min(0.99, probBase + lieu.danger * 0.05);

        // Générer la file d'ennemis — 1er quasi garanti si prob élevée, suivants dégressifs
        const fileEnnemis = [];
        if (lieu.danger > 0) {
          for (let i = 0; i < maxEnnemis; i++) {
            const probIci = i === 0 ? prob : prob * Math.pow(0.65, i);
            if (Math.random() < probIci) {
              fileEnnemis.push(genererEnnemi(donnees.lieuIdx));
            }
          }
        }

        // Donner les objets trouvés
        if (lieu.ressources.length) {
          for (let i = 0; i < nbItems; i++) {
            const item = lieu.ressources[Math.floor(Math.random()*lieu.ressources.length)];
            ajouter(item, 1);
          }
          gagnerXP(xpGain);
        }

        if (fileEnnemis.length > 0) {
          J.fileEnnemis = fileEnnemis;
          afficherResumeFouille(lieu, nbItems, fileEnnemis);
        } else {
          log(`Fouille terminee sans incident. ${nbItems} objet(s) trouve(s).`, 'good');
          sauvegarder();
          updateUI();
        }
      }
    } else if (type === 'voyage') {
      if (J.vie > 0) {
        J.lieu = donnees.destination;
        J.lieuxVisites = J.lieuxVisites || [0];
        if (!J.lieuxVisites.includes(donnees.destination)) {
          J.lieuxVisites.push(donnees.destination);
          progresserQuete('visiter','lieu',1);
        }
        gagnerXP(5);
        log(`Voyage termine ! Arrive a ${LIEUX[donnees.destination].nom}.`, 'good');
        ajouterJournal(`Arrive a ${LIEUX[donnees.destination].nom}`);
        // Changement météo aléatoire
        if (Math.random() < 0.4) changerMeteo();
        // Événement de voyage
        declencherEvenementVoyage();
        // Vérifier raid si retour base
        verifierRaid();
      }
    } else if (type === 'repos') {
      if (J.vie > 0) {
        const confort = donnees.confort || (donnees.base ? 60 : 30);
        const vie = donnees.vie || (donnees.base ? 20 : 10);
        J.confort = Math.min(100, J.confort + confort);
        J.vie     = Math.min(J.vieMax, J.vie + vie);
        log(`Repos termine ! +${confort} confort, +${vie} vie.`, 'good');
      }
    }
    notifier('✓ Action terminee !');
    sauvegarder();
    updateUI();
    renderTimerAction();

  } else {
    // Action en cours — afficher le temps restant
    renderTimerAction();
  }
}

function renderTimerAction() {
  const div = document.getElementById('timer-action');
  if (!div) return;
  if (!J.actionEnCours) {
    div.style.display = 'none';
    document.getElementById('actions-menu').style.display = 'block';
    return;
  }
  const elapsed = Date.now() - J.actionEnCours.debut;
  const restant = Math.max(0, J.actionEnCours.duree - elapsed);
  const h = Math.floor(restant / 3600000);
  const m = Math.floor((restant % 3600000) / 60000);
  const s = Math.floor((restant % 60000) / 1000);
  const labels = { fouille: 'FOUILLE EN COURS', voyage: 'VOYAGE EN COURS', repos: 'REPOS EN COURS' };
  div.style.display = 'block';
  div.innerHTML = `
    <div style="background:#0d0d00;border:1px solid var(--yellow);padding:12px;margin-bottom:10px;">
      <div style="font-family:'Oswald',sans-serif;color:var(--yellow);letter-spacing:3px;margin-bottom:8px;">${labels[J.actionEnCours.type] || 'ACTION EN COURS'}</div>
      <div style="font-size:22px;color:var(--white);text-align:center;margin-bottom:8px;">${h}h ${m}m ${s}s</div>
      <div style="color:var(--text2);font-size:11px;text-align:center;">Tu peux fermer l'appli. Le resultat t'attendra.</div>
    </div>`;
  document.getElementById('actions-menu').style.display = 'none';
}

// Tick toutes les secondes pour le timer
setInterval(() => {
  if (J && J.actionEnCours) {
    const elapsed = Date.now() - J.actionEnCours.debut;
    if (elapsed >= J.actionEnCours.duree) {
      verifierActionEnCours();
    } else {
      renderTimerAction();
    }
  }
}, 1000);

// ===== TABS =====
function showTab(tab) {
  ['profil','actions','carte','inventaire','base'].forEach(t => {
    const el = document.getElementById('tab-'+t);
    if (el) el.style.display = 'none';
  });
  document.querySelectorAll('.nav-btn').forEach((b,i) => {
    b.classList.toggle('active', ['profil','actions','carte','inventaire','base'][i] === tab);
  });
  document.getElementById('tab-'+tab).style.display = 'block';
  if (tab === 'carte') renderCarte();
  if (tab === 'inventaire') renderInventaire();
  if (tab === 'actions') renderTimerAction();
  if (tab === 'base') renderBase();
}

// ===== LOG =====
function log(msg, type='') {
  const div = document.getElementById('log');
  if (!div) return;
  const line = document.createElement('div');
  line.className = 'log-line ' + type;
  line.textContent = '> ' + msg;
  div.appendChild(line);
  div.scrollTop = div.scrollHeight;
  while (div.children.length > 30) div.removeChild(div.firstChild);
}

// ===== UPDATE UI =====
function updateUI() {
  document.getElementById('p-nom').textContent = J.nom;
  // Portrait joueur
  const portraitEl = document.getElementById('joueur-portrait');
  if (portraitEl && SPRITES && SPRITES.joueur_portrait) {
    portraitEl.src = SPRITES.joueur_portrait;
    portraitEl.style.display = 'block';
  }
  document.getElementById('p-level').textContent = `NIVEAU ${J.niveau}  |  ${J.xp}/${J.xpMax} XP`;
  document.getElementById('p-att').textContent = J.att;
  document.getElementById('p-def').textContent = J.def;
  document.getElementById('p-caps').textContent = J.capsules;
  const meteoObj = (typeof METEOS !== 'undefined') ? METEOS.find(m=>m.id===(J.meteo||'ensoleille')) : null;
  const meteoStr = meteoObj ? ` ${meteoObj.icone}` : '';
  // Nuit/Jour
  const h = Math.floor(J.heure||8);
  J.estNuit = h >= 21 || h < 6;
  const nuitStr = J.estNuit ? ' 🌙' : ' ☀️';
  document.getElementById('p-jour').textContent = `Jour ${J.jour}${nuitStr}${meteoStr}`;
  document.getElementById('p-lieu').textContent = LIEUX[J.lieu].nom;
  const statutsDiv = document.getElementById('p-statuts');
  if (statutsDiv) {
    const noms = { poison:'☠ Poison', saignement:'🩸 Saignement', brulure:'🔥 Brulure' };
    statutsDiv.textContent = J.statuts && J.statuts.length > 0
      ? J.statuts.map(s=>`${noms[s.id]||s.id}(${s.duree}t)`).join(' | ')
      : '';
  }
  // Équipement
  const armeEl = document.getElementById('p-arme');
  const armureEl = document.getElementById('p-armure');
  if (armeEl) armeEl.textContent = J.armeEquipee || 'Aucune';
  if (armureEl) armureEl.textContent = J.armureEquipee || 'Aucune';
  // Réputation
  const repEl = document.getElementById('p-rep');
  if (repEl) {
    const rep = J.reputation||0;
    const repNom = rep >= 60 ? 'Heros' : rep >= 20 ? 'Reconnu' : rep >= -20 ? 'Neutre' : rep >= -60 ? 'Suspect' : 'Criminel';
    const repCoul = rep > 0 ? 'var(--green)' : rep < 0 ? 'var(--red2)' : 'var(--text2)';
    repEl.textContent = `${repNom} (${rep > 0 ? '+' : ''}${rep})`;
    repEl.style.color = repCoul;
  }
  // Stats5
  const s5 = J.stats5 || {};
  const s5el = document.getElementById('p-stats5');
  if (s5el) {
    s5el.innerHTML = `<span title="ATT +${(s5.force||1)*2}">⚔ FOR${s5.force||1}</span> <span title="Esquive +${(s5.agilite||1)*3}%">💨 AGI${s5.agilite||1}</span> <span title="Vie +${(s5.endurance||1)*15}">💪 END${s5.endurance||1}</span> <span title="XP +${(s5.intelligence||1)*5}%">🧠 INT${s5.intelligence||1}</span> <span title="Fouille +${(s5.survie||1)*5}%">🌿 SUR${s5.survie||1}</span>${J.pointsStats>0?' <span style="color:var(--yellow);animation:pulse 1s infinite">▲'+J.pointsStats+'pts</span>':''}`;
  }
  // Compagnon
  const compEl = document.getElementById('p-compagnon');
  if (compEl) {
    if (J.compagnon) compEl.textContent = `${J.compagnon.nom} ❤${J.compagnon.vie}/${J.compagnon.vieMax}`;
    else compEl.textContent = 'Aucun';
    compEl.style.color = J.compagnon ? 'var(--green)' : 'var(--text2)';
  }

  setBarre('vie',     J.vie,    J.vieMax);
  setBarre('faim',    J.faim,   100);
  setBarre('soif',    J.soif,   100);
  setBarre('confort', J.confort,100);
  setBarreXP();
}

function setBarre(id, val, max) {
  const pct = Math.max(0, Math.min(100, (val/max)*100));
  document.getElementById('bar-'+id).style.width = pct + '%';
  document.getElementById('val-'+id).textContent = id === 'vie' ? `${val}/${max}` : val;
}

function setBarreXP() {
  const pct = (J.xp / J.xpMax) * 100;
  document.getElementById('bar-xp').style.width = pct + '%';
  document.getElementById('val-xp').textContent = `${J.xp}/${J.xpMax}`;
}

// ===== TEMPS =====
function passerTemps(h) {
  J.faim    = Math.max(0, J.faim    - 5*h);
  J.soif    = Math.max(0, J.soif    - 8*h);
  J.confort = Math.max(0, J.confort - 4*h);
  J.heure  += h;
  while (J.heure >= 24) { J.heure -= 24; J.jour++; productionQuotidienne(); }
  if (J.faim  === 0) { J.vie = Math.max(0, J.vie-10); log("Tu meurs de faim ! Mange vite.", 'bad'); }
  if (J.soif  === 0) { J.vie = Math.max(0, J.vie-15); log("Tu meurs de soif ! Bois vite.", 'bad'); }
  appliquerStatuts();
  checkMort();
}

function gagnerXP(montant) {
  const montantBonus = bonusIntXP(montant);
  J.xp += montantBonus;
  log(`+${montantBonus} XP${montantBonus > montant ? ` (bonus INT +${montantBonus-montant})` : ''}`, 'xp');
  while (J.xp >= J.xpMax) {
    J.xp -= J.xpMax;
    J.xpMax = Math.floor(J.xpMax * 2.2);
    J.niveau++;
    J.vieMax += 10;
    J.vie = Math.min(J.vieMax, J.vie + 10);
    J.pointsStats = (J.pointsStats || 0) + 1;
    log(`NIVEAU ${J.niveau} ! +1 point de stat disponible.`, 'xp');
    verifierMutations();
    afficherChoixCompetence();
  }
}

const COMPETENCES = [
  { id:'guerrier', nom:'Guerrier',    icone:'⚔️', desc:'+5 ATT, +2 DEF',           effet: j=>{j.att+=5; j.def+=2;} },
  { id:'tank',     nom:'Tank',        icone:'🛡', desc:'+3 ATT, +8 DEF, +20 vie max', effet: j=>{j.att+=3; j.def+=8; j.vieMax+=20; j.vie=Math.min(j.vieMax,j.vie+20);} },
  { id:'chasseur', nom:'Chasseur',    icone:'🏹', desc:'+8 ATT, fouille +20% items', effet: j=>{j.att+=8; j.bonusFouille=(j.bonusFouille||0)+0.2;} },
  { id:'medecin',  nom:'Medecin',     icone:'💊', desc:'+5 DEF, soins 2x efficaces', effet: j=>{j.def+=5; j.bonusSoin=(j.bonusSoin||0)+1;} },
  { id:'explorateur',nom:'Explorateur',icone:'🗺', desc:'+6 ATT, voyages 30% plus rapides', effet: j=>{j.att+=6; j.bonusVoyage=(j.bonusVoyage||0)+0.3;} },
  { id:'forgeron', nom:'Forgeron',    icone:'🔧', desc:'+4 ATT, +4 DEF, craft 20% moins cher', effet: j=>{j.att+=4; j.def+=4; j.bonusCraft=(j.bonusCraft||0)+0.2;} },
];

function afficherChoixCompetence() {
  // Tirer 3 competences aleatoires
  const pool = [...COMPETENCES].sort(()=>Math.random()-0.5).slice(0,3);
  let html = `<div style="background:#0d0d00;border:1px solid var(--yellow);padding:12px;margin-bottom:10px;">
    <div style="font-family:'Oswald',sans-serif;color:var(--yellow);font-size:16px;letter-spacing:3px;margin-bottom:4px;">⭐ NIVEAU ${J.niveau} !</div>
    <div style="font-size:11px;color:var(--text2);">Choisis une competence :</div>
  </div>`;
  pool.forEach((c,i) => {
    html += `<div style="background:#111;border:1px solid #2a2a2a;border-left:3px solid var(--yellow);padding:10px 12px;margin-bottom:8px;">
      <div style="font-family:'Oswald',sans-serif;color:var(--yellow);font-size:14px;margin-bottom:4px;">${c.icone} ${c.nom.toUpperCase()}</div>
      <div style="font-size:11px;color:var(--text2);margin-bottom:8px;">${c.desc}</div>
      <button class="btn yellow" style="margin:0;padding:8px;" onclick="choisirCompetence(${i},${JSON.stringify(pool).replace(/"/g,"'")})">CHOISIR</button>
    </div>`;
  });
  showTab('actions');
  document.getElementById('actions-menu').style.display = 'block';
  document.getElementById('actions-menu').innerHTML = html;
  document.getElementById('combat-screen').style.display = 'none';
}

function choisirCompetence(idx, pool) {
  const c = (typeof pool === 'string' ? JSON.parse(pool.replace(/'/g,'"')) : pool)[idx];
  if (!c) return;
  c.effet(J);
  J.competences = J.competences || [];
  J.competences.push(c.id);
  log(`Competence : ${c.nom} ! ${c.desc}`, 'xp');
  sauvegarder();
  updateUI();
  resetActionsMenu();
}

function ajouter(item, qte=1) {
  J.inventaire[item] = (J.inventaire[item] || 0) + qte;
  progresserQuete('collecter', item, qte);
}

// ===== MÉTÉO =====
const METEOS = [
  { id:'ensoleille', icone:'☀️', nom:'Ensoleille',  fouille:+0.1,  soif:-0.02, desc:'Bonne visibilite. Soif +.' },
  { id:'pluie',      icone:'🌧', nom:'Pluie',       fouille:-0.15, soif:+0.1,  desc:'Fouille -. Eau gratuite.' },
  { id:'orage',      icone:'⛈', nom:'Orage',       fouille:-0.3,  soif:+0.05, desc:'Fouille reduite. Dangereux.' },
  { id:'brume',      icone:'🌫', nom:'Brume',       fouille:-0.1,  soif:0,     desc:'Visibilite basse.' },
  { id:'chaleur',    icone:'🔥', nom:'Canicule',    fouille:+0.05, soif:-0.05, desc:'Soif augmente vite.' },
];

function changerMeteo() {
  const pool = ['ensoleille','ensoleille','pluie','brume','orage','chaleur'];
  J.meteo = pool[Math.floor(Math.random()*pool.length)];
  const m = METEOS.find(x=>x.id===J.meteo);
  log(`Meteo : ${m.icone} ${m.nom} — ${m.desc}`, 'info');
  // Effets pluie = eau gratuite
  if (J.meteo === 'pluie' || J.meteo === 'orage') ajouter('eau', 1);
}

// ===== STATUTS DE COMBAT =====
function appliquerStatuts() {
  if (!J.statuts || J.statuts.length === 0) return;
  J.statuts = J.statuts.filter(s => s.duree > 0);
  J.statuts.forEach(s => {
    s.duree--;
    if (s.id === 'poison')     { J.vie = Math.max(1, J.vie - 5); log('Poison : -5 vie', 'bad'); }
    if (s.id === 'saignement') { J.vie = Math.max(1, J.vie - 3); log('Saignement : -3 vie', 'bad'); }
    if (s.id === 'brulure')    { J.vie = Math.max(1, J.vie - 7); log('Brulure : -7 vie', 'bad'); }
  });
}

function ajouterStatut(id, duree) {
  J.statuts = J.statuts || [];
  const exist = J.statuts.find(s => s.id === id);
  if (exist) { exist.duree = Math.max(exist.duree, duree); }
  else J.statuts.push({ id, duree });
  const noms = { poison:'☠ EMPOISONNE', saignement:'🩸 SAIGNEMENT', brulure:'🔥 BRULURE' };
  log(noms[id] || id, 'bad');
}

// ===== QUÊTES =====
const TOUTES_QUETES = [
  { id:'q1', nom:'Premiere chasse', desc:'Tue 3 animaux en foret',
    type:'tuer', cible:'foret_animal', qte:3, recompense:{capsules:30, xp:50} },
  { id:'q2', nom:'Collecteur de metal', desc:'Ramasse 10 metal',
    type:'collecter', cible:'metal', qte:10, recompense:{capsules:40, xp:60} },
  { id:'q3', nom:'Survivant agueri', desc:'Gagne 5 combats',
    type:'combat', cible:'victoire', qte:5, recompense:{capsules:50, xp:80} },
  { id:'q4', nom:'Ravitaillement', desc:'Ramasse 15 nourriture',
    type:'collecter', cible:'nourriture', qte:15, recompense:{capsules:35, xp:55} },
  { id:'q5', nom:'Explorateur', desc:'Visite 5 lieux differents',
    type:'visiter', cible:'lieu', qte:5, recompense:{capsules:60, xp:100} },
  { id:'q6', nom:'Artisan', desc:'Fabrique 3 objets',
    type:'craft', cible:'objet', qte:3, recompense:{capsules:45, xp:70} },
  { id:'q7', nom:'Medecin de guerre', desc:'Utilise 5 soins',
    type:'soin', cible:'soin', qte:5, recompense:{capsules:40, xp:65} },
  { id:'q8', nom:'Chasseur de boss', desc:'Tue un boss',
    type:'tuer', cible:'boss', qte:1, recompense:{capsules:200, xp:500} },
  { id:'q9', nom:'Marchand prospere', desc:'Vends 20 objets au marchand',
    type:'vendre', cible:'objet', qte:20, recompense:{capsules:100, xp:120} },
  { id:'q10',nom:'Batisseur', desc:'Construis 3 batiments',
    type:'construire', cible:'batiment', qte:3, recompense:{capsules:80, xp:150} },
];

function initQuetes() {
  if (!J.quetes) J.quetes = [];
  if (!J.quetesTerminees) J.quetesTerminees = [];
  // Donner 3 quêtes de départ si aucune
  if (J.quetes.length === 0) {
    J.quetes = TOUTES_QUETES.slice(0,3).map(q => ({...q, progres:0}));
  }
}

function progresserQuete(type, cible, qte=1) {
  if (!J.quetes) return;
  J.quetes.forEach(q => {
    if (q.type === type && q.cible === cible && q.progres < q.qte) {
      q.progres = Math.min(q.qte, (q.progres||0) + qte);
      if (q.progres >= q.qte) terminerQuete(q);
    }
  });
}

function terminerQuete(q) {
  log(`QUETE TERMINEE : ${q.nom} !`, 'xp');
  if (q.recompense.capsules) { J.capsules += q.recompense.capsules; log(`+${q.recompense.capsules} capsules`, 'xp'); }
  if (q.recompense.xp) gagnerXP(q.recompense.xp);
  J.quetesTerminees = J.quetesTerminees || [];
  J.quetesTerminees.push(q.id);
  J.quetes = J.quetes.filter(x => x.id !== q.id);
  // Proposer une nouvelle quête
  const dispo = TOUTES_QUETES.filter(q2 =>
    !J.quetesTerminees.includes(q2.id) && !J.quetes.find(x=>x.id===q2.id)
  );
  if (dispo.length > 0) {
    const nouvelle = {...dispo[Math.floor(Math.random()*dispo.length)], progres:0};
    J.quetes.push(nouvelle);
    log(`Nouvelle quete : ${nouvelle.nom}`, 'info');
  }
  sauvegarder();
  updateUI();
}

function renderQuetes() {
  initQuetes();
  const div = document.getElementById('base-content');
  let html = `<button class="btn" style="border-left-color:var(--text2);margin-bottom:10px;" onclick="renderBase()">← RETOUR BASE</button>
  <div class="section-title" style="margin-bottom:8px;">QUETES ACTIVES</div>`;
  if (J.quetes.length === 0) html += `<div style="color:var(--text2);padding:10px;">Toutes les quetes sont terminees !</div>`;
  J.quetes.forEach(q => {
    const pct = Math.round((q.progres/q.qte)*100);
    html += `<div style="background:var(--bg3);border:1px solid var(--border);border-left:3px solid var(--yellow);padding:10px 12px;margin-bottom:8px;">
      <div style="font-family:'Oswald',sans-serif;color:var(--yellow);font-size:13px;">${q.nom.toUpperCase()}</div>
      <div style="color:var(--text2);font-size:11px;margin:4px 0;">${q.desc}</div>
      <div style="background:#111;height:6px;margin:6px 0;border-radius:2px;">
        <div style="background:var(--yellow);width:${pct}%;height:100%;border-radius:2px;"></div>
      </div>
      <div style="display:flex;justify-content:space-between;font-size:10px;">
        <span style="color:var(--text2);">${q.progres}/${q.qte}</span>
        <span style="color:var(--green);">Recompense : ${q.recompense.capsules||0}💊 +${q.recompense.xp||0}XP</span>
      </div>
    </div>`;
  });
  html += `<div class="section-title" style="margin:12px 0 8px;">TERMINEES (${(J.quetesTerminees||[]).length})</div>`;
  (J.quetesTerminees||[]).forEach(id => {
    const q = TOUTES_QUETES.find(x=>x.id===id);
    if (q) html += `<div style="color:#444;font-size:11px;padding:4px 0;">✓ ${q.nom}</div>`;
  });
  div.innerHTML = html;
}

// ===== JOURNAL =====
function ajouterJournal(msg) {
  J.journal = J.journal || [];
  const h = Math.floor(J.heure||8);
  const m = String(Math.round(((J.heure||8)-h)*60)).padStart(2,'0');
  J.journal.unshift(`Jour ${J.jour||1} ${h}h${m} — ${msg}`);
  if (J.journal.length > 50) J.journal = J.journal.slice(0,50);
}

function renderJournal() {
  const div = document.getElementById('base-content');
  let html = `<button class="btn" style="border-left-color:var(--text2);margin-bottom:10px;" onclick="renderBase()">← RETOUR BASE</button>
  <div class="section-title" style="margin-bottom:8px;">JOURNAL DE BORD</div>`;
  if (!J.journal || J.journal.length === 0) {
    html += `<div style="color:var(--text2);padding:10px;">Journal vide.</div>`;
  } else {
    J.journal.forEach(e => {
      html += `<div style="font-size:11px;color:var(--text2);padding:5px 0;border-bottom:1px solid #1a1a1a;">${e}</div>`;
    });
  }
  div.innerHTML = html;
}

// ===== STOCK BASE =====
function renderStock() {
  const div = document.getElementById('base-content');
  const s = J.stockBase || {};
  let html = `<button class="btn" style="border-left-color:var(--text2);margin-bottom:10px;" onclick="renderBase()">← RETOUR BASE</button>
  <div class="section-title" style="margin-bottom:8px;">STOCK DE LA BASE</div>
  <div style="font-size:11px;color:var(--text2);margin-bottom:10px;">Depose ou reprends des ressources. Le stock est protege meme si tu meurs.</div>`;

  const tousItems = new Set([...Object.keys(J.inventaire||{}), ...Object.keys(s)]);
  if (tousItems.size === 0) {
    html += `<div style="color:var(--text2);padding:10px;">Rien a stocker.</div>`;
  }
  tousItems.forEach(item => {
    const invQte = J.inventaire[item]||0;
    const stockQte = s[item]||0;
    if (invQte === 0 && stockQte === 0) return;
    html += `<div style="display:flex;align-items:center;justify-content:space-between;background:#111;border:1px solid #222;padding:7px 10px;margin-bottom:4px;">
      <div>
        <span style="color:var(--text);font-size:12px;">${item}</span><br>
        <span style="font-size:10px;color:var(--text2);">Sac: ${invQte} | Stock: ${stockQte}</span>
      </div>
      <div style="display:flex;gap:6px;">
        ${invQte>0?`<button onclick="deposerStock('${item}')" style="background:#0d1a0d;border:1px solid var(--green);color:var(--green);font-size:10px;padding:3px 8px;cursor:pointer;font-family:'Share Tech Mono',monospace;">DEPOSER</button>`:''}
        ${stockQte>0?`<button onclick="reprendreStock('${item}')" style="background:#0d0d1a;border:1px solid var(--blue);color:var(--blue);font-size:10px;padding:3px 8px;cursor:pointer;font-family:'Share Tech Mono',monospace;">REPRENDRE</button>`:''}
      </div>
    </div>`;
  });
  div.innerHTML = html;
}

function deposerStock(item) {
  if (!J.inventaire[item] || J.inventaire[item]<=0) return;
  J.inventaire[item]--;
  if (!J.inventaire[item]) delete J.inventaire[item];
  J.stockBase = J.stockBase||{};
  J.stockBase[item] = (J.stockBase[item]||0)+1;
  sauvegarder(); renderStock();
}

function reprendreStock(item) {
  if (!J.stockBase||!J.stockBase[item]||J.stockBase[item]<=0) return;
  J.stockBase[item]--;
  if (!J.stockBase[item]) delete J.stockBase[item];
  ajouter(item,1);
  sauvegarder(); renderStock();
}

// ===== RAIDS ====
function verifierRaid() {
  if (!J.base || J.lieu !== 0) return;
  const maintenant = Date.now();
  J.base.dernierRaid = J.base.dernierRaid || 0;
  // Raid possible toutes les 30min de temps réel si base faible
  if (maintenant - J.base.dernierRaid < 30*60*1000) return;
  const defTotal = calculerDefense();
  const probRaid = Math.max(0, 0.15 - defTotal * 0.005);
  if (Math.random() < probRaid) {
    J.base.dernierRaid = maintenant;
    const degats = Math.max(5, 40 - defTotal);
    J.vie = Math.max(1, J.vie - degats);
    // Perte de ressources
    const items = Object.keys(J.stockBase||{});
    let perdu = '';
    if (items.length > 0) {
      const item = items[Math.floor(Math.random()*items.length)];
      const perte = Math.min(J.stockBase[item], Math.ceil(J.stockBase[item]*0.2));
      J.stockBase[item] -= perte;
      if (!J.stockBase[item]) delete J.stockBase[item];
      perdu = ` et ${perte} ${item} pille(s)`;
    }
    log(`⚠ RAID ! Ta base a ete attaquee. -${degats} vie${perdu}. Defense: ${defTotal}`, 'bad');
    ajouterJournal(`RAID subi — defense ${defTotal} — degats ${degats}`);
    sauvegarder(); updateUI();
  }
}

// ===== RÔLES HABITANTS BASE =====
function productionQuotidienne() {
  if (!J.base) return;
  const b = J.base;
  let prod = [];
  if (b.chasseurs > 0)  { ajouter('nourriture', b.chasseurs); ajouter('cuir', Math.floor(b.chasseurs/2)||0); prod.push(`+${b.chasseurs} nour.`); }
  if (b.fermiers > 0)   { ajouter('nourriture', b.fermiers); ajouter('eau', b.fermiers); prod.push(`+${b.fermiers} nour/eau`); }
  if (b.forgerons > 0)  { ajouter('metal', b.forgerons); prod.push(`+${b.forgerons} metal`); }
  if (b.ferme)          { ajouter('nourriture', b.ferme); }
  if (prod.length > 0) { log('Production base : ' + prod.join(', '), 'good'); ajouterJournal('Prod: '+prod.join(', ')); }
  if (!J.stats) J.stats = {};
  J.stats.joursVecus = (J.stats.joursVecus||0) + 1;
  declencherEvenementBase();
  notifier('Nouveau jour — production de la base');
}

// ===== ÉVÉNEMENTS DE VOYAGE =====
const EVENEMENTS_VOYAGE = [
  { prob:0.15, fn: j => { ajouter('nourriture',2); log('Evenement : tu trouves de la nourriture en chemin ! +2', 'good'); } },
  { prob:0.10, fn: j => { ajouter('metal',1);      log('Evenement : une vieille epave. +1 metal.', 'good'); } },
  { prob:0.10, fn: j => { ajouter('capsules',10);  j.capsules+=10; log('Evenement : tu trouves 10 capsules par terre !', 'good'); } },
  { prob:0.08, fn: j => { ajouterStatut('saignement',3); log('Evenement : tu te blesses sur un debris en route !', 'bad'); } },
  { prob:0.08, fn: j => {
    j.fileEnnemis = [genererEnnemi(j.lieu)];
    log('Evenement : EMBUSCADE en chemin !', 'bad');
    lancerProchainCombat();
  }},
  { prob:0.06, fn: j => { j.soif = Math.min(100, j.soif+20); log("Evenement : source d'eau trouvee. +20 soif.", "good"); } },
  { prob:0.05, fn: j => { ajouter('medicament',1); log('Evenement : trousse de soin abandonnee.', 'good'); } },
];

function declencherEvenementVoyage() {
  const r = Math.random();
  let cumul = 0;
  for (const ev of EVENEMENTS_VOYAGE) {
    cumul += ev.prob;
    if (r < cumul) { ev.fn(J); return; }
  }
}

// ===== UTILISER OBJET EN COMBAT =====
function utiliserObjetCombat(item) {
  if (!combat) return;
  if (!J.inventaire[item] || J.inventaire[item] <= 0) { log('Objet indisponible.','warn'); return; }
  J.inventaire[item]--;
  if (!J.inventaire[item]) delete J.inventaire[item];
  if (item === 'medicament') { J.vie = Math.min(J.vieMax, J.vie+30); log('Medicament utilise : +30 vie.','good'); }
  if (item === 'bandage')    { J.vie = Math.min(J.vieMax, J.vie+15); log('Bandage utilise : +15 vie.','good'); }
  if (item === 'serum')      { J.vie = Math.min(J.vieMax, J.vie+50); J.statuts=[]; log('Serum utilise : +50 vie, statuts annules.','good'); }
  if (item === 'piege')      { combat.vie = Math.max(0,combat.vie-20); log("Piege : -20 PV ennemi !","good"); updateEnemyBar(); }
  if (item === 'piege_metal'){ combat.vie = Math.max(0,combat.vie-40); ajouterStatut.call({},item); log("Piege metal : -40 PV !","good"); updateEnemyBar(); }
  sauvegarder(); updateUI();
  // Vérifier mort ennemi
  if (combat && combat.vie <= 0) { log(`${combat.nom} vaincu !`,'good'); finCombat(true); }
}

// ===== ACTIONS =====
function actionFouiller() {
  if (J.actionEnCours) { log(`Une action est deja en cours.`, 'warn'); return; }
  if (J.lieu === 0) { log(`Tu es dans ta base. Pas besoin de fouiller ici — gere tes batiments et repose-toi.`, 'warn'); return; }
  const options = genererOptionsFouille(LIEUX[J.lieu]);
  ouvrirChoixFouille(J.lieu, options);
}

function genererOptionsFouille(lieu) {
  const b = lieu.danger;
  // XP/heure croissant avec la durée pour récompenser les longues fouilles
  // 5sec→ ~5xp/h équivalent, 8h → beaucoup plus rentable
  return [
    { duree: 5/3600,    label: "5 sec",    items: 1,   xp: 4   + b,      danger: "Aucun",      note:"⚡ Rapide"         },
    { duree: 10/3600,   label: "10 sec",   items: 2,   xp: 8   + b*2,    danger: b>0?"Faible":"Aucun" },
    { duree: 20/3600,   label: "20 sec",   items: 3,   xp: 15  + b*3,    danger: b>1?"Faible":"Aucun" },
    { duree: 30/3600,   label: "30 sec",   items: 5,   xp: 25  + b*4,    danger: b>2?"Moyen":"Faible" },
    { duree: 60/3600,   label: "1 min",    items: 8,   xp: 55  + b*6,    danger: b>1?"Moyen":"Faible" },
    { duree: 180/3600,  label: "3 min",    items: 14,  xp: 180 + b*10,   danger: b>2?"Eleve":"Moyen"  },
    { duree: 300/3600,  label: "5 min",    items: 22,  xp: 320 + b*15,   danger: b>2?"Tres eleve":"Eleve" },
    { duree: 0.5,       label: "30 min",   items: 40,  xp: 2200+ b*60,   danger: b>1?"Tres eleve":"Eleve",  note:"☕ Pause"       },
    { duree: 1,         label: "1 heure",  items: 65,  xp: 5000+ b*120,  danger: "Tres eleve",               note:"🕐 1h"          },
    { duree: 2,         label: "2 heures", items: 110, xp:11000+ b*220,  danger: "Tres eleve",               note:"🌅 Matinee"     },
    { duree: 4,         label: "4 heures", items: 180, xp:25000+ b*400,  danger: "Tres eleve",               note:"🌞 Demi-journee"},
    { duree: 8,         label: "8 heures", items: 300, xp:60000+ b*800,  danger: "Tres eleve",               note:"🌙 Nuit/journee"},
  ];
}

function ouvrirChoixFouille(lieuIdx, options) {
  const lieu = LIEUX[lieuIdx];
  const couleurDanger = { "Aucun":"var(--green)", "Faible":"var(--yellow)", "Moyen":"var(--orange)", "Eleve":"var(--red2)", "Tres eleve":"#ff0000" };
  let html = `<button class="btn" style="border-left-color:var(--text2);margin-bottom:8px;" onclick="resetActionsMenu()">← ANNULER</button>
  <div style="margin-bottom:10px;color:var(--text2);font-size:11px;">
    Lieu : <span style="color:var(--yellow)">${lieu.nom}</span><br>
    Ressources : <span style="color:var(--text)">${lieu.ressources.filter((v,i,a)=>a.indexOf(v)===i).join(', ')}</span>
  </div>`;
  options.forEach(opt => {
    const coul = couleurDanger[opt.danger] || 'var(--text)';
    html += `
    <button class="btn" style="margin-bottom:6px;" onclick="lancerFouille(${lieuIdx},${opt.duree},${opt.items},${opt.xp})">
      FOUILLER ${opt.label}${opt.note ? ' <span style="color:var(--text2);font-size:10px;">— '+opt.note+'</span>' : ''}
      <span class="btn-sub" style="display:flex;justify-content:space-between;">
        <span>~${opt.items} objets | +${opt.xp} XP</span>
        <span style="color:${coul}">⚠ ${opt.danger}</span>
      </span>
    </button>`;
  });
  document.getElementById('actions-menu').innerHTML = html;
}

function resetActionsMenu() {
  document.getElementById('actions-menu').innerHTML = `
    <button class="btn" onclick="actionFouiller()">FOUILLER<span class="btn-sub">Explorer le lieu actuel — risque de combat</span></button>
    ${J.derniereFouilleDuree && J.derniereFouilleDuree.lieuIdx === J.lieu ? `<button class="btn" style="border-left-color:#555;padding:6px 12px;" onclick="lancerFouille(J.derniereFouilleDuree.lieuIdx,J.derniereFouilleDuree.duree,J.derniereFouilleDuree.nbItems,J.derniereFouilleDuree.xpGain)">↩ REFOUILLER (meme duree)<span class="btn-sub">Reprendre la derniere configuration</span></button>`:''}
    <button class="btn green" onclick="actionManger()">MANGER<span class="btn-sub">Utiliser nourriture de l'inventaire</span></button>
    <button class="btn blue" onclick="actionBoire()">BOIRE<span class="btn-sub">Utiliser eau de l'inventaire</span></button>
    <button class="btn orange" onclick="actionSoigner()">SE SOIGNER<span class="btn-sub">Utiliser medicament ou bandage</span></button>
    <button class="btn yellow" onclick="actionReposer()">SE REPOSER<span class="btn-sub">Recuperer du confort et de la vie</span></button>
    <button class="btn" style="border-left-color:#95a5a6;" onclick="ouvrirCraft()">🔧 CRAFTER<span class="btn-sub">Fabriquer des objets et equipements</span></button>
    ${J.lieu === 3 ? '<button class="btn" style="border-left-color:#9b59b6;" onclick="ouvrirCompagnons()">👥 COMPAGNON<span class="btn-sub">Recruter un survivant au Marche noir</span></button>' : ''}`;
}

function lancerFouille(lieuIdx, duree, nbItems, xpGain) {
  resetActionsMenu();
  const secs = Math.round(duree * 3600);
  const label = secs < 60 ? `${secs} sec` : secs < 3600 ? `${Math.round(secs/60)} min` : `${(secs/3600).toFixed(0)}h`;
  log(`Fouille lancee (${label}). Tu peux fermer l'appli.`, 'info');
  lancerActionDifferee('fouille', duree, { lieuIdx, nbItems, xpGain });
  renderTimerAction();
}

function actionManger() {
  if (J.inventaire['nourriture'] > 0) {
    J.inventaire['nourriture']--;
    if (!J.inventaire['nourriture']) delete J.inventaire['nourriture'];
    J.faim = Math.min(100, J.faim + 35);
    log(`Tu manges. Faim : ${J.faim}/100`, 'good');
  } else {
    log(`Pas de nourriture dans le sac.`, 'warn');
  }
  updateUI();
  sauvegarder();
}

function actionBoire() {
  if (J.inventaire['eau'] > 0) {
    J.inventaire['eau']--;
    if (!J.inventaire['eau']) delete J.inventaire['eau'];
    J.soif = Math.min(100, J.soif + 40);
    log(`Tu bois. Soif : ${J.soif}/100`, 'good');
  } else {
    log(`Pas d'eau dans le sac.`, 'warn');
  }
  updateUI();
  sauvegarder();
}

function actionSoigner() {
  for (let item of ['medicament','bandage']) {
    if (J.inventaire[item] > 0) {
      J.inventaire[item]--;
      if (!J.inventaire[item]) delete J.inventaire[item];
      const soin = item === 'medicament' ? 30 : 15;
      J.vie = Math.min(J.vieMax, J.vie + soin);
      log(`Utilise ${item}. Vie : ${J.vie}/${J.vieMax}`, 'good');
      updateUI();
      sauvegarder();
      return;
    }
  }
  log(`Pas de soin disponible.`, 'warn');
}

function actionReposer() {
  if (J.actionEnCours) { log(`Une action est deja en cours.`, 'warn'); return; }
  const estBase = J.lieu === 0;
  const options = [
    { duree: 5/3600,   label: "5 sec",  confort: 5,  vie: 2,  desc: "Micro pause"        },
    { duree: 15/3600,  label: "15 sec", confort: 10, vie: 4,  desc: "Courte pause"       },
    { duree: 30/3600,  label: "30 sec", confort: 18, vie: 7,  desc: "Pause rapide"       },
    { duree: 60/3600,  label: "1 min",  confort: 30, vie: 10, desc: "Repos leger"        },
    { duree: 300/3600, label: "5 min",  confort: 50, vie: 15, desc: "Bon repos"          },
    { duree: 1800/3600,label: "30 min", confort: 80, vie: 25, desc: estBase ? "Longue sieste (base)" : "Longue sieste" },
    { duree: 1,        label: "1 heure",confort: 100,vie: 40, desc: estBase ? "Nuit complete (base)" : "Nuit complete" },
  ];
  let html = `<button class="btn" style="border-left-color:var(--text2);margin-bottom:8px;" onclick="resetActionsMenu()">← ANNULER</button>
  <div style="margin-bottom:8px;color:var(--text2);font-size:11px;">Choisir la duree du repos :</div>`;
  options.forEach(opt => {
    html += `<button class="btn yellow" style="margin-bottom:5px;" onclick="lancerRepos(${opt.duree},${opt.confort},${opt.vie},${estBase})">
      SE REPOSER ${opt.label}
      <span class="btn-sub" style="display:flex;justify-content:space-between;">
        <span>+${opt.confort} confort | +${opt.vie} vie</span>
        <span style="color:var(--text2)">${opt.desc}</span>
      </span>
    </button>`;
  });
  document.getElementById('actions-menu').innerHTML = html;
}

function lancerRepos(duree, confort, vie, estBase) {
  resetActionsMenu();
  const secs = Math.round(duree * 3600);
  const label = secs < 60 ? `${secs}s` : secs < 3600 ? `${Math.round(secs/60)}min` : `${Math.round(secs/3600)}h`;
  log(`Repos lance (${label}).`, 'info');
  lancerActionDifferee('repos', duree, { base: estBase, confort, vie });
  renderTimerAction();
}

// ===== COMBAT =====
function genererEnnemi(lieuIdx) {
  const listeLieu = ENNEMIS_LIEUX[lieuIdx];
  let eb;
  if (listeLieu && listeLieu.length > 0) {
    const candidats = listeLieu.filter(e => (e.niv||e.niveau||1) <= J.niveau + 3);
    const pool = candidats.length > 0 ? candidats : listeLieu;
    eb = pool[Math.floor(Math.random() * pool.length)];
  }
  if (eb) {
    const v = Math.floor(Math.random() * 3) - 1;
    return {
      nom:    eb.nom,
      vie:    Math.max(5, eb.vie + v * 5),
      vieMax: Math.max(5, eb.vie + v * 5),
      att:    Math.max(1, eb.att + v),
      def:    Math.max(0, eb.def + v),
      xp:     eb.xp,
      loot:   Array.isArray(eb.butin)
                ? eb.butin[Math.floor(Math.random()*eb.butin.length)]
                : eb.butin
    };
  }
  const niv = Math.max(1, J.niveau + Math.floor(Math.random()*3)-1);
  return {
    nom: ENNEMIS[Math.floor(Math.random()*ENNEMIS.length)],
    vie: 20+niv*10, vieMax: 20+niv*10, att: 5+niv*3, def: 2+niv,
    xp: 15+niv*10, loot: ['metal','nourriture','bandage','capsules'][Math.floor(Math.random()*4)]
  };
}

function afficherResumeFouille(lieu, nbItems, fileEnnemis) {
  showTab('actions');
  document.getElementById('combat-screen').style.display = 'none';
  document.getElementById('actions-menu').style.display = 'none';

  const coulNiv = ['','#27ae60','#f1c40f','#e67e22','#e74c3c','#c0392b','#ff0000','#ff0000'];
  let html = `
    <div style="background:#0d0000;border:1px solid var(--red);padding:12px;margin-bottom:10px;">
      <div style="font-family:'Oswald',sans-serif;color:var(--red2);font-size:16px;letter-spacing:3px;margin-bottom:6px;">⚠ FOUILLE TERMINEE</div>
      <div style="color:var(--text2);font-size:11px;margin-bottom:10px;">Lieu : <span style="color:var(--yellow)">${lieu.nom}</span> — ${nbItems} objet(s) ramasse(s)</div>
      <div style="font-family:'Oswald',sans-serif;color:var(--red2);font-size:13px;margin-bottom:8px;">${fileEnnemis.length} ENNEMI(S) A AFFRONTER :</div>`;

  fileEnnemis.forEach((e, i) => {
    const cn = coulNiv[Math.min(Math.ceil(e.vieMax/20), coulNiv.length-1)];
    html += `
      <div style="display:flex;justify-content:space-between;align-items:center;background:#111;border:1px solid #2a2a2a;border-left:3px solid ${cn};padding:7px 10px;margin-bottom:5px;">
        <div>
          <div style="font-family:'Oswald',sans-serif;color:${cn};font-size:13px;">${i+1}. ${e.nom.toUpperCase()}</div>
          <div style="font-size:10px;color:#666;">❤${e.vie} ⚔${e.att} 🛡${e.def} ⭐${e.xp}xp</div>
        </div>
        <div style="font-size:10px;color:var(--yellow);">Butin: ${e.loot || '?'}</div>
      </div>`;
  });

  html += `
      <div style="margin-top:10px;font-size:11px;color:#888;">Les combats se lancent un par un. Tu peux fuir entre chaque.</div>
    </div>
    <button class="btn" style="border-left-color:var(--red);" onclick="lancerProchainCombat()">
      ⚔ AFFRONTER LE 1ER ENNEMI
      <span class="btn-sub">${fileEnnemis[0].nom} — Vie:${fileEnnemis[0].vie} ATT:${fileEnnemis[0].att}</span>
    </button>
    <button class="btn blue" style="margin-top:6px;" onclick="fuirTousCombats()">
      FUIR TOUS LES ENNEMIS
      <span class="btn-sub">-20 vie, perds les objets trouves</span>
    </button>`;

  document.getElementById('timer-action').style.display = 'none';
  const menu = document.getElementById('actions-menu');
  menu.style.display = 'block';
  menu.innerHTML = html;
}

function lancerProchainCombat() {
  if (!J.fileEnnemis || J.fileEnnemis.length === 0) {
    resetActionsMenu();
    sauvegarder();
    return;
  }
  combat = J.fileEnnemis.shift();
  sauvegarder();
  document.getElementById('combat-screen').style.display = 'block';
  document.getElementById('actions-menu').style.display = 'none';
  document.getElementById('enemy-name').textContent = combat.nom.toUpperCase();
  // Image ennemi
  let imgEl = document.getElementById('enemy-img');
  if (!imgEl) {
    imgEl = document.createElement('img');
    imgEl.id = 'enemy-img';
    imgEl.style.cssText = 'display:block;margin:6px auto 4px;width:110px;height:110px;object-fit:contain;border-radius:6px;image-rendering:pixelated;filter:drop-shadow(0 0 8px rgba(192,57,43,0.5));';
    document.getElementById('enemy-name').after(imgEl);
  }
  const imgSrc = getImageEnnemi(combat.nom);
  if (imgSrc) {
    imgEl.src = imgSrc; imgEl.style.display = 'block';
    imgEl.onerror = () => imgEl.style.display = 'none';
  } else {
    imgEl.style.display = 'none';
  }
  // Colorer nom selon type
  const enemNom = document.getElementById('enemy-name');
  if (combat.boss)     {
    enemNom.style.color = '#c0392b'; enemNom.style.fontSize = '17px';
    imgEl.style.width = '130px'; imgEl.style.height = '130px';
    imgEl.style.filter = 'drop-shadow(0 0 14px rgba(192,57,43,0.9))';
  } else if (combat.miniBoss) {
    enemNom.style.color = '#e67e22'; enemNom.style.fontSize = '14px';
    imgEl.style.width = '115px'; imgEl.style.height = '115px';
    imgEl.style.filter = 'drop-shadow(0 0 10px rgba(230,126,34,0.7))';
  }
  else                 { enemNom.style.color = ''; enemNom.style.fontSize = ''; }
  updateEnemyBar();
  const restants = J.fileEnnemis ? J.fileEnnemis.length : 0;
  log(`COMBAT : ${combat.nom} !${restants > 0 ? ` (${restants} autre(s) apres)` : ''}`, 'bad');
  updateUI();
}

function fuirTousCombats() {
  J.vie = Math.max(1, J.vie - 20);
  J.fileEnnemis = [];
  log('Tu fuis ! -20 vie.', 'bad');
  resetActionsMenu();
  updateUI();
  sauvegarder();
}

function demarrerCombat() {
  // Compat ancienne logique — génère 1 ennemi direct
  J.fileEnnemis = [genererEnnemi(J.lieu)];
  lancerProchainCombat();
}

function updateEnemyBar() {
  if (!combat) return;
  const pct = (combat.vie / combat.vieMax) * 100;
  document.getElementById('bar-enemy').style.width = pct + '%';
  document.getElementById('val-enemy').textContent = `${combat.vie}/${combat.vieMax}`;
}

function combatAction(action) {
  if (!combat) return;

  if (action === 'fuir') {
    const fuirToujours = (J.mutations||[]).includes('speed');
    if (fuirToujours || Math.random() < 0.5) {
      log(`Tu fuis avec succes !`, 'good');
      finCombat(false);
    } else {
      log(`Impossible de fuir !`, 'bad');
      const degE = Math.max(1, combat.att - J.def + Math.floor(Math.random()*3));
      J.vie = Math.max(0, J.vie - degE);
      log(`L'ennemi t'inflige ${degE} degats en fuyant.`, 'bad');
      updateUI();
      checkMort();
    }
  } else {
    // Berserkeur
    const berserkBonus = ((J.mutations||[]).includes('berserker') && J.vie < J.vieMax * 0.3) ? 1.15 : 1;
    let degJ = Math.max(1, Math.floor((J.att - combat.def + Math.floor(Math.random()*5)-2) * berserkBonus));
    // Bonus compagnon
    const bonusComp = compagnonEnCombat();
    if (bonusComp > 0) { degJ += bonusComp; log(`${J.compagnon ? J.compagnon.nom : 'Compagnon'} aide : +${bonusComp} degats !`,'good'); }
    combat.vie = Math.max(0, combat.vie - degJ);
    log(`Tu infliges ${degJ} degats. Ennemi : ${combat.vie} PV`, 'good');
    updateEnemyBar();

    if (combat.vie <= 0) {
      log(`${combat.nom} vaincu !`, 'good');
      finCombat(true);
      return;
    }

    const degE = Math.max(1, combat.att - J.def + Math.floor(Math.random()*5)-2);
    J.vie = Math.max(0, J.vie - degE);
    log(`L'ennemi t'inflige ${degE} degats. Vie : ${J.vie}/${J.vieMax}`, 'bad');
    updateUI();
    checkMort();
  }
}

function finCombat(victoire) {
  if (victoire) {
    gagnerXP(combat.xp);
    progresserQuete('combat','victoire',1);
    if (combat.nom && combat.nom.startsWith('Boss')) progresserQuete('tuer','boss',1);
    if ([1].includes(J.lieu)) progresserQuete('tuer','foret_animal',1);
    ajouterJournal(`${combat.nom} vaincu`);
    if (!J.stats) J.stats = {};
    J.stats.ennemisVaincus = (J.stats.ennemisVaincus||0) + 1;
    gagnerRep(1);
    lootRareNuit();
    // Régénération
    if ((J.mutations||[]).includes('regeneration')) { J.vie = Math.min(J.vieMax, J.vie + 2); log('💚 Régénération +2 vie.','good'); }
    // Mini-boss / Boss → affichage spécial
    if (combat.miniBoss) { log(`⚠️ MINI-BOSS vaincu ! Loot bonus !`, 'xp'); ajouter('capsules', 20); }
    if (combat.boss)     { log(`💀 BOSS vaincu ! Loot légendaire !`, 'xp'); }
    // Statuts aléatoires selon ennemi
    if (Math.random() < 0.1) ajouterStatut('poison',3);
    if (Math.random() < 0.08) ajouterStatut('saignement',2);
    if (combat.loot) {
      const loot = Array.isArray(combat.loot) ? combat.loot : [combat.loot];
      loot.forEach(item => {
        if (item === 'capsules') {
          const gain = Math.floor(Math.random()*20)+5;
          J.capsules += gain;
          log(`Butin : ${gain} capsules`, 'xp');
        } else {
          ajouter(item, 1);
          log(`Butin : ${item}`, 'xp');
        }
      });
    }
  }
  combat = null;
  document.getElementById('combat-screen').style.display = 'none';

  // Ennemis restants dans la file ?
  if (J.fileEnnemis && J.fileEnnemis.length > 0) {
    const restants = J.fileEnnemis.length;
    const prochain = J.fileEnnemis[0];
    const menu = document.getElementById('actions-menu');
    menu.style.display = 'block';
    menu.innerHTML = `
      <div style="background:#0d0000;border:1px solid var(--red);padding:10px;margin-bottom:8px;">
        <div style="font-family:'Oswald',sans-serif;color:var(--red2);margin-bottom:6px;">⚔ ${restants} ENNEMI(S) RESTANT(S)</div>
        <div style="font-size:11px;color:#aaa;">Prochain : <span style="color:var(--yellow)">${prochain.nom}</span> — ❤${prochain.vie} ⚔${prochain.att} 🛡${prochain.def}</div>
      </div>
      <button class="btn" style="border-left-color:var(--red);" onclick="lancerProchainCombat()">
        ⚔ AFFRONTER ${prochain.nom.toUpperCase()}
        <span class="btn-sub">Butin potentiel : ${prochain.loot || '?'}</span>
      </button>
      <button class="btn blue" style="margin-top:6px;" onclick="fuirTousCombats()">FUIR LES RESTANTS<span class="btn-sub">-20 vie</span></button>`;
  } else {
    J.fileEnnemis = [];
    resetActionsMenu();
  }
  updateUI();
  sauvegarder();
}

// ===== CARTE =====
// 0:Base 1:Foret 2:Lac 3:Marche 4:Village 5:Ferme 6:Entrepot 7:Station 8:Mine 9:Labo 10:Prison 11:Ville 12:Centrale 13:Hopital
const DISTANCES = [
//  0  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15
  [ 0, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 5, 4], // 0 Base
  [ 1, 0, 1, 2, 1, 1, 2, 2, 2, 3, 3, 2, 4, 3, 4, 3], // 1 Foret
  [ 1, 1, 0, 2, 2, 1, 2, 2, 3, 3, 3, 3, 4, 4, 5, 4], // 2 Lac
  [ 1, 2, 2, 0, 1, 2, 1, 1, 2, 2, 2, 2, 3, 3, 4, 3], // 3 Marche
  [ 2, 1, 2, 1, 0, 1, 1, 2, 2, 2, 2, 1, 3, 3, 4, 3], // 4 Village
  [ 2, 1, 1, 2, 1, 0, 2, 2, 2, 3, 3, 2, 4, 3, 4, 3], // 5 Ferme
  [ 2, 2, 2, 1, 1, 2, 0, 1, 1, 2, 2, 1, 2, 3, 3, 2], // 6 Entrepot
  [ 2, 2, 2, 1, 2, 2, 1, 0, 2, 2, 2, 1, 2, 3, 3, 2], // 7 Station
  [ 3, 2, 3, 2, 2, 2, 1, 2, 0, 1, 2, 2, 1, 2, 2, 1], // 8 Mine
  [ 3, 3, 3, 2, 2, 3, 2, 2, 1, 0, 1, 2, 1, 1, 1, 2], // 9 Labo
  [ 3, 3, 3, 2, 2, 3, 2, 2, 2, 1, 0, 1, 2, 2, 2, 1], // 10 Prison
  [ 3, 2, 3, 2, 1, 2, 1, 1, 2, 2, 1, 0, 2, 1, 2, 1], // 11 Ville
  [ 4, 4, 4, 3, 3, 4, 2, 2, 1, 1, 2, 2, 0, 1, 1, 2], // 12 Centrale
  [ 4, 3, 4, 3, 3, 3, 3, 3, 2, 1, 2, 1, 1, 0, 1, 2], // 13 Hopital
  [ 5, 4, 5, 4, 4, 4, 3, 3, 2, 1, 2, 2, 1, 1, 0, 2], // 14 Camp mil.
  [ 4, 3, 4, 3, 3, 3, 2, 2, 1, 2, 1, 1, 2, 2, 2, 0], // 15 Metro
];

const POSITIONS = [
  { x:0, y:1, icone:'🏕', couleur:'#27ae60' }, // 0 Base
  { x:1, y:0, icone:'🌲', couleur:'#2ecc71' }, // 1 Foret
  { x:1, y:2, icone:'🏞', couleur:'#3498db' }, // 2 Lac
  { x:2, y:0, icone:'🛒', couleur:'#9b59b6' }, // 3 Marche
  { x:2, y:1, icone:'🏚', couleur:'#f1c40f' }, // 4 Village
  { x:2, y:2, icone:'🚜', couleur:'#27ae60' }, // 5 Ferme
  { x:3, y:0, icone:'🏭', couleur:'#95a5a6' }, // 6 Entrepot
  { x:3, y:2, icone:'⛽', couleur:'#e67e22' }, // 7 Station
  { x:4, y:2, icone:'⛏', couleur:'#7f8c8d' }, // 8 Mine
  { x:5, y:0, icone:'🔬', couleur:'#1abc9c' }, // 9 Labo
  { x:5, y:1, icone:'🔒', couleur:'#e67e22' }, // 10 Prison
  { x:4, y:1, icone:'🏙', couleur:'#e74c3c' }, // 11 Ville
  { x:6, y:2, icone:'☢',  couleur:'#e74c3c' }, // 12 Centrale
  { x:6, y:0, icone:'🏥', couleur:'#c0392b' }, // 13 Hopital
  { x:7, y:0, icone:'🎖', couleur:'#7f8c8d' }, // 14 Camp militaire
  { x:5, y:2, icone:'🚇', couleur:'#2c3e50' }, // 15 Metro souterrain
];

function tempsVoyage(de, vers) {
  const dist = DISTANCES[de][vers];
  const temps = [0, 5, 15, 30, 45];
  return temps[dist] || 5;
}

function renderMiniCarte() {
  const cols = 8, rows = 3;
  const cellW = 44, cellH = 48;
  const W = cols * cellW, H = rows * cellH;
  let svg = `<svg width="${W}" height="${H}" style="display:block;margin:0 auto 10px;">`;

  // Lignes de connexion entre lieux proches (dist=1)
  for (let a = 0; a < LIEUX.length; a++) {
    for (let b = a+1; b < LIEUX.length; b++) {
      if (DISTANCES[a][b] === 1) {
        const pa = POSITIONS[a], pb = POSITIONS[b];
        const x1 = pa.x*cellW + cellW/2, y1 = pa.y*cellH + cellH/2;
        const x2 = pb.x*cellW + cellW/2, y2 = pb.y*cellH + cellH/2;
        svg += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#2a2a2a" stroke-width="1.5" stroke-dasharray="4,3"/>`;
      }
    }
  }

  // Points de lieux
  POSITIONS.forEach((pos, i) => {
    const cx = pos.x*cellW + cellW/2;
    const cy = pos.y*cellH + cellH/2;
    const estIci = J.lieu === i;
    const r = estIci ? 18 : 14;
    const estVisite2 = i === 0 || (J.lieuxVisites||[0]).includes(i);
    const opacite = estVisite2 ? 1 : 0.3;
    svg += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${estIci ? '#fff' : '#1a1a1a'}" stroke="${pos.couleur}" stroke-width="${estIci ? 3 : 2}" opacity="${opacite}"/>`;
    svg += `<text x="${cx}" y="${cy+5}" text-anchor="middle" font-size="14" opacity="${opacite}">${pos.icone}</text>`;
    if (estIci) svg += `<circle cx="${cx+12}" cy="${cy-12}" r="5" fill="#27ae60"/>`;
    // Indicateur danger 4 = skull
    if (!estIci && estVisite2 && LIEUX[i] && LIEUX[i].danger >= 4) {
      svg += `<text x="${cx-12}" y="${cy-10}" font-size="9">💀</text>`;
    }
  });

  svg += `</svg>`;

  // Légende
  svg += `<div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:10px;font-size:10px;">`;
  POSITIONS.forEach((pos, i) => {
    svg += `<span style="color:${pos.couleur}">${pos.icone} ${LIEUX[i].nom}</span>`;
  });
  svg += `</div>`;
  return svg;
}

function renderCarte() {
  const div = document.getElementById('carte-content');
  const couleurDanger = ['#27ae60','#f1c40f','#e67e22','#e74c3c','#c0392b'];
  const labelDanger   = ['Aucun','Faible','Moyen','Eleve','Tres eleve'];

  let html = `<div style="background:var(--bg2);border:1px solid var(--border);padding:10px;margin-bottom:10px;">
    <div style="font-family:'Oswald',sans-serif;color:var(--text2);font-size:11px;letter-spacing:2px;margin-bottom:8px;">CARTE</div>
    ${renderMiniCarte()}
  </div>`;

  LIEUX.forEach((lieu, i) => {
    const estIci      = J.lieu === i;
    const estVisite   = i === 0 || (J.lieuxVisites || [0]).includes(i);
    const estAdjacent = DISTANCES[J.lieu][i] === 1;
    const mins        = tempsVoyage(J.lieu, i);
    const cDanger     = couleurDanger[lieu.danger] || '#888';
    const lDanger     = labelDanger[lieu.danger]   || '?';
    const pos         = POSITIONS[i];

    // Lieu inconnu ET non adjacent = vraiment inaccessible
    if (!estVisite && !estIci && !estAdjacent) {
      html += `
        <div class="lieu-card" style="opacity:0.25;filter:grayscale(1);">
          <div class="lieu-header">
            <div class="lieu-name" style="color:#444;">🌫 ZONE INCONNUE</div>
          </div>
          <div class="lieu-desc" style="padding:6px 12px 8px;color:#333;">Trop loin pour être explore depuis ici.</div>
        </div>`;
      return;
    }

    // Lieu inconnu mais adjacent = on peut y aller pour le découvrir
    if (!estVisite && !estIci && estAdjacent) {
      html += `
        <div class="lieu-card" style="opacity:0.55;filter:grayscale(0.6);border-left-color:#555;">
          <div class="lieu-header">
            <div class="lieu-name" style="color:#666;">❓ LIEU INCONNU</div>
            <span style="color:#555;font-size:11px;">⚠ ${lDanger}</span>
          </div>
          <div class="lieu-desc" style="padding:6px 12px 4px;color:#555;">Zone inexplorée. Voyage pour la découvrir.</div>
          <div class="lieu-footer">
            <button class="btn" style="margin:0;border-left-color:#555;" onclick="confirmerVoyage(${i})">
              🌫 EXPLORER CE LIEU
              <span class="btn-sub" style="display:flex;justify-content:space-between;">
                <span>Trajet : ~${mins} min</span>
                <span style="color:${cDanger}">Danger : ${lDanger}</span>
              </span>
            </button>
          </div>
        </div>`;
      return;
    }

    html += `
      <div class="lieu-card" style="${estIci ? 'border:1px solid var(--green)' : ''}">
        <div class="lieu-header">
          <div class="lieu-name" style="color:${pos.couleur}">${pos.icone} ${lieu.nom.toUpperCase()}</div>
          <div style="display:flex;align-items:center;gap:8px;">
            ${estIci
              ? '<span class="lieu-current">VOUS ETES ICI</span>'
              : `<span style="color:${cDanger};font-size:11px;">⚠ ${lDanger}</span>`}
            <button onclick="voirEnnemis(${i})" style="background:#1a1a1a;border:1px solid #444;color:#aaa;font-family:'Share Tech Mono',monospace;font-size:10px;padding:3px 7px;cursor:pointer;">ENNEMIS</button>
          </div>
        </div>
        <div class="lieu-desc" style="padding:6px 12px 4px;">${lieu.desc}</div>
        <div style="padding:4px 12px 8px;font-size:11px;color:var(--text2);">
          Ressources : <span style="color:var(--text)">${lieu.ressources.filter((v,i,a)=>a.indexOf(v)===i).join(', ')}</span>
        </div>
        <div class="lieu-footer">
          ${estIci
            ? `<div style="color:var(--green);font-size:11px;padding:4px 0;">Tu es ici — utilise ACTIONS pour fouiller${lieu.marchand ? ' | <button onclick="showTab(\'actions\');ouvrirMarchand()" style="background:#1a001a;border:1px solid #9b59b6;color:#9b59b6;font-family:\'Share Tech Mono\',monospace;font-size:10px;padding:3px 8px;cursor:pointer;margin-left:4px;">🛒 MARCHAND</button>' : ''}</div>`
            : `<button class="btn" style="margin:0;" onclick="confirmerVoyage(${i})">
                VOYAGER ICI
                <span class="btn-sub" style="display:flex;justify-content:space-between;">
                  <span>Trajet : ~${mins} min</span>
                  <span style="color:${cDanger}">Danger : ${lDanger}</span>
                </span>
               </button>`
          }
        </div>
      </div>`;
  });

  div.innerHTML = html;
}

function confirmerVoyage(idx) {
  if (J.actionEnCours) { log(`Une action est deja en cours.`, 'warn'); return; }
  const lieu  = LIEUX[idx];
  const mins  = tempsVoyage(J.lieu, idx);
  const duree = mins / 60;
  const labelDanger = ['Aucun','Faible','Moyen','Eleve','Tres eleve'];
  popup(
    `VOYAGER VERS ${lieu.nom.toUpperCase()}`,
    `Temps de trajet : ~${mins} minutes\nDanger a destination : ${labelDanger[lieu.danger]}\nRessources disponibles : ${lieu.ressources.join(', ')}\n\nTu peux fermer l'appli pendant le voyage.`,
    false,
    `lancerVoyage(${idx})`
  );
}

function lancerVoyage(idx) {
  closePopup();
  const mins  = tempsVoyage(J.lieu, idx);
  const duree = mins / 60;
  log(`Voyage lance vers ${LIEUX[idx].nom} (~${mins}min).`, 'info');
  lancerActionDifferee('voyage', duree, { destination: idx });
  showTab('actions');
  renderTimerAction();
}

function voirEnnemis(lieuIdx) {
  const lieu = LIEUX[lieuIdx];
  const pos  = POSITIONS[lieuIdx];
  const liste = ENNEMIS_LIEUX[lieuIdx];

  document.getElementById('popup-title').textContent = `${pos.icone} ${lieu.nom.toUpperCase()} — ENNEMIS`;

  if (!liste || liste.length === 0) {
    document.getElementById('popup-content').innerHTML = `<span style="color:var(--green)">Aucun ennemi connu dans ce lieu.</span>`;
  } else {
    const coulNiv = ['','#27ae60','#f1c40f','#e67e22','#e74c3c','#c0392b','#ff0000','#ff0000','#ff0000','#ff0000'];
    let html = '';
    liste.forEach(e => {
      const niv = e.niv || e.niveau || 1;
      const cn = coulNiv[Math.min(niv, coulNiv.length-1)];
      html += `
        <div style="background:#0d0d0d;border:1px solid #2a2a2a;border-left:3px solid ${cn};padding:8px 10px;margin-bottom:8px;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
            <span style="font-family:'Oswald',sans-serif;color:${cn};font-size:14px;letter-spacing:1px;">${e.nom.toUpperCase()}</span>
            <span style="color:${cn};font-size:11px;">Niv. ${niv}</span>
          </div>
          <div style="color:#888;font-size:11px;margin-bottom:6px;font-style:italic;">${e.desc}</div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px;font-size:11px;">
            <span style="color:#e74c3c">❤ Vie : ${e.vie}</span>
            <span style="color:#e67e22">⚔ ATT : ${e.att}</span>
            <span style="color:#2980b9">🛡 DEF : ${e.def}</span>
            <span style="color:#f1c40f">⭐ XP : ${e.xp}</span>
          </div>
          <div style="margin-top:5px;font-size:11px;color:#aaa;">Butin : <span style="color:var(--yellow)">${Array.isArray(e.butin) ? e.butin.join(', ') : e.butin}</span></div>
        </div>`;
    });
    document.getElementById('popup-content').innerHTML = html;
  }

  const btnZone = document.getElementById('popup-btn-zone');
  btnZone.innerHTML = `<button onclick="closePopup()" style="width:100%;padding:11px;background:#1a1a1a;border:1px solid #444;color:#aaa;font-family:'Share Tech Mono',monospace;font-size:13px;cursor:pointer;">FERMER</button>`;
  document.getElementById('popup-overlay').classList.add('show');
}

function voyager(idx) { confirmerVoyage(idx); }

// ===== MARCHAND =====
const CATALOGUE_MARCHAND = [
  { nom:"Nourriture x3",   item:"nourriture",  qte:3, prix:15,  icone:"🍖" },
  { nom:"Eau x3",          item:"eau",         qte:3, prix:10,  icone:"💧" },
  { nom:"Bandage x2",      item:"bandage",     qte:2, prix:20,  icone:"🩹" },
  { nom:"Medicament",      item:"medicament",  qte:1, prix:35,  icone:"💊" },
  { nom:"Metal x3",        item:"metal",       qte:3, prix:25,  icone:"⚙" },
  { nom:"Bois x5",         item:"bois",        qte:5, prix:15,  icone:"🪵" },
  { nom:"Cuir x2",         item:"cuir",        qte:2, prix:20,  icone:"🟤" },
  { nom:"Corde x2",        item:"corde",       qte:2, prix:12,  icone:"🪢" },
  { nom:"Carburant",       item:"carburant",   qte:1, prix:30,  icone:"⛽" },
  { nom:"Arme basique",    item:"arme",        qte:1, prix:80,  icone:"🔫" },
  { nom:"Serum",           item:"serum",       qte:1, prix:100, icone:"🧪" },
  { nom:"Cristal",         item:"cristal",     qte:1, prix:120, icone:"💎" },
  { nom:"Vetement",        item:"vetement",    qte:1, prix:18,  icone:"👕" },
];

// Articles a vendre au marchand
const VENTE_MARCHAND = [
  { nom:"Nourriture",   item:"nourriture",  prix:5  },
  { nom:"Eau",          item:"eau",         prix:3  },
  { nom:"Bois",         item:"bois",        prix:3  },
  { nom:"Cuir",         item:"cuir",        prix:8  },
  { nom:"Metal",        item:"metal",       prix:10 },
  { nom:"Carburant",    item:"carburant",   prix:12 },
  { nom:"Medicament",   item:"medicament",  prix:15 },
  { nom:"Bandage",      item:"bandage",     prix:8  },
  { nom:"Arme",         item:"arme",        prix:30 },
  { nom:"Serum",        item:"serum",       prix:45 },
  { nom:"Cristal",      item:"cristal",     prix:60 },
  { nom:"Vetement",     item:"vetement",    prix:7  },
  { nom:"Charbon",      item:"charbon",     prix:6  },
  { nom:"Pierre",       item:"pierre",      prix:4  },
];

function ouvrirMarchand() {
  showTab('actions');
  const menu = document.getElementById('actions-menu');

  let html = `<button class="btn" style="border-left-color:var(--text2);margin-bottom:10px;" onclick="resetActionsMenu()">← FERMER MARCHAND</button>
  <div style="background:#0d000d;border:1px solid #9b59b6;padding:10px;margin-bottom:10px;">
    <div style="font-family:'Oswald',sans-serif;color:#9b59b6;font-size:15px;letter-spacing:2px;margin-bottom:4px;">🛒 MARCHAND</div>
    <div style="font-size:11px;color:var(--text2);">Capsules : <span style="color:var(--yellow);font-weight:bold;">${J.capsules} 💊</span></div>
  </div>

  <div style="font-family:'Oswald',sans-serif;color:var(--yellow);font-size:12px;letter-spacing:2px;margin-bottom:6px;">ACHETER</div>`;

  CATALOGUE_MARCHAND.forEach((art, i) => {
    const peutAcheter = J.capsules >= art.prix;
    html += `<div style="display:flex;align-items:center;justify-content:space-between;background:#111;border:1px solid #222;padding:7px 10px;margin-bottom:4px;">
      <div>
        <span style="font-size:14px;">${art.icone}</span>
        <span style="color:var(--text);font-size:12px;margin-left:6px;">${art.nom}</span>
      </div>
      <div style="display:flex;align-items:center;gap:8px;">
        <span style="color:var(--yellow);font-size:11px;">${art.prix} 💊</span>
        <button onclick="acheterMarchand(${i})" ${peutAcheter?'':'disabled'} style="background:${peutAcheter?'#0d1a0d':'#111'};border:1px solid ${peutAcheter?'var(--green)':'#333'};color:${peutAcheter?'var(--green)':'#444'};font-size:10px;padding:3px 8px;cursor:${peutAcheter?'pointer':'default'};font-family:'Share Tech Mono',monospace;">ACHETER</button>
      </div>
    </div>`;
  });

  html += `<div style="font-family:'Oswald',sans-serif;color:#e67e22;font-size:12px;letter-spacing:2px;margin:10px 0 6px;">VENDRE</div>`;

  let hasItems = false;
  VENTE_MARCHAND.forEach((art, i) => {
    const qte = J.inventaire[art.item] || 0;
    if (qte > 0) {
      hasItems = true;
      html += `<div style="display:flex;align-items:center;justify-content:space-between;background:#111;border:1px solid #222;padding:7px 10px;margin-bottom:4px;">
        <div style="color:var(--text);font-size:12px;">${art.nom} <span style="color:var(--text2);">(x${qte})</span></div>
        <div style="display:flex;align-items:center;gap:8px;">
          <span style="color:var(--yellow);font-size:11px;">${art.prix} 💊/u</span>
          <button onclick="vendreMarchand('${art.item}',${art.prix})" style="background:#1a0d00;border:1px solid var(--yellow);color:var(--yellow);font-size:10px;padding:3px 8px;cursor:pointer;font-family:'Share Tech Mono',monospace;">VENDRE</button>
        </div>
      </div>`;
    }
  });
  if (!hasItems) html += `<div style="color:var(--text2);font-size:11px;padding:6px;">Rien a vendre dans ton inventaire.</div>`;

  menu.innerHTML = html;
  menu.style.display = 'block';
}

function acheterMarchand(idx) {
  const art = CATALOGUE_MARCHAND[idx];
  if (J.capsules < art.prix) { log('Pas assez de capsules.','warn'); return; }
  J.capsules -= art.prix;
  ajouter(art.item, art.qte);
  log(`Achete : ${art.nom} pour ${art.prix} capsules.`, 'good');
  sauvegarder(); updateUI(); ouvrirMarchand();
}

function vendreMarchand(item, prix) {
  if (!J.inventaire[item] || J.inventaire[item] <= 0) { log('Plus rien a vendre.','warn'); return; }
  J.inventaire[item]--;
  if (!J.inventaire[item]) delete J.inventaire[item];
  J.capsules += prix;
  log(`Vendu : ${item} pour ${prix} capsules.`, 'good');
  progresserQuete('vendre','objet',1);
  if (!J.stats) J.stats = {};
  J.stats.ventesTotal = (J.stats.ventesTotal||0) + 1;
  gagnerRep(1);
  sauvegarder(); updateUI(); ouvrirMarchand();
}

// ===== BASE =====
const BATIMENTS = {
  feu:        { nom: "Feu de camp",  icone: "🔥", desc: "Permet de cuire la nourriture brute.",        cout: null, reqNiveau: 1 },
  cuisine:    { nom: "Cuisine",      icone: "🍳", desc: "Transforme viande et ingredients en repas.",   cout: { bois: 5, metal: 2 },      reqNiveau: 1 },
  ferme:      { nom: "Ferme",        icone: "🌱", desc: "Produit de la nourriture chaque jour.",        cout: { bois: 8, eau: 5 },         reqNiveau: 2 },
  infirmerie: { nom: "Infirmerie",   icone: "🏥", desc: "Soigne +20 vie une fois par jour.",            cout: { bois: 6, medicament: 3 },  reqNiveau: 2 },
  habitation: { nom: "Habitations",  icone: "🏠", desc: "Accueille jusqu'a 5 habitants par niveau.",   cout: { bois: 10, metal: 4 },      reqNiveau: 1 },
  atelier:    { nom: "Atelier",      icone: "🔧", desc: "Permet de fabriquer des armes et outils.",    cout: { metal: 8, bois: 4 },       reqNiveau: 2 },
  rempart:    { nom: "Rempart",      icone: "🛡", desc: "+10 defense par niveau. Reduit les raids.",   cout: { metal: 10, bois: 6 },      reqNiveau: 3 },
};

const RECETTES_CUISINE = [
  { nom: "Viande cuite",    ingredients: { nourriture: 1 },               resultat: "repas",          desc: "Nourriture brute -> repas (+50 faim)" },
  { nom: "Repas complet",   ingredients: { nourriture: 2, eau: 1 },       resultat: "repas_complet",  desc: "Repas nutritif (+80 faim, +20 vie)" },
  { nom: "Bouillon",        ingredients: { nourriture: 1, eau: 2 },       resultat: "bouillon",       desc: "Soin leger (+30 vie, +30 soif)" },
  { nom: "Cuir traite",     ingredients: { cuir: 2, eau: 1 },             resultat: "cuir_traite",    desc: "Cuir transforme pour craft" },
];

// ===== CRAFT =====
// reqAtelier: false = craftable à la main, true = nécessite atelier construit
const RECETTES_CRAFT = [
  // --- CRAFT DE BASE (sans atelier) ---
  { nom: "Bandage artisanal",  icone:"🩹", ingredients: { vetement: 1 },              resultat: "bandage",       qte: 2, desc: "+30 vie quand utilise",          reqAtelier: false },
  { nom: "Corde",              icone:"🪢", ingredients: { vetement: 2 },              resultat: "corde",         qte: 2, desc: "Materiau de craft polyvalent",    reqAtelier: false },
  { nom: "Baton de combat",    icone:"🪵", ingredients: { bois: 3 },                  resultat: "baton",         qte: 1, desc: "+4 ATT, arme de base en bois",   reqAtelier: false },
  { nom: "Gilet en cuir",      icone:"🧥", ingredients: { cuir: 3 },                  resultat: "gilet_cuir",    qte: 1, desc: "+5 DEF, protection legere",      reqAtelier: false },
  { nom: "Bouclier en bois",   icone:"🛡", ingredients: { bois: 5, corde: 1 },        resultat: "bouclier_bois", qte: 1, desc: "+3 DEF",                         reqAtelier: false },
  { nom: "Lance en bois",      icone:"🗡", ingredients: { bois: 4, corde: 1 },        resultat: "lance_bois",    qte: 1, desc: "+3 ATT",                         reqAtelier: false },
  { nom: "Piege simple",       icone:"🪤", ingredients: { bois: 3, metal: 1 },        resultat: "piege",         qte: 1, desc: "Capture des animaux en foret",   reqAtelier: false },
  { nom: "Torche",             icone:"🔦", ingredients: { bois: 2 },                  resultat: "torche",        qte: 1, desc: "Eclaire les zones sombres",      reqAtelier: false },

  // --- CRAFT ATELIER ---
  { nom: "Couteau de chasse",  icone:"🔪", ingredients: { metal: 3, cuir: 1 },        resultat: "couteau",       qte: 1, desc: "+6 ATT permanent",               reqAtelier: true },
  { nom: "Armure en cuir",     icone:"🥋", ingredients: { cuir: 5, corde: 2 },        resultat: "armure_cuir",   qte: 1, desc: "+8 DEF permanent",               reqAtelier: true },
  { nom: "Hache de combat",    icone:"🪓", ingredients: { metal: 5, bois: 3 },        resultat: "hache",         qte: 1, desc: "+10 ATT permanent",              reqAtelier: true },
  { nom: "Armure metallique",  icone:"⚔️", ingredients: { metal: 8, cuir: 3 },        resultat: "armure_metal",  qte: 1, desc: "+15 DEF permanent",              reqAtelier: true },
  { nom: "Arc",                icone:"🏹", ingredients: { bois: 6, corde: 3, cuir: 2 },resultat: "arc",          qte: 1, desc: "+12 ATT, attaque a distance",    reqAtelier: true },
  { nom: "Trousse medicale",   icone:"💊", ingredients: { bandage: 3, metal: 2 },     resultat: "trousse",       qte: 1, desc: "Soigne +60 vie",                  reqAtelier: true },
  { nom: "Piege metallique",   icone:"⚙️", ingredients: { metal: 4, corde: 2 },        resultat: "piege_metal",   qte: 1, desc: "Piege puissant",                  reqAtelier: true },
  { nom: "Arme lourde",        icone:"🔫", ingredients: { metal:12, arme:2, cristal:1 }, resultat: "arme_lourde",   qte: 1, desc: "+20 ATT — Arme legendaire de combat", reqAtelier: true, reqNiveau:8 },
  { nom: "Armure nucleaire",   icone:"☢️", ingredients: { metal:10, cristal:3, cuir:4 }, resultat: "armure_nucleaire",qte: 1, desc: "+25 DEF — Protection maximale",      reqAtelier: true, reqNiveau:10},
  { nom: "Serum de mutation",  icone:"🧬", ingredients: { serum:3, produit_chimique:2 }, resultat: "serum_mutation", qte: 1, desc: "Applique une mutation aleatoire",     reqAtelier: true, reqNiveau:6 },
];

// Effets des objets craftés — utilise le système de rareté
const EFFETS_CRAFT = {
  bandage:      () => { J.vie = Math.min(J.vieMax, J.vie + 30); log('+30 vie.', 'good'); },
  trousse:      () => { J.vie = Math.min(J.vieMax, J.vie + 60); J.statuts=[]; log('Trousse : +60 vie, statuts annulés.', 'good'); },
  baton:        () => equiperAvecRarete('baton'),
  lance_bois:   () => equiperAvecRarete('lance_bois'),
  gilet_cuir:   () => equiperAvecRarete('gilet_cuir'),
  bouclier_bois:() => equiperAvecRarete('bouclier_bois'),
  couteau:      () => equiperAvecRarete('couteau'),
  armure_cuir:  () => equiperAvecRarete('armure_cuir'),
  hache:        () => equiperAvecRarete('hache'),
  armure_metal: () => equiperAvecRarete('armure_metal'),
  arc:             () => equiperAvecRarete('arc'),
  arme_lourde:     () => equiperAvecRarete('arme_lourde'),
  armure_nucleaire:() => { J.def += 25; J.armureEquipee = 'Armure Nucléaire [ÉPIQUE]'; log('Armure nucléaire : +25 DEF !','xp'); },
  serum_mutation:  () => {
    const dispo = TOUTES_MUTATIONS.filter(m => !(J.mutations||[]).includes(m.id));
    if (dispo.length === 0) { log('Toutes les mutations déjà acquises !','warn'); return; }
    const m = dispo[Math.floor(Math.random()*dispo.length)];
    J.mutations = J.mutations || [];
    J.mutations.push(m.id);
    if (m.id === 'titan')    { J.vieMax += 50; J.vie = Math.min(J.vieMax, J.vie+50); }
    if (m.id === 'iron_skin'){ J.def = Math.max(J.def, 5); }
    log(`🧬 Mutation aléatoire : ${m.icone} ${m.nom} ! ${m.desc}`, 'xp');
  },
};

function ouvrirCraft() {
  const aAtelier = J.base && J.base.atelier;
  const coulBase = '#95a5a6', coulAtelier = '#f39c12';

  let html = `<button class="btn" style="border-left-color:var(--text2);margin-bottom:10px;" onclick="resetActionsMenu()">← ANNULER</button>
  <div style="margin-bottom:8px;font-size:11px;color:var(--text2);">
    ${aAtelier
      ? `<span style="color:var(--green)">🔧 Atelier construit — toutes les recettes disponibles</span>`
      : `<span style="color:var(--yellow)">⚠ Sans atelier : craft de base seulement. Construis l'atelier pour l'equip. superieur.</span>`}
  </div>`;

  // Base
  html += `<div style="font-family:'Oswald',sans-serif;color:${coulBase};font-size:12px;letter-spacing:2px;margin-bottom:6px;">CRAFT DE BASE</div>`;
  RECETTES_CRAFT.filter(r => !r.reqAtelier).forEach((r, i) => {
    html += renderRecetteCraft(r, i, false);
  });

  // Atelier
  html += `<div style="font-family:'Oswald',sans-serif;color:${coulAtelier};font-size:12px;letter-spacing:2px;margin:10px 0 6px;">ATELIER${aAtelier ? '' : ' 🔒 (necessite atelier)'}</div>`;
  RECETTES_CRAFT.filter(r => r.reqAtelier).forEach((r, i) => {
    html += renderRecetteCraft(r, i + 100, !aAtelier);
  });

  document.getElementById('actions-menu').innerHTML = html;
}

function renderRecetteCraft(r, idx, locked) {
  // Vérifier niveau requis
  if (r.reqNiveau && J.niveau < r.reqNiveau) locked = true;
  const manque = verifierCout(r.ingredients);
  const coutStr = Object.entries(r.ingredients).map(([k,v]) => `${v} ${k}`).join(' + ');
  const peutCrafter = !locked && !manque;
  const couleur = locked ? '#333' : peutCrafter ? 'var(--green)' : 'var(--red2)';
  return `
    <div style="background:#111;border:1px solid #222;border-left:3px solid ${couleur};padding:8px 10px;margin-bottom:6px;${locked?'opacity:0.5':''}">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:3px;">
        <span style="font-family:'Oswald',sans-serif;color:${locked?'#444':'var(--text)'};font-size:13px;">${r.icone} ${r.nom}</span>
        ${peutCrafter ? `<button onclick="crafter(${RECETTES_CRAFT.indexOf(r)})" style="background:#0d1a0d;border:1px solid var(--green);color:var(--green);font-size:10px;padding:3px 8px;cursor:pointer;font-family:'Share Tech Mono',monospace;">CRAFT</button>` : ''}
      </div>
      <div style="font-size:10px;color:var(--text2);margin-bottom:2px;">${r.desc}</div>
      <div style="font-size:10px;color:${manque && !locked ? 'var(--red2)' : '#666'};">${coutStr}${manque && !locked ? ' — Manque: '+manque : ''}</div>
    </div>`;
}

function crafter(idx) {
  const r = RECETTES_CRAFT[idx];
  if (!r) return;
  if (r.reqAtelier && !(J.base && J.base.atelier)) { log('Necessite un atelier.', 'warn'); return; }
  const manque = verifierCout(r.ingredients);
  if (manque) { log('Ingredients insuffisants : ' + manque, 'warn'); return; }
  consommerCout(r.ingredients);
  J.inventaire[r.resultat] = (J.inventaire[r.resultat] || 0) + r.qte;
  log(`Craft : ${r.nom} x${r.qte} fabrique !`, 'good');
  progresserQuete('craft','objet',1);
  ajouterJournal(`Craft : ${r.nom}`);
  if (!J.stats) J.stats = {};
  J.stats.objectsCraftes = (J.stats.objectsCraftes||0) + 1;
  // Mémoriser équipement
  const armesIds = ['baton','lance_bois','couteau','hache','arc'];
  const armuresIds = ['gilet_cuir','bouclier_bois','armure_cuir','armure_metal'];
  if (armesIds.includes(r.resultat)) equiperArme(r.resultat);
  if (armuresIds.includes(r.resultat)) equiperArmure(r.resultat);

  // Equiper automatiquement si c'est une arme/armure
  if (EFFETS_CRAFT[r.resultat]) {
    EFFETS_CRAFT[r.resultat]();
    J.inventaire[r.resultat]--;
    if (!J.inventaire[r.resultat]) delete J.inventaire[r.resultat];
  }
  sauvegarder();
  updateUI();
  ouvrirCraft(); // rafraîchir la liste
}

function renderPlanBase() {
  const b = J.base;
  const W = 320, H = 220;

  // Positions fixes des éléments sur le plan
  const PLAN = [
    { id: 'caravane', x: 130, y: 90,  w: 60, h: 40, icone: '🚌', nom: 'Caravane',   couleur: '#27ae60', toujours: true },
    { id: 'feu',      x: 80,  y: 110, w: 30, h: 30, icone: '🔥', nom: 'Feu',        couleur: '#e67e22', batiment: 'feu' },
    { id: 'cuisine',  x: 55,  y: 60,  w: 40, h: 35, icone: '🍳', nom: 'Cuisine',    couleur: '#f39c12', batiment: 'cuisine' },
    { id: 'ferme',    x: 10,  y: 130, w: 50, h: 40, icone: '🌱', nom: 'Ferme',      couleur: '#2ecc71', batiment: 'ferme' },
    { id: 'habitation',x:200, y: 55,  w: 55, h: 45, icone: '🏠', nom: 'Habit.',     couleur: '#3498db', batiment: 'habitation' },
    { id: 'infirmerie',x:200, y: 115, w: 55, h: 40, icone: '🏥', nom: 'Infirm.',    couleur: '#e74c3c', batiment: 'infirmerie' },
    { id: 'atelier',  x: 125, y: 155, w: 50, h: 35, icone: '🔧', nom: 'Atelier',    couleur: '#95a5a6', batiment: 'atelier' },
    { id: 'rempart',  x: 5,   y: 5,   w: W-10, h: H-10, icone: '🛡', nom: 'Rempart', couleur: '#7f8c8d', batiment: 'rempart', estMur: true },
  ];

  // Futures bases
  const FUTURES = [
    { nom: 'Maison',        reqNiv: 3,  icone: '🏡', desc: 'Deb.: Niv.3 base + 50 bois + 30 metal' },
    { nom: 'Village',       reqNiv: 5,  icone: '🏘', desc: 'Deb.: Niv.5 base + pop 10+ + ressources' },
    { nom: 'Forteresse',    reqNiv: 8,  icone: '🏰', desc: 'Deb.: Niv.8 base + rempart max + alliance' },
    { nom: 'Ville',         reqNiv: 12, icone: '🌆', desc: 'Fin de jeu : base ultime, pop 50+' },
  ];

  let svg = `<svg width="${W}" height="${H}" style="display:block;background:#0a0a0a;border:1px solid #2a2a2a;margin-bottom:10px;">`;

  // Sol / terrain
  svg += `<rect x="0" y="0" width="${W}" height="${H}" fill="#0d0d0d"/>`;
  // Chemin central
  svg += `<rect x="110" y="85" width="100" height="50" rx="2" fill="#1a1500" opacity="0.5"/>`;
  // Herbe/zone verte
  svg += `<rect x="0" y="120" width="80" height="70" rx="4" fill="#0a1a0a" opacity="0.6"/>`;

  PLAN.forEach(el => {
    const construit = el.toujours || (el.batiment && b[el.batiment]);
    const futur = el.batiment && !construit;

    if (el.estMur) {
      if (construit) {
        svg += `<rect x="${el.x}" y="${el.y}" width="${el.w}" height="${el.h}" rx="4" fill="none" stroke="${el.couleur}" stroke-width="4" opacity="0.6"/>`;
        svg += `<text x="${W/2}" y="18" text-anchor="middle" fill="${el.couleur}" font-size="10" opacity="0.8">REMPART</text>`;
      } else {
        svg += `<rect x="${el.x}" y="${el.y}" width="${el.w}" height="${el.h}" rx="4" fill="none" stroke="#2a2a2a" stroke-width="2" stroke-dasharray="6,4"/>`;
      }
      return;
    }

    if (construit) {
      // Bâtiment construit
      svg += `<rect x="${el.x}" y="${el.y}" width="${el.w}" height="${el.h}" rx="3" fill="#1a1a1a" stroke="${el.couleur}" stroke-width="2"/>`;
      svg += `<text x="${el.x + el.w/2}" y="${el.y + el.h/2 - 4}" text-anchor="middle" font-size="14">${el.icone}</text>`;
      svg += `<text x="${el.x + el.w/2}" y="${el.y + el.h - 4}" text-anchor="middle" fill="${el.couleur}" font-size="8">${el.nom}</text>`;
    } else {
      // Emplacement vide / futur
      svg += `<rect x="${el.x}" y="${el.y}" width="${el.w}" height="${el.h}" rx="3" fill="#111" stroke="#2a2a2a" stroke-width="1" stroke-dasharray="4,3"/>`;
      svg += `<text x="${el.x + el.w/2}" y="${el.y + el.h/2 + 4}" text-anchor="middle" fill="#333" font-size="16">+</text>`;
    }
  });

  svg += `</svg>`;

  // Légende
  svg += `<div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:10px;font-size:10px;color:var(--text2);">
    <span style="color:#27ae60">■ Construit</span>
    <span style="color:#333">■ Disponible</span>
    <span style="color:#2a2a2a">▪ Futur</span>
  </div>`;

  // Futures bases
  svg += `<div class="section-title" style="margin-bottom:8px;">EVOLUTIONS FUTURES</div>`;
  FUTURES.forEach(f => {
    const dispo = b.niveau >= f.reqNiv;
    svg += `<div style="display:flex;align-items:center;gap:10px;padding:8px 10px;background:var(--bg3);border:1px solid ${dispo ? 'var(--yellow)' : 'var(--border)'};margin-bottom:6px;opacity:${dispo ? 1 : 0.5};">
      <span style="font-size:20px;">${f.icone}</span>
      <div>
        <div style="font-family:'Oswald',sans-serif;color:${dispo ? 'var(--yellow)' : 'var(--text2)'};font-size:13px;">${f.nom.toUpperCase()}</div>
        <div style="font-size:10px;color:var(--text2);">${f.desc}</div>
      </div>
      ${dispo ? '<span style="margin-left:auto;color:var(--green);font-size:10px;">DISPONIBLE</span>' : `<span style="margin-left:auto;color:var(--text2);font-size:10px;">Niv.${f.reqNiv}</span>`}
    </div>`;
  });

  return svg;
}

function renderBase() {
  if (!J.base) J.base = newJoueur('').base; // compat save ancienne
  const b = J.base;
  const div = document.getElementById('base-content');

  // Header base
  const coutUpgrade = coutUpgradeBase(b.niveau);
  const manqueUpgrade = verifierCout(coutUpgrade);
  const coutStr = Object.entries(coutUpgrade).map(([k,v])=>`${v} ${k}`).join(', ');

  let html = `
    <div class="profil-card" style="margin-bottom:10px;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
        <div style="font-family:'Oswald',sans-serif;color:var(--white);font-size:18px;">CAMPEMENT NIV.${b.niveau}</div>
        <div style="color:var(--yellow);font-size:12px;">DEF: ${calculerDefense()}</div>
      </div>
      <div style="margin-bottom:8px;">
        <div style="font-size:10px;color:var(--text2);margin-bottom:4px;">AMELIORATION BASE — Cout : <span style="color:${manqueUpgrade ? 'var(--red2)' : 'var(--yellow)'}">${coutStr}</span></div>
        <button class="btn ${manqueUpgrade ? '' : 'green'}" style="margin:0;padding:8px;" onclick="upgradeBase()" ${manqueUpgrade ? 'disabled style="opacity:0.5"' : ''}>
          AUGMENTER NIV. BASE → ${b.niveau + 1}
          <span class="btn-sub">${manqueUpgrade ? 'Manque : ' + manqueUpgrade : 'Deverrouille de nouveaux batiments'}</span>
        </button>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;text-align:center;">
        <div style="background:var(--bg3);padding:6px;border:1px solid var(--border);">
          <div style="font-family:'Oswald',sans-serif;color:var(--green);font-size:16px;">${b.population}</div>
          <div style="color:var(--text2);font-size:10px;">HABITANTS</div>
        </div>
        <div style="background:var(--bg3);padding:6px;border:1px solid var(--border);">
          <div style="font-family:'Oswald',sans-serif;color:var(--blue);font-size:16px;">${b.popMax}</div>
          <div style="color:var(--text2);font-size:10px;">PLACES DISPO</div>
        </div>
        <div style="background:var(--bg3);padding:6px;border:1px solid var(--border);">
          <div style="font-family:'Oswald',sans-serif;color:var(--red2);font-size:16px;">${calculerDefense()}</div>
          <div style="color:var(--text2);font-size:10px;">DEFENSE</div>
        </div>
      </div>
    </div>`;

  // Raccourcis rapides
  html += `<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:10px;">
    <button class="btn yellow" style="margin:0;padding:8px;" onclick="renderQuetes()">📋 QUETES<span class="btn-sub">${(J.quetes||[]).length} actives</span></button>
    <button class="btn blue" style="margin:0;padding:8px;" onclick="renderJournal()">📖 JOURNAL<span class="btn-sub">${(J.journal||[]).length} entrees</span></button>
    <button class="btn green" style="margin:0;padding:8px;" onclick="renderStock()">📦 STOCK<span class="btn-sub">Ressources base</span></button>
    <button class="btn" style="margin:0;padding:8px;border-left-color:#9b59b6;" onclick="renderRolesHabitants()">👥 ROLES<span class="btn-sub">Gerer habitants</span></button>
  </div>`;

  // Plan de la base
  html += renderPlanBase();

  // Section bâtiments
  html += `<div class="section-title" style="margin-bottom:8px;">BATIMENTS</div>`;
  Object.entries(BATIMENTS).forEach(([id, bat]) => {
    const niv = b[id];
    const construit = niv !== null && niv !== undefined;
    const peutConstruire = !construit && b.niveau >= bat.reqNiveau;
    const couleur = construit ? 'var(--green)' : peutConstruire ? 'var(--yellow)' : 'var(--text2)';
    const coutStr = bat.cout ? Object.entries(bat.cout).map(([k,v])=>`${v} ${k}`).join(', ') : 'Gratuit';
    const manque  = bat.cout ? verifierCout(bat.cout) : null;

    html += `
      <div style="background:var(--bg3);border:1px solid var(--border);border-left:3px solid ${couleur};padding:10px 12px;margin-bottom:8px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
          <div style="font-family:'Oswald',sans-serif;color:${couleur};font-size:14px;">${bat.icone} ${bat.nom.toUpperCase()}${construit ? ' — NIV.'+niv : ''}</div>
          ${construit && id !== 'feu' ? `<button onclick="ameliorerBatiment('${id}')" style="background:#0d1a0d;border:1px solid var(--green);color:var(--green);font-size:10px;padding:3px 7px;cursor:pointer;font-family:'Share Tech Mono',monospace;">AMELIORER</button>` : ''}
        </div>
        <div style="color:var(--text2);font-size:11px;margin-bottom:6px;">${bat.desc}</div>
        ${!construit ? `
          <div style="font-size:11px;color:${manque ? 'var(--red2)' : 'var(--yellow)'};margin-bottom:6px;">Cout : ${coutStr}${manque ? ' — Manque : '+manque : ''}</div>
          ${peutConstruire && !manque
            ? `<button class="btn green" style="margin:0;padding:8px;" onclick="construire('${id}')">CONSTRUIRE</button>`
            : peutConstruire
              ? `<button class="btn" style="margin:0;padding:8px;opacity:0.5;" disabled>RESSOURCES INSUFFISANTES</button>`
              : `<button class="btn" style="margin:0;padding:8px;opacity:0.4;" disabled>NECESSITE BASE NIV.${bat.reqNiveau}</button>`
          }` : `<div style="color:var(--green);font-size:11px;">Construit ✓</div>`
        }
        ${construit && id === 'cuisine' ? renderBoutonsCuisine() : ''}
        ${construit && id === 'infirmerie' ? `<button class="btn orange" style="margin:4px 0 0;padding:8px;" onclick="utiliserInfirmerie()">UTILISER INFIRMERIE (+20 vie)</button>` : ''}
        ${construit && id === 'ferme' ? `<div style="color:var(--text2);font-size:11px;margin-top:4px;">Production : +${niv} nourriture/jour (auto)</div>` : ''}
      </div>`;
  });

  // Recruter habitants
  if (b.habitation && b.popMax > b.population) {
    html += `
      <div class="section-title" style="margin-bottom:8px;margin-top:12px;">POPULATION</div>
      <div style="background:var(--bg3);border:1px solid var(--border);border-left:3px solid var(--blue);padding:10px 12px;margin-bottom:8px;">
        <div style="color:var(--text2);font-size:11px;margin-bottom:8px;">Recruter un habitant — ils aident a la production et defense.</div>
        <div style="font-size:11px;color:var(--yellow);margin-bottom:6px;">Cout : 20 capsules</div>
        <button class="btn blue" style="margin:0;padding:8px;" onclick="recruterHabitant()">RECRUTER (${b.population}/${b.popMax})</button>
      </div>`;
  }

  div.innerHTML = html;
}

function renderRolesHabitants() {
  const div = document.getElementById('base-content');
  const b = J.base;
  if (!b.habitation) {
    div.innerHTML = `<button class="btn" style="border-left-color:var(--text2);margin-bottom:10px;" onclick="renderBase()">← RETOUR</button>
    <div style="color:var(--text2);padding:10px;">Construis des habitations d'abord.</div>`;
    return;
  }
  const roles = ['chasseurs','fermiers','forgerons','gardes'];
  const infoRoles = {
    chasseurs:{icone:'🏹',nom:'Chasseur',  prod:'+1 nourriture/cuir par jour'},
    fermiers: {icone:'🌱',nom:'Fermier',   prod:'+1 nourriture/eau par jour'},
    forgerons:{icone:'🔧',nom:'Forgeron',  prod:'+1 metal par jour'},
    gardes:   {icone:'🛡',nom:'Garde',     prod:'+3 defense'},
  };
  const totalAssignes = roles.reduce((s,r)=>s+(b[r]||0),0);
  const libres = b.population - totalAssignes;
  let html = `<button class="btn" style="border-left-color:var(--text2);margin-bottom:10px;" onclick="renderBase()">← RETOUR</button>
  <div class="section-title" style="margin-bottom:8px;">ROLES DES HABITANTS</div>
  <div style="background:var(--bg3);padding:8px 12px;border:1px solid var(--border);margin-bottom:10px;font-size:11px;">
    Population : ${b.population} | Assignes : ${totalAssignes} | <span style="color:var(--green)">Libres : ${libres}</span>
  </div>`;
  roles.forEach(r => {
    const info = infoRoles[r];
    const qte = b[r]||0;
    html += `<div style="background:#111;border:1px solid #222;border-left:3px solid var(--yellow);padding:10px 12px;margin-bottom:8px;">
      <div style="font-family:'Oswald',sans-serif;color:var(--yellow);font-size:13px;margin-bottom:4px;">${info.icone} ${info.nom.toUpperCase()} (${qte})</div>
      <div style="font-size:10px;color:var(--text2);margin-bottom:8px;">${info.prod}</div>
      <div style="display:flex;gap:8px;">
        ${libres>0?`<button onclick="assignerRole('${r}',1)" style="background:#0d1a0d;border:1px solid var(--green);color:var(--green);font-size:10px;padding:3px 8px;cursor:pointer;font-family:'Share Tech Mono',monospace;">+1</button>`:''}
        ${qte>0?`<button onclick="assignerRole('${r}',-1)" style="background:#1a0d0d;border:1px solid var(--red2);color:var(--red2);font-size:10px;padding:3px 8px;cursor:pointer;font-family:'Share Tech Mono',monospace;">-1</button>`:''}
      </div>
    </div>`;
  });
  div.innerHTML = html;
}

function assignerRole(role, delta) {
  const b = J.base;
  const roles = ['chasseurs','fermiers','forgerons','gardes'];
  const totalAssignes = roles.reduce((s,r)=>s+(b[r]||0),0);
  if (delta > 0 && totalAssignes >= b.population) { log("Pas d'habitants libres.","warn"); return; }
  if (delta < 0 && (b[role]||0) <= 0) return;
  b[role] = (b[role]||0) + delta;
  log(`${role} : ${b[role]} assignes.`, 'good');
  sauvegarder();
  renderRolesHabitants();
}

function ouvrirObjectsCombat() {
  if (!combat) return;
  const objets = ['medicament','bandage','serum','piege','piege_metal'];
  const noms = {medicament:'Medicament (+30 vie)',bandage:'Bandage (+15 vie)',serum:'Serum (+50 vie)',piege:'Piege (-20 PV ennemi)',piege_metal:'Piege metal (-40 PV)'};
  const menu = document.getElementById('actions-menu');
  let html = `<button class="btn" style="border-left-color:var(--text2);margin-bottom:8px;" onclick="document.getElementById('actions-menu').style.display='none'">← FERMER</button>
  <div style="font-size:11px;color:var(--text2);margin-bottom:8px;">Utiliser un objet en combat :</div>`;
  let hasObjet = false;
  objets.forEach(o => {
    const qte = J.inventaire[o]||0;
    if (qte > 0) {
      hasObjet = true;
      html += `<button class="btn orange" style="margin-bottom:5px;" onclick="utiliserObjetCombat('${o}');document.getElementById('actions-menu').style.display='none'">
        ${noms[o]} <span class="btn-sub">x${qte} disponible</span>
      </button>`;
    }
  });
  if (!hasObjet) html += `<div style="color:var(--text2);padding:6px;">Aucun objet utilisable.</div>`;
  menu.innerHTML = html;
  menu.style.display = 'block';
}

function coutUpgradeBase(niv) {
  // Niv 1→2 : que du bois. Métal arrive plus tard.
  const couts = [
    null, // placeholder pour index 0
    { bois: 20 },                                    // niv 1 → 2
    { bois: 35, nourriture: 10 },                    // niv 2 → 3
    { bois: 50, metal: 5, cuir: 5 },                 // niv 3 → 4
    { bois: 70, metal: 12, cuir: 8 },                // niv 4 → 5
    { bois: 90, metal: 20, capsules: 30 },           // niv 5 → 6
    { bois: 120, metal: 30, cuir_traite: 5, capsules: 50 }, // niv 6 → 7
    { bois: 150, metal: 50, cuir_traite: 10, capsules: 80 }, // niv 7 → 8+
  ];
  return couts[Math.min(niv, couts.length-1)] || { bois: 150 + niv*20, metal: 50 + niv*10 };
}

function upgradeBase() {
  const b = J.base;
  const cout = coutUpgradeBase(b.niveau);
  const manque = verifierCout(cout);
  if (manque) { log('Ressources insuffisantes : ' + manque, 'warn'); return; }
  consommerCout(cout);
  b.niveau++;
  log(`Base niveau ${b.niveau} ! Nouveaux batiments disponibles.`, 'good');
  popup('BASE NIV.' + b.niveau, `Felicitations !\n\nTa base a ete amelioree.\nNiveau ${b.niveau} : nouveaux batiments debloqués.`);
  sauvegarder();
  renderBase();
}

function calculerDefense() {
  if (!J.base) return 5;
  const b = J.base;
  let def = 5;
  if (b.rempart) def += b.rempart * 10;
  if (b.population) def += b.population * 2;
  return def;
}

function verifierCout(cout) {
  const manque = [];
  Object.entries(cout).forEach(([item, qte]) => {
    const dispo = J.inventaire[item] || 0;
    if (dispo < qte) manque.push(`${qte - dispo} ${item}`);
  });
  return manque.length ? manque.join(', ') : null;
}

function consommerCout(cout) {
  Object.entries(cout).forEach(([item, qte]) => {
    J.inventaire[item] = (J.inventaire[item] || 0) - qte;
    if (J.inventaire[item] <= 0) delete J.inventaire[item];
  });
}

function construire(id) {
  const bat = BATIMENTS[id];
  if (bat.cout && verifierCout(bat.cout)) { log('Ressources insuffisantes.', 'warn'); return; }
  if (bat.cout) consommerCout(bat.cout);
  J.base[id] = 1;
  if (id === 'habitation') J.base.popMax = (J.base.popMax || 0) + 5;
  log(`${bat.nom} construit !`, 'good');
  progresserQuete('construire','batiment',1);
  ajouterJournal(`Construit : ${bat.nom}`);
  sauvegarder();
  renderBase();
}

function ameliorerBatiment(id) {
  const bat = BATIMENTS[id];
  const nivActuel = J.base[id];
  const coutAmelio = {};
  if (bat.cout) Object.entries(bat.cout).forEach(([k,v]) => coutAmelio[k] = Math.ceil(v * 1.5 * nivActuel));
  const manque = verifierCout(coutAmelio);
  const coutStr = Object.entries(coutAmelio).map(([k,v])=>`${v} ${k}`).join(', ');
  popup(
    `AMELIORER ${bat.nom.toUpperCase()}`,
    `Niveau actuel : ${nivActuel} → ${nivActuel+1}\nCout : ${coutStr}${manque ? '\n\nManque : '+manque : ''}`,
    false,
    manque ? '' : `confirmerAmelio('${id}', ${JSON.stringify(coutAmelio).replace(/"/g,"'")})`
  );
}

function confirmerAmelio(id, cout) {
  closePopup();
  consommerCout(cout);
  J.base[id]++;
  if (id === 'habitation') J.base.popMax = (J.base.popMax || 0) + 5;
  log(`${BATIMENTS[id].nom} ameliore niveau ${J.base[id]} !`, 'good');
  sauvegarder();
  renderBase();
}

function renderBoutonsCuisine() {
  let html = `<div style="margin-top:8px;"><div style="color:var(--text2);font-size:10px;margin-bottom:4px;">RECETTES :</div>`;
  RECETTES_CUISINE.forEach((r, i) => {
    const coutStr = Object.entries(r.ingredients).map(([k,v])=>`${v} ${k}`).join(' + ');
    const manque = verifierCout(r.ingredients);
    html += `<button class="btn ${manque ? '' : 'green'}" style="margin:0 0 4px;padding:6px 10px;${manque?'opacity:0.5':''}" ${manque?'disabled':''} onclick="cuisiner(${i})">
      ${r.nom} <span class="btn-sub">${coutStr} → ${r.resultat}${manque?' — Manque: '+manque:''}</span>
    </button>`;
  });
  return html + '</div>';
}

function cuisiner(idx) {
  const r = RECETTES_CUISINE[idx];
  if (verifierCout(r.ingredients)) { log('Ingredients insuffisants.', 'warn'); return; }
  consommerCout(r.ingredients);
  J.inventaire[r.resultat] = (J.inventaire[r.resultat] || 0) + 1;

  // Effets immédiats selon recette
  if (r.resultat === 'repas')         { J.faim = Math.min(100, J.faim + 50); }
  if (r.resultat === 'repas_complet') { J.faim = Math.min(100, J.faim + 80); J.vie = Math.min(J.vieMax, J.vie + 20); }
  if (r.resultat === 'bouillon')      { J.vie  = Math.min(J.vieMax, J.vie + 30); J.soif = Math.min(100, J.soif + 30); }

  log(`Cuisine : ${r.nom} prepare !`, 'good');
  sauvegarder();
  updateUI();
  renderBase();
}

function utiliserInfirmerie() {
  J.vie = Math.min(J.vieMax, J.vie + 20);
  log('Infirmerie : +20 vie.', 'good');
  sauvegarder();
  updateUI();
}

function recruterHabitant() {
  if (J.capsules < 20) { log('Pas assez de capsules (20).', 'warn'); return; }
  if (J.base.population >= J.base.popMax) { log('Plus de place dans les habitations.', 'warn'); return; }
  J.capsules -= 20;
  J.base.population++;
  log(`Habitant recrute ! Population : ${J.base.population}/${J.base.popMax}`, 'good');
  sauvegarder();
  updateUI();
  renderBase();
}
function renderInventaire() {
  const div = document.getElementById('inv-content');
  const items = Object.entries(J.inventaire).filter(([,q]) => q > 0);
  if (!items.length) {
    div.innerHTML = '<div class="inv-empty">Inventaire vide</div>';
    return;
  }
  div.innerHTML = items.map(([nom, qte]) =>
    `<div class="inv-item"><span class="item-name">${nom.toUpperCase()}</span><span class="item-qty">x${qte}</span></div>`
  ).join('');
}

// ===== RÉINITIALISER =====
function confirmerReinit() {
  popup('REINITIALISER ?', 'Toute ta progression sera perdue. Es-tu sur ?', true);
}

// ===== MORT =====
function checkMort() {
  if (J.vie <= 0) {
    effacerSauvegarde();
    document.getElementById('nav').style.display = 'none';
    document.getElementById('global-log-wrap').style.display = 'none';
    ['profil','actions','carte','inventaire'].forEach(t => {
      document.getElementById('tab-'+t).style.display = 'none';
    });
    document.getElementById('gameover-screen').style.display = 'block';
    document.getElementById('gameover-text').textContent =
      `${J.nom} est mort au Jour ${J.jour}, Niveau ${J.niveau}.`;
  }
}


// ===== ÉQUIPEMENT VISIBLE =====
const NOMS_ARMES   = { baton:'Baton', lance_bois:'Lance', couteau:'Couteau', hache:'Hache', arc:'Arc' };
const NOMS_ARMURES = { gilet_cuir:'Gilet cuir', bouclier_bois:'Bouclier bois', armure_cuir:'Armure cuir', armure_metal:'Armure metal' };

function equiperArme(id) {
  J.armeEquipee = NOMS_ARMES[id] || id;
  ajouterJournal(`Equipe arme : ${J.armeEquipee}`);
}
function equiperArmure(id) {
  J.armureEquipee = NOMS_ARMURES[id] || id;
  ajouterJournal(`Equipe armure : ${J.armureEquipee}`);
}

// ===== NUIT / JOUR =====
function modifNuit(secs, probBase) {
  if (!J.estNuit) return probBase;
  // La nuit : +20% chance ennemis, -20% objets trouvés
  return Math.min(0.99, probBase + 0.20);
}
function itemsNuit(nbItems) {
  if (!J.estNuit) return nbItems;
  return Math.max(1, Math.floor(nbItems * 0.8));
}
function lootRareNuit() {
  // La nuit : 15% de chance de trouver un loot rare en plus
  if (J.estNuit && Math.random() < 0.15) {
    const rares = ['cristal','serum','arme','produit_chimique'];
    const item = rares[Math.floor(Math.random()*rares.length)];
    ajouter(item, 1);
    log(`🌙 Loot nocturne rare : ${item} !`, 'xp');
  }
}

// ===== RÉPUTATION =====
function gagnerRep(pts) {
  J.reputation = Math.min(100, (J.reputation||0) + pts);
}
function perdreRep(pts) {
  J.reputation = Math.max(-100, (J.reputation||0) - pts);
}
function bonusMarchandRep() {
  const rep = J.reputation || 0;
  if (rep >= 60) return 0.85;   // -15% prix
  if (rep >= 20) return 0.92;   // -8% prix
  if (rep <= -60) return 1.20;  // +20% prix (méfiance)
  return 1.0;
}
function bonusEnnemisRep() {
  // Réputation haute = les pillards attaquent moins
  const rep = J.reputation || 0;
  if (rep >= 60) return -0.15;
  if (rep >= 20) return -0.08;
  if (rep <= -60) return +0.10; // plus d'attaques si criminel
  return 0;
}

// ===== COMPAGNON =====
const COMPAGNONS_DISPO = [
  { nom:'Marcus', att:8,  def:5,  vieMax:80,  desc:'Ancien soldat. Efficace au combat.' },
  { nom:'Elena',  att:5,  def:3,  vieMax:60,  desc:'Medecin. Soigne -30% degats recus.' },
  { nom:'Rex',    att:12, def:2,  vieMax:50,  desc:'Chasseur. Bonus loot en foret.' },
  { nom:'Nora',   att:6,  def:8,  vieMax:90,  desc:'Mecanicienne. Reduit cout craft.' },
];

function recruterCompagnon(idx) {
  const c = COMPAGNONS_DISPO[idx];
  if (J.capsules < 150) { log('Faut 150 capsules pour recruter.','warn'); return; }
  if (J.compagnon) { log('Tu as deja un compagnon.','warn'); return; }
  J.capsules -= 150;
  J.compagnon = { ...c, vie: c.vieMax, loyaute: 50 };
  log(`${c.nom} rejoint ton groupe !`, 'good');
  ajouterJournal(`Compagnon recrute : ${c.nom}`);
  progresserQuete('visiter','compagnon',1);
  sauvegarder(); updateUI();
  fermerCompagnons();
}

function ouvrirCompagnons() {
  showTab('actions');
  const menu = document.getElementById('actions-menu');
  let html = `<button class="btn" style="border-left-color:var(--text2);margin-bottom:10px;" onclick="resetActionsMenu()">← RETOUR</button>
  <div style="font-family:'Oswald',sans-serif;color:var(--yellow);font-size:14px;letter-spacing:2px;margin-bottom:8px;">👥 RECRUTEMENT</div>
  <div style="font-size:11px;color:var(--text2);margin-bottom:10px;">Coût : 150 💊. Un seul compagnon à la fois.</div>`;

  if (J.compagnon) {
    const c = J.compagnon;
    html += `<div style="background:#111;border:1px solid var(--green);border-left:3px solid var(--green);padding:10px 12px;margin-bottom:10px;">
      <div style="font-family:'Oswald',sans-serif;color:var(--green);font-size:14px;">${c.nom.toUpperCase()}</div>
      <div style="font-size:10px;color:var(--text2);margin:4px 0;">${c.desc||''}</div>
      <div style="font-size:11px;">❤ ${c.vie}/${c.vieMax} | ⚔ ${c.att} | 🛡 ${c.def} | Loyauté ${c.loyaute}/100</div>
      <button onclick="renvoyer Compagnon()" style="margin-top:8px;background:#1a0000;border:1px solid var(--red);color:var(--red2);font-family:'Share Tech Mono',monospace;font-size:10px;padding:4px 10px;cursor:pointer;">RENVOYER</button>
    </div>`;
  }

  COMPAGNONS_DISPO.forEach((c, i) => {
    if (J.compagnon && J.compagnon.nom === c.nom) return;
    const peutRecruter = !J.compagnon && J.capsules >= 150;
    html += `<div style="background:#111;border:1px solid #2a2a2a;border-left:3px solid #9b59b6;padding:10px 12px;margin-bottom:8px;">
      <div style="font-family:'Oswald',sans-serif;color:#9b59b6;font-size:13px;">${c.nom.toUpperCase()}</div>
      <div style="font-size:10px;color:var(--text2);margin:4px 0;">${c.desc}</div>
      <div style="font-size:10px;color:var(--text);">⚔ ${c.att} | 🛡 ${c.def} | ❤ ${c.vieMax}</div>
      <button onclick="recruterCompagnon(${i})" ${peutRecruter?'':'disabled'} style="margin-top:8px;background:${peutRecruter?'#0d001a':'#111'};border:1px solid ${peutRecruter?'#9b59b6':'#333'};color:${peutRecruter?'#9b59b6':'#444'};font-family:'Share Tech Mono',monospace;font-size:10px;padding:4px 10px;cursor:${peutRecruter?'pointer':'default'};">RECRUTER 150💊</button>
    </div>`;
  });
  menu.innerHTML = html;
  menu.style.display = 'block';
}
function fermerCompagnons() { resetActionsMenu(); }
function renvoyerCompagnon() {
  if (!J.compagnon) return;
  log(`${J.compagnon.nom} est parti.`,'info');
  J.compagnon = null;
  sauvegarder(); updateUI();
}

function compagnonEnCombat() {
  if (!J.compagnon || J.compagnon.vie <= 0) return 0;
  const bonus = Math.floor(J.compagnon.att * 0.6);
  // Compagnon peut recevoir des dégâts
  if (Math.random() < 0.3) {
    const degCompagnon = Math.max(1, (combat ? combat.att : 5) - J.compagnon.def);
    J.compagnon.vie = Math.max(0, J.compagnon.vie - degCompagnon);
    log(`${J.compagnon.nom} prend ${degCompagnon} degats. (${J.compagnon.vie} PV)`, 'warn');
    if (J.compagnon.vie <= 0) {
      log(`${J.compagnon.nom} est tombe ! Il t'a quitte.`, 'bad');
      J.compagnon = null;
    }
  }
  return bonus;
}

// ===== MORT AMÉLIORÉE =====
function checkMort() {
  if (J.vie <= 0) {
    // Stats de mort
    const statsText = [
      `Jours vecus : ${J.jour}`,
      `Niveau atteint : ${J.niveau}`,
      `Ennemis vaincus : ${(J.stats||{}).ennemisVaincus||0}`,
      `Lieux visites : ${(J.lieuxVisites||[]).length}`,
      `Objets craftes : ${(J.stats||{}).objectsCraftes||0}`,
    ].map(s => `<div>${s}</div>`).join('');

    // Conserver la base + 50% inventaire
    const invSauvegarde = {};
    Object.entries(J.inventaire||{}).forEach(([k,v]) => {
      const garde = Math.ceil(v/2);
      if (garde > 0) invSauvegarde[k] = garde;
    });
    J._inventaireSauve = invSauvegarde;
    J._baseSauvee = JSON.parse(JSON.stringify(J.base));
    J._stockSauve = JSON.parse(JSON.stringify(J.stockBase||{}));

    document.getElementById('nav').style.display = 'none';
    document.getElementById('global-log-wrap').style.display = 'none';
    ['profil','actions','carte','inventaire','base'].forEach(t => {
      const el = document.getElementById('tab-'+t);
      if (el) el.style.display = 'none';
    });
    document.getElementById('gameover-screen').style.display = 'block';
    document.getElementById('gameover-text').textContent = `${J.nom} est mort au Jour ${J.jour}, Niveau ${J.niveau}.`;
    document.getElementById('gameover-stats').innerHTML = statsText;
  }
}

function resurrectir() {
  // Renaitre à la base avec l'inventaire sauvegardé
  const ancienNom = J.nom;
  const ancienNiveau = J.niveau;
  const ancienBase = J._baseSauvee;
  const ancienStock = J._stockSauve;
  const ancienInv = J._inventaireSauve;
  J = newJoueur(ancienNom);
  J.niveau = Math.max(1, ancienNiveau - 1); // perd 1 niveau
  J.xpMax = Math.floor(500 * Math.pow(2.2, J.niveau - 1));
  J.base = ancienBase || J.base;
  J.stockBase = ancienStock || {};
  J.inventaire = ancienInv || {};
  J.vie = 30; // revit avec 30 PV
  sauvegarder();
  document.getElementById('gameover-screen').style.display = 'none';
  document.getElementById('nav').style.display = 'flex';
  document.getElementById('global-log-wrap').style.display = 'block';
  showTab('profil');
  initQuetes();
  log(`Tu reviens a toi dans ta base... -1 niveau. Vie : 30/100.`, 'warn');
  updateUI();
}

// ===== SAUVEGARDE MANUELLE =====
function sauvegarderManuel() {
  sauvegarder();
  log('Partie sauvegardee !', 'good');
  // Flash visuel
  const btn = event.target.closest('button');
  if (btn) { btn.style.borderLeftColor='var(--green)'; setTimeout(()=>btn.style.borderLeftColor='',1500); }
}

// ===== STATS =====
function afficherStats() {
  const s = J.stats || {};
  const kills = s.ennemisVaincus||0;
  const crafts = s.objectsCraftes||0;
  const ventes = s.ventesTotal||0;
  const fouilles = s.fouilles||0;
  const visitesCount = (J.lieuxVisites||[]).length;
  const compQte = (J.quetesTerminees||[]).length;
  const rep = J.reputation||0;

  let html = `<div style="font-family:'Oswald',sans-serif;color:var(--yellow);font-size:15px;letter-spacing:3px;margin-bottom:12px;">📊 STATISTIQUES</div>`;
  const s5 = J.stats5 || {};
  const rows = [
    ['Jours survecus', J.jour],
    ['Niveau actuel', J.niveau],
    ['Points stats dispo', J.pointsStats||0],
    ['— Force',       `${s5.force||1} (ATT +${(s5.force||1)*2})`],
    ['— Agilité',     `${s5.agilite||1} (Esquive ${(s5.agilite||1)*3}%)`],
    ['— Endurance',   `${s5.endurance||1} (Vie +${(s5.endurance||1)*15})`],
    ['— Intelligence',`${s5.intelligence||1} (XP +${(s5.intelligence||1)*5}%)`],
    ['— Survie',      `${s5.survie||1} (Fouille +${(s5.survie||1)*5}%)`],
    ['Mutations',     (J.mutations||[]).map(id=>{const m=TOUTES_MUTATIONS.find(x=>x.id===id);return m?m.icone+m.nom:'?';}).join(', ')||'Aucune'],
    ['Ennemis vaincus', kills],
    ['Fouilles effectuees', fouilles],
    ['Lieux decouverts', `${visitesCount}/${LIEUX.length}`],
    ['Objets craftes', crafts],
    ['Ventes au marchand', ventes],
    ['Quetes terminees', compQte],
    ['Reputation', `${rep > 0 ? '+' : ''}${rep}`],
    ['Capsules totales', J.capsules],
    ['Competences', (J.competences||[]).join(', ')||'Aucune'],
    ['Compagnon', J.compagnon ? J.compagnon.nom : 'Aucun'],
    ['Arme equipee', J.armeEquipee||'Aucune'],
    ['Armure equipee', J.armureEquipee||'Aucune'],
  ];
  rows.forEach(([label, val]) => {
    html += `<div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #1a1a1a;font-size:12px;">
      <span style="color:var(--text2);">${label}</span>
      <span style="color:var(--text);">${val}</span>
    </div>`;
  });

  popup('STATISTIQUES', html);
}

// ===== TUTORIEL =====
const TUTO_STEPS = [
  { titre:"BIENVENUE",    contenu:"Tu es un survivant dans un monde post-apocalyptique. Ton but : survivre, construire ta base, et explorer le monde dangereux." },
  { titre:"FAIM & SOIF",  contenu:"Surveille tes jauges de Faim et Soif dans l'onglet PROFIL. Si elles tombent a 0, tu perds de la vie. Va dans ACTIONS > MANGER ou BOIRE." },
  { titre:"FOUILLER",     contenu:"Dans ACTIONS > FOUILLER, tu explores ton lieu. Plus longtemps = plus de ressources, mais plus de danger. Tu peux relancer la derniere configuration." },
  { titre:"COMBAT",       contenu:"Si un ennemi attaque : ATTAQUER pour frapper, FUIR pour tenter de fuir (50%), OBJET pour utiliser un soin ou piege. Ton compagnon attaque automatiquement." },
  { titre:"BASE",         contenu:"Dans l'onglet BASE, construis des batiments. Commence par la Cuisine, puis les Habitations. Chaque batiment ameliore ta survie." },
  { titre:"CARTE",        contenu:"L'onglet CARTE montre les lieux du monde. Les lieux non visites sont dans le brouillard. Voyage pour les decouvrir et fouiller." },
  { titre:"INVENTAIRE",   contenu:"Onglet SACS : tout ce que tu portes, trie par categorie. Tu peux deposer des ressources dans le STOCK de ta base pour les proteger si tu meurs." },
  { titre:"NUIT & METEO", contenu:"La nuit (21h-6h) est plus dangereuse mais donne des loots rares. La meteo change en voyageant : la pluie donne de l'eau gratuite." },
  { titre:"PRET ?",       contenu:"C'est tout ! Commence par fouiller la foret proche. Surveille ta faim, construis ta base, explore le monde. Bonne chance, survivant." },
];
let tutoIdx = 0;

function demanderTuto() {
  popup('GUIDE DE SURVIE', `Veux-tu voir le tutoriel ?<br><br><span style="color:var(--text2);font-size:11px;">Tu pourras le relire depuis le profil.</span>`, false, '');
  // Remplacer les boutons du popup
  const zone = document.getElementById('popup-btn-zone');
  zone.innerHTML = `
    <button class="btn" style="margin:0;flex:1;" onclick="closePopup();afficherTuto()">OUI</button>
    <button class="btn" style="margin:0;flex:1;border-left-color:#555;" onclick="closePopup()">PASSER</button>`;
}

function afficherTuto() {
  tutoIdx = 0;
  document.getElementById('tuto-overlay').style.display = 'block';
  renderTutoStep();
}

function renderTutoStep() {
  const step = TUTO_STEPS[tutoIdx];
  document.getElementById('tuto-step').innerHTML = `
    <div style="background:#111;border:1px solid var(--red);border-left:4px solid var(--red);padding:14px 16px;margin-bottom:12px;">
      <div style="font-family:'Oswald',sans-serif;color:var(--red2);font-size:16px;letter-spacing:2px;margin-bottom:8px;">${step.titre}</div>
      <div style="color:var(--text);font-size:13px;line-height:1.7;">${step.contenu}</div>
    </div>`;
  document.getElementById('tuto-num').textContent = `${tutoIdx+1} / ${TUTO_STEPS.length}`;
  const zone = document.querySelector('#tuto-overlay > div > div:last-child');
  if (zone) zone.innerHTML = `
    <span id="tuto-num" style="color:var(--text2);font-size:11px;">${tutoIdx+1} / ${TUTO_STEPS.length}</span>
    <div style="display:flex;gap:8px;">
      <button class="btn" style="margin:0;border-left-color:#555;padding:8px 12px;" onclick="document.getElementById('tuto-overlay').style.display='none'">PASSER ✕</button>
      <button class="btn" style="margin:0;" onclick="tutoSuivant()">${tutoIdx < TUTO_STEPS.length - 1 ? 'SUIVANT →' : 'COMMENCER !'}</button>
    </div>`;
}

function tutoSuivant() {
  if (tutoIdx < TUTO_STEPS.length - 1) {
    tutoIdx++;
    renderTutoStep();
  } else {
    document.getElementById('tuto-overlay').style.display = 'none';
  }
}

// ===== INVENTAIRE AVEC TRI =====
const CATEGORIES_INV = {
  nourriture: 'Nourriture', eau: 'Nourriture', poisson: 'Nourriture', repas: 'Nourriture',
  repas_complet: 'Nourriture', bouillon: 'Nourriture', champignon: 'Nourriture', graine: 'Nourriture',
  medicament: 'Soin', bandage: 'Soin', serum: 'Soin', trousse: 'Soin',
  bois: 'Materiaux', metal: 'Materiaux', cuir: 'Materiaux', corde: 'Materiaux',
  pierre: 'Materiaux', charbon: 'Materiaux', cristal: 'Materiaux', plastique: 'Materiaux',
  eau_sale: 'Materiaux', herbe: 'Materiaux', cuir_traite: 'Materiaux',
  arme: 'Equipement', baton: 'Equipement', lance_bois: 'Equipement', couteau: 'Equipement',
  hache: 'Equipement', arc: 'Equipement', gilet_cuir: 'Equipement', bouclier_bois: 'Equipement',
  armure_cuir: 'Equipement', armure_metal: 'Equipement',
  capsules: 'Divers', carburant: 'Divers', cle: 'Divers', torche: 'Divers',
  piege: 'Divers', piege_metal: 'Divers', vetement: 'Divers',
  produit_chimique: 'Divers', sac: 'Divers',
};
let invFiltreActif = 'Tout';

function renderInventaire() {
  const div = document.getElementById('inv-content');
  const items = Object.entries(J.inventaire).filter(([,q]) => q > 0);
  const filtres = ['Tout','Nourriture','Soin','Materiaux','Equipement','Divers'];

  let html = `<div style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:10px;">`;
  filtres.forEach(f => {
    const actif = invFiltreActif === f;
    html += `<button onclick="invFiltreActif='${f}';renderInventaire();" style="background:${actif?'var(--red)':'#111'};border:1px solid ${actif?'var(--red)':'#333'};color:${actif?'#fff':'var(--text2)'};font-family:'Share Tech Mono',monospace;font-size:10px;padding:3px 8px;cursor:pointer;">${f}</button>`;
  });
  html += `</div>`;

  const itemsFiltres = items.filter(([nom]) =>
    invFiltreActif === 'Tout' || (CATEGORIES_INV[nom] || 'Divers') === invFiltreActif
  );

  if (!itemsFiltres.length) {
    html += '<div class="inv-empty">Aucun objet dans cette categorie</div>';
  } else {
    // Grouper par catégorie
    const groupes = {};
    itemsFiltres.forEach(([nom, qte]) => {
      const cat = CATEGORIES_INV[nom] || 'Divers';
      if (!groupes[cat]) groupes[cat] = [];
      groupes[cat].push([nom, qte]);
    });
    Object.entries(groupes).forEach(([cat, liste]) => {
      if (invFiltreActif === 'Tout') html += `<div style="font-size:10px;color:var(--text2);letter-spacing:2px;margin:8px 0 4px;">${cat.toUpperCase()}</div>`;
      html += liste.map(([nom, qte]) => {
        const sprite = SPRITES_ITEMS[nom];
        const icone = sprite ? `<img src="${sprite}" style="width:24px;height:24px;object-fit:contain;vertical-align:middle;margin-right:6px;image-rendering:pixelated;">` : '';
        return `<div class="inv-item">${icone}<span class="item-name">${nom.replace(/_/g,' ').toUpperCase()}</span><span class="item-qty">x${qte}</span></div>`;
      }).join('');
    });
  }

  // Afficher stock base si on est à la base
  if (J.lieu === 0 && Object.keys(J.stockBase||{}).length > 0) {
    html += `<div style="margin-top:12px;"><button class="btn green" style="margin:0;" onclick="renderStock()">📦 VOIR STOCK BASE<span class="btn-sub">Deposer / reprendre des ressources</span></button></div>`;
  }

  div.innerHTML = html;
}

// ===== FAVORIS FOUILLE =====
function lancerFouille(lieuIdx, duree, nbItems, xpGain) {
  J.derniereFouilleDuree = { lieuIdx, duree, nbItems, xpGain };
  resetActionsMenu();
  const secs = Math.round(duree * 3600);
  const label = secs < 60 ? `${secs} sec` : secs < 3600 ? `${Math.round(secs/60)} min` : `${(secs/3600).toFixed(0)}h`;
  log(`Fouille lancee (${label}).`, 'info');
  ajouterJournal(`Fouille ${label} a ${LIEUX[lieuIdx].nom}`);
  if (!J.stats) J.stats = {};
  J.stats.fouilles = (J.stats.fouilles||0) + 1;
  lancerActionDifferee('fouille', duree, { lieuIdx, nbItems, xpGain });
  renderTimerAction();
}

// ===== ÉVÉNEMENTS BASE ALÉATOIRES =====
const EVENEMENTS_BASE = [
  { prob:0.08, fn: () => {
    ajouter('nourriture', 5);
    log('EVENEMENT BASE : Bonne recolte ! +5 nourriture.', 'good');
    ajouterJournal('Bonne recolte surprise');
    gagnerRep(2);
  }},
  { prob:0.06, fn: () => {
    const item = 'medicament';
    ajouter(item, 2);
    log('EVENEMENT BASE : Un voyageur laisse des medicaments.', 'good');
    gagnerRep(3);
  }},
  { prob:0.05, fn: () => {
    if (J.base.population < J.base.popMax) {
      J.base.population++;
      log('EVENEMENT BASE : Un survivant rejoint ta base !', 'good');
      ajouterJournal('Nouveau survivant rejoint la base');
      gagnerRep(5);
    }
  }},
  { prob:0.05, fn: () => {
    J.vie = Math.max(1, J.vie - 15);
    log('EVENEMENT BASE : Maladie dans la base ! -15 vie.', 'bad');
    ajouterJournal('Maladie dans la base');
  }},
  { prob:0.04, fn: () => {
    const items = Object.keys(J.stockBase||{});
    if (items.length > 0) {
      const it = items[Math.floor(Math.random()*items.length)];
      const perte = Math.min(J.stockBase[it], 3);
      J.stockBase[it] -= perte;
      if (!J.stockBase[it]) delete J.stockBase[it];
      log(`EVENEMENT BASE : Vol dans le stock ! -${perte} ${it}.`, 'bad');
      perdreRep(2);
    }
  }},
];

function declencherEvenementBase() {
  if (Math.random() > 0.25) return; // 25% chance par jour
  const r = Math.random();
  let cumul = 0;
  for (const ev of EVENEMENTS_BASE) {
    cumul += ev.prob;
    if (r < cumul) { ev.fn(); return; }
  }
}

// ===== NOTIFICATION VISUELLE =====
function notifier(msg) {
  let notif = document.getElementById('notif-banner');
  if (!notif) {
    notif = document.createElement('div');
    notif.id = 'notif-banner';
    notif.style.cssText = 'position:fixed;top:60px;left:50%;transform:translateX(-50%);background:#1a0000;border:1px solid var(--red);color:var(--red2);font-family:"Share Tech Mono",monospace;font-size:12px;padding:8px 16px;z-index:999;border-radius:2px;transition:opacity 0.5s;pointer-events:none;';
    document.body.appendChild(notif);
  }
  notif.textContent = msg;
  notif.style.opacity = '1';
  clearTimeout(notif._timeout);
  notif._timeout = setTimeout(() => { notif.style.opacity = '0'; }, 3000);
}


// ===== STATS 5 (Force/Agilité/Endurance/Intelligence/Survie) =====
const INFOS_STATS5 = {
  force:        { icone:'⚔', nom:'Force',        desc:'Chaque point = +2 ATT permanent',       effet: j => { j.att += 2; } },
  agilite:      { icone:'💨', nom:'Agilité',      desc:'Chaque point = +3% esquive en combat',  effet: j => {} },
  endurance:    { icone:'💪', nom:'Endurance',     desc:'Chaque point = +15 vie max',            effet: j => { j.vieMax += 15; j.vie = Math.min(j.vieMax, j.vie + 15); } },
  intelligence: { icone:'🧠', nom:'Intelligence',  desc:'Chaque point = +5% XP gagné',          effet: j => {} },
  survie:       { icone:'🌿', nom:'Survie',        desc:'Chaque point = +5% items en fouille',  effet: j => {} },
};

function ouvrirStats5() {
  const s5 = J.stats5;
  const pts = J.pointsStats || 0;
  let html = `<div style="font-family:'Oswald',sans-serif;color:var(--yellow);font-size:14px;letter-spacing:2px;margin-bottom:4px;">STATS SECONDAIRES</div>
  <div style="font-size:11px;color:${pts>0?'var(--yellow)':'var(--text2)'};margin-bottom:10px;">${pts>0?`▲ ${pts} point(s) à distribuer !`:'Aucun point disponible.'}</div>`;

  Object.entries(INFOS_STATS5).forEach(([id, info]) => {
    const val = s5[id] || 1;
    html += `<div style="background:#111;border:1px solid #2a2a2a;border-left:3px solid var(--yellow);padding:8px 12px;margin-bottom:6px;display:flex;justify-content:space-between;align-items:center;">
      <div>
        <div style="font-size:12px;color:var(--text);">${info.icone} ${info.nom} <span style="color:var(--yellow);font-weight:bold;">${val}</span></div>
        <div style="font-size:10px;color:var(--text2);">${info.desc}</div>
      </div>
      ${pts>0?`<button onclick="monterStat('${id}')" style="background:#1a1a00;border:1px solid var(--yellow);color:var(--yellow);font-family:'Share Tech Mono',monospace;font-size:11px;padding:4px 10px;cursor:pointer;">+1</button>`:''}
    </div>`;
  });

  html += `<div style="margin-top:10px;font-family:'Oswald',sans-serif;color:#9b59b6;font-size:12px;letter-spacing:2px;margin-bottom:6px;">MUTATIONS</div>`;
  const muts = J.mutations || [];
  if (muts.length === 0) html += `<div style="color:var(--text2);font-size:11px;">Aucune mutation. Débloque en atteignant niveau 5, 10, 15...</div>`;
  muts.forEach(m => {
    const info = TOUTES_MUTATIONS.find(x=>x.id===m);
    if (info) html += `<div style="background:#0d001a;border:1px solid #9b59b6;padding:6px 10px;margin-bottom:4px;font-size:11px;"><span style="color:#9b59b6;">${info.icone} ${info.nom}</span> — <span style="color:var(--text2);">${info.desc}</span></div>`;
  });

  popup('STATS & MUTATIONS', html);
}

function monterStat(id) {
  if (!J.pointsStats || J.pointsStats <= 0) { log('Aucun point disponible.','warn'); return; }
  J.pointsStats--;
  J.stats5[id] = (J.stats5[id] || 1) + 1;
  INFOS_STATS5[id].effet(J);
  log(`${INFOS_STATS5[id].nom} → ${J.stats5[id]} ! ${INFOS_STATS5[id].desc}`, 'xp');
  closePopup();
  updateUI();
  if (J.pointsStats > 0) setTimeout(ouvrirStats5, 200);
  sauvegarder();
}

// Appliquer effets stats5 en combat/fouille
function bonusAgiEsquive() { return Math.min(0.6, (J.stats5.agilite||1) * 0.03); }
function bonusIntXP(xp)    { return Math.floor(xp * (1 + (J.stats5.intelligence||1) * 0.05)); }
function bonusSurvItems(n) { return Math.ceil(n  * (1 + (J.stats5.survie||1)       * 0.05)); }

// ===== MUTATIONS =====
const TOUTES_MUTATIONS = [
  { id:'regeneration',  icone:'💚', nom:'Régénération',   desc:'+2 vie par combat gagné',          niv:5  },
  { id:'berserker',     icone:'🔥', nom:'Berserkeur',      desc:'+15% ATT quand vie < 30%',         niv:5  },
  { id:'pilleur',       icone:'👜', nom:'Pilleur',          desc:'+1 item bonus à chaque fouille',   niv:8  },
  { id:'iron_skin',     icone:'🦾', nom:'Peau de fer',      desc:'DEF minimum 5 même sans armure',   niv:8  },
  { id:'vampire',       icone:'🧛', nom:'Vampire',          desc:'Vole 10% des PV infligés',         niv:10 },
  { id:'speed',         icone:'⚡', nom:'Vitesse',          desc:'Fuir réussit toujours',             niv:10 },
  { id:'lucky',         icone:'🍀', nom:'Chanceux',         desc:'+20% chance loot rare',            niv:12 },
  { id:'titan',         icone:'💎', nom:'Titan',            desc:'Vie max +50',                      niv:15 },
];

function verifierMutations() {
  const niv = J.niveau;
  TOUTES_MUTATIONS.forEach(m => {
    if (niv >= m.niv && !(J.mutations||[]).includes(m.id)) {
      J.mutations = J.mutations || [];
      J.mutations.push(m.id);
      log(`🧬 MUTATION : ${m.icone} ${m.nom} ! ${m.desc}`, 'xp');
      // Appliquer effet permanent immédiat si besoin
      if (m.id === 'titan') { J.vieMax += 50; J.vie = Math.min(J.vieMax, J.vie + 50); }
      if (m.id === 'iron_skin') { J.def = Math.max(J.def, 5); }
    }
  });
}

// ===== RARITÉ ÉQUIPEMENT =====
const RARETE = {
  commun:    { label:'COMMUN',    couleur:'#888',     mult:1.0 },
  rare:      { label:'RARE',      couleur:'#3498db',  mult:1.3 },
  epique:    { label:'ÉPIQUE',    couleur:'#9b59b6',  mult:1.7 },
  legendaire:{ label:'LÉGENDAIRE',couleur:'#f1c40f',  mult:2.5 },
};

function tirerRarete(lieu) {
  const r = Math.random();
  const nuit = J.estNuit ? 0.05 : 0;
  const lucky = (J.mutations||[]).includes('lucky') ? 0.10 : 0;
  const bonus = nuit + lucky;
  if (r < 0.02 + bonus) return 'legendaire';
  if (r < 0.10 + bonus) return 'epique';
  if (r < 0.30 + bonus) return 'rare';
  return 'commun';
}

function appliquerRarete(baseAtt, baseDef, rarete) {
  const m = RARETE[rarete].mult;
  return { att: Math.round(baseAtt * m), def: Math.round(baseDef * m) };
}

// Nouvel objet équipé avec rareté
const ARMES_BASE = {
  baton:      { att:4, def:0 }, lance_bois:{ att:3, def:0 }, couteau:{ att:6, def:0 },
  hache:      { att:10,def:0 }, arc:{ att:12,def:0 }, arme:{ att:8, def:0 }, arme_lourde:{ att:20, def:0 },
};
const ARMURES_BASE = {
  gilet_cuir:{ att:0, def:5 }, bouclier_bois:{ att:0, def:3 }, armure_cuir:{ att:0, def:8 },
  armure_metal:{ att:0, def:15 },
};

function equiperAvecRarete(id, rarete) {
  rarete = rarete || tirerRarete(J.lieu);
  const info = RARETE[rarete];
  const isArme = !!ARMES_BASE[id];
  const base = isArme ? ARMES_BASE[id] : (ARMURES_BASE[id] || {att:0,def:5});
  const stats = appliquerRarete(base.att, base.def, rarete);
  const nomAffiche = (NOMS_ARMES[id]||NOMS_ARMURES[id]||id) + ` [${info.label}]`;

  if (isArme) {
    J.armeEquipee = nomAffiche;
    J.att = Math.max(10, J.att) + stats.att;
    log(`${nomAffiche} équipée ! +${stats.att} ATT`, 'xp');
  } else {
    J.armureEquipee = nomAffiche;
    J.def = Math.max(5, J.def) + stats.def;
    log(`${nomAffiche} équipée ! +${stats.def} DEF`, 'xp');
  }
  log(`✨ Rareté : <span style="color:${info.couleur}">${info.label}</span>`, 'xp');
  updateUI();
}

const SPRITES = {
  eau: "assets/sprites/eau.png",
  nourriture: "assets/sprites/nourriture.png",
  metal: "assets/sprites/metal.png",
  bois: "assets/sprites/bois.png",
  capsules: "assets/sprites/capsules.png",
  couteau: "assets/sprites/couteau.png",
  arme: "assets/sprites/arme.png",
  arme_lourde: "assets/sprites/arme_lourde.png",
  baton: "assets/sprites/baton.png",
  medicament: "assets/sprites/medicament.png",
  vetement: "assets/sprites/vetement.png",
  armure_cuir: "assets/sprites/armure_cuir.png",
  armure_metal: "assets/sprites/armure_metal.png",
  masque: "assets/sprites/masque.png",
  casque: "assets/sprites/casque.png",
  boss_mutant_nucleaire: "assets/sprites/boss_mutant_nucleaire.jpg",
  joueur_portrait: "assets/sprites/joueur_portrait.jpg",
  zombie_base: "assets/sprites/zombie_base.jpg",
  pillard_capuche: "assets/sprites/pillard_capuche.jpg",
  zombie_toxique: "assets/sprites/zombie_toxique.jpg",
  mutant_toxique: "assets/sprites/mutant_toxique.jpg",
  pillard_pyro: "assets/sprites/pillard_pyro.jpg",
  loup_toxique: "assets/sprites/loup_toxique.jpg",
  chimere: "assets/sprites/chimere.jpg",
  corbeau_toxique: "assets/sprites/corbeau_toxique.jpg",
  zombie_chimiste: "assets/sprites/zombie_chimiste.jpg",
  pillard_boss: "assets/sprites/pillard_boss.jpg",
  araignee_mutante: "assets/sprites/araignee_mutante.jpg",
  corbeau_mutant: "assets/sprites/corbeau_mutant.jpg",
  zombie_errant_old: "assets/sprites/zombie_errant_old.jpg",
  berserker_feu: "assets/sprites/berserker_feu.jpg",
  zombie_irradie: "assets/sprites/zombie_irradie.jpg",
  soldat_zombie: "assets/sprites/soldat_zombie.jpg",
  demon_mutant: "assets/sprites/demon_mutant.jpg",
  mutant_insecte: "assets/sprites/mutant_insecte.jpg",
  zombie_slime: "assets/sprites/zombie_slime.jpg",
  robot_zombie: "assets/sprites/robot_zombie.jpg",
  loup: "assets/sprites/loup.jpg",
  rodeur_capuche: "assets/sprites/rodeur_capuche.jpg",
  mutant_colosse: "assets/sprites/mutant_colosse.jpg",
  zombie_mutant: "assets/sprites/zombie_mutant.jpg",
  chauve_souris: "assets/sprites/chauve_souris.jpg",
  robot_sentinelle: "assets/sprites/robot_sentinelle.jpg",
  boss_blob_toxique: "assets/sprites/boss_blob_toxique.jpg",
  chien_errant: "assets/sprites/chien_errant.jpg",
  rat_geant: "assets/sprites/rat_geant.jpg",
  sanglier_mutant: "assets/sprites/sanglier_mutant.jpg",
  corbeau_zombie: "assets/sprites/corbeau_zombie.jpg",
  poisson_mutant: "assets/sprites/poisson_mutant.jpg",
  araignee_toxique: "assets/sprites/araignee_toxique.jpg",
  zombie_enrage: "assets/sprites/zombie_enrage.jpg",
  araignee_geante: "assets/sprites/araignee_geante.jpg",
  chauve_souris_mutante: "assets/sprites/chauve_souris_mutante.jpg",
  zombie_ouvrier: "assets/sprites/zombie_ouvrier.jpg",
  demon_feu: "assets/sprites/demon_feu.jpg",
  chien_mutant: "assets/sprites/chien_mutant.jpg"
};

// Map ennemis → clé SPRITES
const MAP_ENNEMIS_SPRITE = [
  // Zombies
  ['zombie irradie',           'zombie_irradie'],
  ['zombie chimiste',          'zombie_chimiste'],
  ['zombie enrage',            'zombie_enrage'],
  ['zombie ouvrier',           'zombie_ouvrier'],
  ['zombie toxique',           'zombie_toxique'],
  ['zombie slime',             'zombie_slime'],
  ['zombie mutant',            'zombie_mutant'],
  ['zombie errant',            'zombie_base'],
  ['zombie',                   'zombie_base'],
  // Pillards / humains
  ['pillard pyro',             'pillard_pyro'],
  ['pillard boss',             'pillard_boss'],
  ['pillard',                  'pillard_capuche'],
  ['bandit',                   'pillard_pyro'],
  ['mercenaire',               'soldat_zombie'],
  ['soldat',                   'soldat_zombie'],
  ['rodeur capuche',           'rodeur_capuche'],
  ['rodeur',                   'pillard_capuche'],
  ['gang',                     'pillard_capuche'],
  // Robots
  ['robot sentinelle',         'robot_sentinelle'],
  ['robot',                    'robot_zombie'],
  ['drone',                    'robot_zombie'],
  // Animaux
  ['chien de garde',           'chien_mutant'],
  ['chien errant',             'chien_errant'],
  ['chien',                    'chien_errant'],
  ['rat',                      'rat_geant'],
  ['sanglier',                 'sanglier_mutant'],
  ['cochon',                   'sanglier_mutant'],
  ['loup toxique',             'loup_toxique'],
  ['loup',                     'loup'],
  ['corbeau',                  'corbeau_zombie'],
  ['piranhas',                 'poisson_mutant'],
  ['poisson',                  'poisson_mutant'],
  // Mutants / créatures
  ['araignee toxique',         'araignee_toxique'],
  ['araignee geante',          'araignee_geante'],
  ['araignee',                 'araignee_mutante'],
  ['chauve-souris mutante',    'chauve_souris_mutante'],
  ['chauve-souris',            'chauve_souris'],
  ['mutant colosse',           'mutant_colosse'],
  ['mutant nucleaire',         'boss_mutant_nucleaire'],
  ['mutant insecte',           'mutant_insecte'],
  ['mutant',                   'mutant_toxique'],
  ['chimere',                  'chimere'],
  ['golem',                    'mutant_colosse'],
  ['blob',                     'boss_blob_toxique'],
  // Démons / boss
  ['demon',                    'demon_feu'],
  ['berserker',                'berserker_feu'],
  ['boss : reactor',           'boss_mutant_nucleaire'],
  ['boss : patient zero',      'zombie_chimiste'],
  ['boss : general',           'soldat_zombie'],
  ['boss : roi du metro',      'demon_feu'],
  ['boss :',                   'boss_blob_toxique'],
  ['mini-boss : directeur',    'zombie_toxique'],
  ['mini-boss : sergent',      'soldat_zombie'],
  ['mini-boss',                'pillard_boss'],
];

function getImageEnnemi(nom) {
  const n = nom.toLowerCase().replace(/[éèê]/g,'e').replace(/[àâ]/g,'a');
  for (const [cle, sprite] of MAP_ENNEMIS_SPRITE) {
    if (n.includes(cle)) return SPRITES[sprite] || null;
  }
  return null;
}

// Map items → sprite pour inventaire
const SPRITES_ITEMS = {
  eau: SPRITES.eau, nourriture: SPRITES.nourriture, metal: SPRITES.metal,
  bois: SPRITES.bois, capsules: SPRITES.capsules, couteau: SPRITES.couteau,
  arme: SPRITES.arme, arme_lourde: SPRITES.arme_lourde, baton: SPRITES.baton,
  medicament: SPRITES.medicament, vetement: SPRITES.vetement,
  armure_cuir: SPRITES.armure_cuir, armure_metal: SPRITES.armure_metal,
  // Nouveaux
  poisson: SPRITES.poisson_mutant, masque: SPRITES.masque, casque: SPRITES.casque,
};

// ===== SAUVEGARDE =====
function sauvegarder() {
  localStorage.setItem('deadworld_save', JSON.stringify(J));
}

function chargerSauvegarde() {
  const save = localStorage.getItem('deadworld_save');
  if (save) {
    try { return JSON.parse(save); } catch(e) { return null; }
  }
  return null;
}

function effacerSauvegarde() {
  localStorage.removeItem('deadworld_save');
}

// ===== POPUP =====
function popup(titre, contenu, avecConfirm=false, actionConfirm='') {
  document.getElementById('popup-title').textContent = titre;
  document.getElementById('popup-content').textContent = contenu;
  const btnZone = document.getElementById('popup-btn-zone');
  if (avecConfirm) {
    btnZone.innerHTML = `
      <button onclick="closePopup()" style="width:48%;padding:11px;background:#1a1a1a;border:1px solid #444;color:#aaa;font-family:'Share Tech Mono',monospace;font-size:13px;cursor:pointer;">ANNULER</button>
      <button onclick="reinitPartie()" style="width:48%;padding:11px;background:var(--red);border:none;color:#fff;font-family:'Oswald',sans-serif;font-size:14px;letter-spacing:2px;cursor:pointer;">OUI REINIT</button>`;
  } else if (actionConfirm) {
    btnZone.innerHTML = `
      <button onclick="closePopup()" style="width:48%;padding:11px;background:#1a1a1a;border:1px solid #444;color:#aaa;font-family:'Share Tech Mono',monospace;font-size:12px;cursor:pointer;">ANNULER</button>
      <button onclick="${actionConfirm}" style="width:48%;padding:11px;background:var(--green);border:none;color:#fff;font-family:'Oswald',sans-serif;font-size:13px;letter-spacing:2px;cursor:pointer;">CONFIRMER</button>`;
  } else {
    btnZone.innerHTML = `<button onclick="closePopup()" style="width:100%;padding:11px;background:var(--red);border:none;color:#fff;font-family:'Oswald',sans-serif;font-size:14px;letter-spacing:3px;cursor:pointer;">OK</button>`;
  }
  document.getElementById('popup-overlay').classList.add('show');
}

function closePopup() {
  document.getElementById('popup-overlay').classList.remove('show');
}

function reinitPartie() {
  effacerSauvegarde();
  location.reload();
}