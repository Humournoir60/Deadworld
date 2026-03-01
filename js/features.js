// ===============================================
// DEAD WORLD — MAJOR UPDATE v2.0
// Skills + Donjons + Mutants (Pets)
// Inspired by IdleMMO
// ===============================================

// ===== 1. SKILLS SYSTEM =====
const SKILLS = {
  combat:     { nom:'Combat',     icone:'⚔️', desc:'Augmente les degats et debloque des ennemis', stat:'att', bonus:2 },
  fouille:    { nom:'Fouille',    icone:'🔍', desc:'Plus d\'objets trouves, meilleurs drops', stat:'bonusFouille', bonus:0.03 },
  craft:      { nom:'Craft',      icone:'🔧', desc:'Recettes avancees, moins de materiaux', stat:'bonusCraft', bonus:0.02 },
  cuisine:    { nom:'Cuisine',    icone:'🍳', desc:'Meilleurs repas, effets plus longs', stat:null, bonus:0 },
  medecine:   { nom:'Medecine',   icone:'💊', desc:'Soins plus efficaces, antidotes', stat:'bonusSoin', bonus:0.05 },
  forge:      { nom:'Forge',      icone:'🔨', desc:'Meilleurs equipements, reparation', stat:'def', bonus:1 },
};

function initSkills() {
  if (!J.skills) {
    J.skills = {};
    Object.keys(SKILLS).forEach(id => {
      J.skills[id] = { niveau: 1, xp: 0, xpMax: 100 };
    });
  }
  // Migration for old saves
  Object.keys(SKILLS).forEach(id => {
    if (!J.skills[id]) J.skills[id] = { niveau: 1, xp: 0, xpMax: 100 };
  });
}

function gagnerSkillXP(skillId, montant) {
  initSkills();
  const sk = J.skills[skillId];
  if (!sk) return;
  sk.xp += montant;
  while (sk.xp >= sk.xpMax) {
    sk.xp -= sk.xpMax;
    sk.niveau++;
    sk.xpMax = Math.floor(sk.xpMax * 1.4);
    log(`${SKILLS[skillId].icone} ${SKILLS[skillId].nom} NIVEAU ${sk.niveau} !`, 'xp');
    // Apply skill bonus
    const info = SKILLS[skillId];
    if (info.stat && info.bonus) {
      if (typeof J[info.stat] === 'number') {
        J[info.stat] += info.bonus;
      }
    }
  }
  sauvegarder();
}

function getSkillLevel(skillId) {
  initSkills();
  return J.skills[skillId] ? J.skills[skillId].niveau : 1;
}

function renderSkills() {
  initSkills();
  const div = document.getElementById('skills-content');
  if (!div) return;

  let html = `<div class="section-title">COMPETENCES</div>
  <div style="color:var(--text2);font-size:11px;margin-bottom:12px;">
    Tes competences s'ameliorent en pratiquant. Chaque niveau donne des bonus permanents.
  </div>`;

  Object.entries(SKILLS).forEach(([id, info]) => {
    const sk = J.skills[id];
    const pct = Math.round((sk.xp / sk.xpMax) * 100);
    const couleur = {combat:'var(--red2)',fouille:'var(--yellow)',craft:'#95a5a6',cuisine:'var(--orange)',medecine:'var(--green)',forge:'var(--blue)'}[id] || 'var(--text)';

    html += `
    <div style="background:var(--bg3);border:1px solid var(--border);border-left:3px solid ${couleur};padding:10px 12px;margin-bottom:8px;" class="anim-fadeIn">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
        <div style="font-family:'Oswald',sans-serif;color:${couleur};font-size:14px;">${info.icone} ${info.nom.toUpperCase()}</div>
        <div style="color:var(--yellow);font-size:12px;font-family:'Oswald',sans-serif;">NIV.${sk.niveau}</div>
      </div>
      <div style="color:var(--text2);font-size:10px;margin-bottom:6px;">${info.desc}</div>
      <div class="stat-bar-bg" style="height:8px;margin-bottom:2px;">
        <div style="height:100%;width:${pct}%;background:${couleur};border-radius:2px;transition:width 0.4s ease;"></div>
      </div>
      <div style="font-size:10px;color:var(--text2);text-align:right;">${sk.xp}/${sk.xpMax} XP</div>
    </div>`;
  });

  // Skill bonuses summary
  html += `<div style="background:var(--bg2);border:1px solid var(--border);padding:10px 12px;margin-top:12px;">
    <div style="font-family:'Oswald',sans-serif;color:var(--text);font-size:12px;margin-bottom:6px;">BONUS ACTIFS</div>
    <div style="font-size:10px;color:var(--text2);line-height:1.8;">`;
  html += `⚔️ Combat niv.${J.skills.combat.niveau} → +${(J.skills.combat.niveau-1)*2} ATT<br>`;
  html += `🔍 Fouille niv.${J.skills.fouille.niveau} → +${Math.round((J.skills.fouille.niveau-1)*3)}% objets<br>`;
  html += `🔧 Craft niv.${J.skills.craft.niveau} → -${Math.round((J.skills.craft.niveau-1)*2)}% materiaux<br>`;
  html += `🍳 Cuisine niv.${J.skills.cuisine.niveau} → +${Math.round((J.skills.cuisine.niveau-1)*5)}% effets repas<br>`;
  html += `💊 Medecine niv.${J.skills.medecine.niveau} → +${Math.round((J.skills.medecine.niveau-1)*5)}% soins<br>`;
  html += `🔨 Forge niv.${J.skills.forge.niveau} → +${(J.skills.forge.niveau-1)} DEF`;
  html += `</div></div>`;

  div.innerHTML = html;
}


// ===== 2. DUNGEONS SYSTEM =====
const DONJONS = [
  {
    id: 'mine_profonde',
    nom: 'Mine Profonde',
    icone: '⛏',
    desc: 'Les tunnels les plus profonds de la mine. Golem de fer au fond.',
    lieuRequis: 8, // Mine abandonnee
    niveauRequis: 3,
    combatSkillRequis: 3,
    duree: 180, // secondes
    vagues: [
      { nom:'Rat des profondeurs', vie:25, att:8, def:1, xp:15 },
      { nom:'Zombie mineur elite', vie:45, att:14, def:4, xp:30 },
      { nom:'Araignee cavernicole', vie:35, att:16, def:2, xp:25 },
    ],
    boss: { nom:'Golem de Fer', vie:150, att:22, def:12, xp:200, boss:true },
    lootTable: [
      { item:'metal', qte:5, prob:1.0 },
      { item:'cristal', qte:2, prob:0.6 },
      { item:'charbon', qte:8, prob:0.8 },
      { item:'oeuf_mutant', qte:1, prob:0.15 },
    ],
    recetteDebloquee: 'pioche_renforcee',
    xpSkill: { combat:60, fouille:30, forge:20 },
  },
  {
    id: 'labo_souterrain',
    nom: 'Laboratoire Souterrain',
    icone: '🧪',
    desc: 'Sous-sols secrets du labo. Experiences echappees.',
    lieuRequis: 9, // Laboratoire
    niveauRequis: 5,
    combatSkillRequis: 5,
    duree: 240,
    vagues: [
      { nom:'Mutant de labo alpha', vie:55, att:18, def:4, xp:35 },
      { nom:'Robot gardien MK2', vie:70, att:20, def:10, xp:45 },
      { nom:'Chimere experimentale', vie:60, att:22, def:5, xp:40 },
    ],
    boss: { nom:'Patient X — Prototype', vie:220, att:30, def:14, xp:350, boss:true },
    lootTable: [
      { item:'serum', qte:3, prob:1.0 },
      { item:'medicament', qte:4, prob:0.8 },
      { item:'produit_chimique', qte:3, prob:0.7 },
      { item:'oeuf_mutant', qte:1, prob:0.20 },
    ],
    recetteDebloquee: 'serum_avance',
    xpSkill: { combat:80, medecine:50, craft:20 },
  },
  {
    id: 'bunker_militaire',
    nom: 'Bunker Militaire',
    icone: '🎖',
    desc: 'Bunker secret sous le camp. Armes lourdes et soldats zombies d\'elite.',
    lieuRequis: 14, // Camp militaire
    niveauRequis: 7,
    combatSkillRequis: 8,
    duree: 300,
    vagues: [
      { nom:'Soldat zombie blindé', vie:90, att:22, def:12, xp:55 },
      { nom:'Drone de combat MK3', vie:80, att:28, def:8, xp:60 },
      { nom:'Mercenaire commando', vie:100, att:25, def:10, xp:65 },
      { nom:'Tireur d\'elite zombie', vie:60, att:35, def:4, xp:55 },
    ],
    boss: { nom:'General Omega', vie:350, att:40, def:22, xp:600, boss:true },
    lootTable: [
      { item:'arme', qte:2, prob:1.0 },
      { item:'arme_lourde', qte:1, prob:0.5 },
      { item:'armure_metal', qte:1, prob:0.4 },
      { item:'oeuf_mutant', qte:1, prob:0.25 },
      { item:'capsules', qte:50, prob:0.8 },
    ],
    recetteDebloquee: 'armure_composite',
    xpSkill: { combat:150, forge:60, fouille:30 },
  },
  {
    id: 'coeur_centrale',
    nom: 'Coeur du Reacteur',
    icone: '☢',
    desc: 'Le coeur irradie de la centrale. Radiation mortelle, mutants ultimes.',
    lieuRequis: 12, // Centrale nucleaire
    niveauRequis: 10,
    combatSkillRequis: 12,
    duree: 360,
    vagues: [
      { nom:'Zombie irradie alpha', vie:110, att:28, def:8, xp:70 },
      { nom:'Mutant nucleaire MK2', vie:140, att:30, def:10, xp:85 },
      { nom:'Robot sentinelle MK3', vie:120, att:32, def:14, xp:80 },
      { nom:'Chimere irradiee', vie:130, att:35, def:8, xp:90 },
      { nom:'Blob radioactif geant', vie:160, att:25, def:18, xp:95 },
    ],
    boss: { nom:'NUCLEUS — Abomination Nucleaire', vie:500, att:50, def:25, xp:1000, boss:true },
    lootTable: [
      { item:'cristal', qte:5, prob:1.0 },
      { item:'serum', qte:3, prob:0.8 },
      { item:'metal', qte:10, prob:0.9 },
      { item:'oeuf_mutant_rare', qte:1, prob:0.15 },
      { item:'capsules', qte:100, prob:0.7 },
    ],
    recetteDebloquee: 'combinaison_anti_rad',
    xpSkill: { combat:300, medecine:80, forge:80, fouille:50 },
  },
  {
    id: 'metro_abysses',
    nom: 'Abysses du Metro',
    icone: '🚇',
    desc: 'Les tunnels les plus profonds, la ou personne n\'est revenu.',
    lieuRequis: 15, // Metro souterrain
    niveauRequis: 6,
    combatSkillRequis: 6,
    duree: 240,
    vagues: [
      { nom:'Zombie aveugle enrage', vie:65, att:20, def:3, xp:40 },
      { nom:'Rat geant alpha', vie:40, att:18, def:2, xp:30 },
      { nom:'Gang sous-terrain elite', vie:80, att:22, def:7, xp:55 },
    ],
    boss: { nom:'Le Roi des Abysses', vie:250, att:35, def:15, xp:450, boss:true },
    lootTable: [
      { item:'cristal', qte:3, prob:0.8 },
      { item:'arme', qte:1, prob:0.7 },
      { item:'capsules', qte:40, prob:1.0 },
      { item:'oeuf_mutant', qte:1, prob:0.20 },
    ],
    recetteDebloquee: 'lunettes_vision_nuit',
    xpSkill: { combat:100, fouille:50, craft:30 },
  },
];

function initDonjons() {
  if (!J.donjons) J.donjons = {};
  if (!J.donjonEnCours) J.donjonEnCours = null;
  if (!J.donjonsTermines) J.donjonsTermines = [];
  if (!J.recettesDonjons) J.recettesDonjons = [];
}

function renderDonjons() {
  initDonjons();
  const div = document.getElementById('skills-content');
  if (!div) return;

  let html = `<div class="section-title">DONJONS</div>
  <div style="color:var(--text2);font-size:11px;margin-bottom:12px;">
    Donjons speciaux avec vagues d'ennemis et boss. Loot exclusif et oeufs de mutants.
  </div>`;

  // Donjon en cours ?
  if (J.donjonEnCours) {
    const dj = DONJONS.find(d => d.id === J.donjonEnCours.donjonId);
    if (dj) {
      const vague = J.donjonEnCours.vagueActuelle;
      const total = dj.vagues.length + 1;
      html += `<div style="background:#0d0000;border:2px solid var(--red);padding:14px;margin-bottom:12px;" class="anim-glow">
        <div style="font-family:'Oswald',sans-serif;color:var(--red2);font-size:16px;letter-spacing:3px;margin-bottom:6px;">${dj.icone} ${dj.nom.toUpperCase()} — EN COURS</div>
        <div style="color:var(--yellow);font-size:12px;margin-bottom:6px;">Vague ${vague}/${total}</div>
        <button class="btn" style="border-left-color:var(--red);margin:0;" onclick="continuerDonjon()">⚔ CONTINUER LE DONJON</button>
      </div>`;
    }
  }

  DONJONS.forEach(dj => {
    const debloque = J.lieuxVisites && J.lieuxVisites.includes(dj.lieuRequis) && J.niveau >= dj.niveauRequis;
    const combatOk = getSkillLevel('combat') >= dj.combatSkillRequis;
    const peutEntrer = debloque && combatOk && !J.donjonEnCours && !J.actionEnCours;
    const termine = J.donjonsTermines.includes(dj.id);
    const couleur = !debloque ? '#333' : peutEntrer ? 'var(--red2)' : 'var(--text2)';

    html += `
    <div style="background:var(--bg3);border:1px solid var(--border);border-left:3px solid ${couleur};padding:10px 12px;margin-bottom:8px;${!debloque?'opacity:0.4':''}">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
        <div style="font-family:'Oswald',sans-serif;color:${couleur};font-size:14px;">${dj.icone} ${dj.nom.toUpperCase()}</div>
        <div style="font-size:10px;">
          ${termine ? '<span style="color:var(--green);">✓ Termine</span>' : ''}
          <span style="color:var(--text2);">${dj.vagues.length+1} vagues</span>
        </div>
      </div>
      <div style="color:var(--text2);font-size:11px;margin-bottom:6px;">${dj.desc}</div>
      <div style="font-size:10px;color:var(--text2);margin-bottom:6px;">
        Requis : Niv.${dj.niveauRequis} | Combat niv.${dj.combatSkillRequis} | Lieu : ${LIEUX[dj.lieuRequis].nom}
      </div>
      <div style="font-size:10px;color:var(--yellow);margin-bottom:8px;">
        Boss : ${dj.boss.nom} (❤${dj.boss.vie} ⚔${dj.boss.att} 🛡${dj.boss.def})
      </div>
      ${peutEntrer
        ? `<button class="btn" style="border-left-color:var(--red);margin:0;padding:8px;" onclick="entrerDonjon('${dj.id}')">⚔ ENTRER DANS LE DONJON</button>`
        : !debloque
          ? `<div style="font-size:10px;color:#555;">🔒 Decouvre ${LIEUX[dj.lieuRequis].nom} d'abord</div>`
          : !combatOk
            ? `<div style="font-size:10px;color:var(--orange);">⚔ Combat niv.${dj.combatSkillRequis} requis (actuel: ${getSkillLevel('combat')})</div>`
            : `<div style="font-size:10px;color:#555;">Action en cours...</div>`
      }
    </div>`;
  });

  div.innerHTML = html;
}

function entrerDonjon(donjonId) {
  const dj = DONJONS.find(d => d.id === donjonId);
  if (!dj) return;

  J.donjonEnCours = {
    donjonId: donjonId,
    vagueActuelle: 1,
    ennemisVaincus: 0,
    loot: [],
  };

  log(`${dj.icone} Tu entres dans ${dj.nom}...`, 'info');
  ajouterJournal(`Entree donjon: ${dj.nom}`);
  sauvegarder();

  // Start first wave
  continuerDonjon();
}

function continuerDonjon() {
  if (!J.donjonEnCours) return;
  const dj = DONJONS.find(d => d.id === J.donjonEnCours.donjonId);
  if (!dj) return;

  const vague = J.donjonEnCours.vagueActuelle;
  const totalVagues = dj.vagues.length;

  showTab('actions');

  if (vague <= totalVagues) {
    // Normal wave
    const ennemiData = dj.vagues[vague - 1];
    const v = Math.floor(Math.random() * 3) - 1;
    combat = {
      nom: ennemiData.nom,
      vie: ennemiData.vie + v * 3,
      vieMax: ennemiData.vie + v * 3,
      att: ennemiData.att + v,
      def: ennemiData.def,
      xp: ennemiData.xp,
      loot: null,
      isDonjon: true,
    };
    log(`DONJON Vague ${vague}/${totalVagues+1} : ${combat.nom} !`, 'bad');
  } else {
    // Boss wave
    const bossData = dj.boss;
    combat = {
      nom: bossData.nom,
      vie: bossData.vie,
      vieMax: bossData.vie,
      att: bossData.att,
      def: bossData.def,
      xp: bossData.xp,
      loot: null,
      boss: true,
      isDonjon: true,
    };
    log(`⚠ DONJON BOSS : ${combat.nom} !`, 'bad');
  }

  document.getElementById('combat-screen').style.display = 'block';
  document.getElementById('actions-menu').style.display = 'none';
  document.getElementById('enemy-name').textContent = combat.nom.toUpperCase();

  // Enemy image
  let imgEl = document.getElementById('enemy-img');
  if (imgEl) {
    const imgSrc = getImageEnnemi(combat.nom);
    if (imgSrc) { imgEl.src = imgSrc; imgEl.style.display = 'block'; }
    else imgEl.style.display = 'none';
  }

  // Boss styling
  const enemNom = document.getElementById('enemy-name');
  if (combat.boss) {
    enemNom.style.color = '#c0392b';
    enemNom.style.fontSize = '17px';
    if (imgEl) { imgEl.style.width = '130px'; imgEl.style.height = '130px'; }
  } else {
    enemNom.style.color = '';
    enemNom.style.fontSize = '';
  }

  updateEnemyBar();
  updateUI();
}

// Override finCombat to handle dungeon progression
const _originalFinCombat = typeof finCombat === 'function' ? finCombat : null;

function patchFinCombat() {
  if (typeof window._finCombatPatched !== 'undefined') return;
  window._finCombatPatched = true;

  const origFinCombat = window.finCombat;
  window.finCombat = function(victoire) {
    // Dungeon handling
    if (combat && combat.isDonjon && J.donjonEnCours) {
      const dj = DONJONS.find(d => d.id === J.donjonEnCours.donjonId);

      if (victoire) {
        gagnerSkillXP('combat', combat.xp);

        // Collect XP and move to next wave
        gagnerXP(combat.xp);
        J.donjonEnCours.ennemisVaincus++;
        J.donjonEnCours.vagueActuelle++;

        const totalVagues = dj.vagues.length + 1; // +1 for boss

        if (J.donjonEnCours.vagueActuelle > totalVagues) {
          // Dungeon completed!
          log(`🏆 DONJON ${dj.nom} TERMINE !`, 'xp');

          // Give loot
          dj.lootTable.forEach(l => {
            if (Math.random() < l.prob) {
              if (l.item === 'capsules') {
                J.capsules += l.qte;
                log(`Loot donjon : +${l.qte} capsules`, 'xp');
              } else {
                ajouter(l.item, l.qte);
                log(`Loot donjon : ${l.qte}x ${l.item}`, 'xp');
              }
            }
          });

          // Give skill XP
          if (dj.xpSkill) {
            Object.entries(dj.xpSkill).forEach(([sk, xp]) => gagnerSkillXP(sk, xp));
          }

          // Unlock recipe
          if (dj.recetteDebloquee && !J.recettesDonjons.includes(dj.recetteDebloquee)) {
            J.recettesDonjons.push(dj.recetteDebloquee);
            log(`📜 Recette debloquee : ${dj.recetteDebloquee} !`, 'xp');
          }

          // Mark as completed
          if (!J.donjonsTermines.includes(dj.id)) {
            J.donjonsTermines.push(dj.id);
          }

          ajouterJournal(`Donjon termine: ${dj.nom}`);
          J.donjonEnCours = null;
          combat = null;
          document.getElementById('combat-screen').style.display = 'none';
          resetActionsMenu();
          updateUI();
          sauvegarder();
          return;
        } else {
          // More waves — show continue prompt
          const prochainVague = J.donjonEnCours.vagueActuelle;
          const isProchainBoss = prochainVague > dj.vagues.length;
          const prochainNom = isProchainBoss ? dj.boss.nom : dj.vagues[prochainVague-1].nom;
          combat = null;
          document.getElementById('combat-screen').style.display = 'none';

          const menu = document.getElementById('actions-menu');
          menu.style.display = 'block';
          menu.innerHTML = `
            <div style="background:#0d0d00;border:1px solid var(--yellow);padding:12px;margin-bottom:8px;">
              <div style="font-family:'Oswald',sans-serif;color:var(--yellow);font-size:14px;margin-bottom:4px;">
                ${dj.icone} ${dj.nom.toUpperCase()} — Vague ${prochainVague}/${dj.vagues.length+1}
              </div>
              <div style="font-size:11px;color:var(--text2);">
                Prochain : <span style="color:${isProchainBoss?'var(--red2)':'var(--text)'}">${prochainNom}</span>
                ${isProchainBoss ? ' ⚠ BOSS !' : ''}
              </div>
              <div style="font-size:11px;color:var(--green);margin-top:4px;">Vie : ${J.vie}/${J.vieMax}</div>
            </div>
            <button class="btn" style="border-left-color:var(--red);margin-bottom:6px;" onclick="continuerDonjon()">
              ⚔ ${isProchainBoss ? 'AFFRONTER LE BOSS' : 'VAGUE SUIVANTE'}
            </button>
            <button class="btn blue" onclick="quitterDonjon()">
              QUITTER LE DONJON
              <span class="btn-sub">Tu gardes l'XP mais pas le loot du boss</span>
            </button>`;
          updateUI();
          sauvegarder();
          return;
        }
      } else {
        // Player fled or lost in dungeon
        log(`Tu as echoue dans le donjon ${dj.nom}.`, 'bad');
        J.donjonEnCours = null;
        combat = null;
        document.getElementById('combat-screen').style.display = 'none';
        resetActionsMenu();
        updateUI();
        sauvegarder();
        return;
      }
    }

    // Give combat skill XP for non-dungeon fights too
    if (victoire && combat && !combat.isDonjon) {
      gagnerSkillXP('combat', Math.ceil((combat.xp || 10) * 0.3));
    }

    // Call original function for non-dungeon combat
    origFinCombat.call(this, victoire);
  };
}

function quitterDonjon() {
  log('Tu quittes le donjon.', 'info');
  J.donjonEnCours = null;
  resetActionsMenu();
  sauvegarder();
  updateUI();
}


// ===== 3. MUTANTS (PETS) SYSTEM =====
const MUTANTS_DB = [
  // Common (from oeuf_mutant)
  { id:'rat_apprivoise',   nom:'Rat Apprivoise',   rarete:'commun',  attBase:3,  defBase:1,  vieBase:20,  vitesse:2, desc:'Petit mais rapide. Trouve des objets.', icone:'🐀' },
  { id:'chien_sauvage',    nom:'Chien Sauvage',    rarete:'commun',  attBase:5,  defBase:3,  vieBase:35,  vitesse:1, desc:'Loyal. Aide au combat.',               icone:'🐕' },
  { id:'corbeau_mutant',   nom:'Corbeau Mutant',   rarete:'commun',  attBase:4,  defBase:1,  vieBase:15,  vitesse:3, desc:'Eclaireur aerien. Repere les dangers.',icone:'🐦‍⬛' },
  { id:'lezard_toxique',   nom:'Lezard Toxique',   rarete:'commun',  attBase:6,  defBase:2,  vieBase:25,  vitesse:2, desc:'Crache du venin. Empoisonne.',          icone:'🦎' },
  // Rare (from oeuf_mutant with low chance or oeuf_mutant_rare)
  { id:'loup_alpha',       nom:'Loup Alpha',       rarete:'rare',    attBase:10, defBase:5,  vieBase:60,  vitesse:2, desc:'Predateur redoutable.',                icone:'🐺' },
  { id:'araignee_geante',  nom:'Araignee Geante',  rarete:'rare',    attBase:8,  defBase:8,  vieBase:50,  vitesse:1, desc:'Tisse des pieges. Tres resistante.',   icone:'🕷️' },
  { id:'faucon_irradie',   nom:'Faucon Irradie',   rarete:'rare',    attBase:12, defBase:3,  vieBase:40,  vitesse:4, desc:'Ultra rapide. Frappe en premier.',      icone:'🦅' },
  // Epique (from oeuf_mutant_rare)
  { id:'ours_blindé',      nom:'Ours Blinde',      rarete:'epique',  attBase:15, defBase:12, vieBase:100, vitesse:1, desc:'Tank absolu. Quasi inarretable.',       icone:'🐻' },
  { id:'chimere_domptee',  nom:'Chimere Domptee',  rarete:'epique',  attBase:18, defBase:8,  vieBase:80,  vitesse:3, desc:'Creature hybride devastatrice.',        icone:'🐲' },
  // Legendaire
  { id:'phoenix_nucleaire',nom:'Phoenix Nucleaire', rarete:'legendaire', attBase:25, defBase:15, vieBase:150, vitesse:4, desc:'Ne meurt jamais vraiment.',          icone:'🔥' },
];

function initMutants() {
  if (!J.mutantsCollection) J.mutantsCollection = [];
  if (!J.mutantEquipe) J.mutantEquipe = null;
  if (!J.mutantEnChasse) J.mutantEnChasse = null;
  // Register new items in inventory categories
  if (typeof CATEGORIES_INV !== 'undefined') {
    CATEGORIES_INV['oeuf_mutant'] = 'Mutants';
    CATEGORIES_INV['oeuf_mutant_rare'] = 'Mutants';
    CATEGORIES_INV['arme_lourde'] = 'Equipement';
    CATEGORIES_INV['armure_composite'] = 'Equipement';
    CATEGORIES_INV['combinaison_anti_rad'] = 'Equipement';
    CATEGORIES_INV['pioche_renforcee'] = 'Equipement';
    CATEGORIES_INV['lunettes_vision_nuit'] = 'Equipement';
    CATEGORIES_INV['serum_avance'] = 'Soin';
  }
  // Patch renderInventaire to add Mutants filter
  const origRenderInv = window.renderInventaire;
  if (origRenderInv) {
    window.renderInventaire = function() {
      origRenderInv.call(this);
      // Inject Mutants filter button if not present
      const filterDiv = document.querySelector('#tab-inventaire div[style*="flex-wrap"]');
      if (filterDiv && !filterDiv.innerHTML.includes('Mutants')) {
        const btn = document.createElement('button');
        btn.style.cssText = 'background:#1a001a;border:1px solid #9b59b6;color:#9b59b6;font-family:Share Tech Mono,monospace;font-size:10px;padding:3px 8px;cursor:pointer;';
        btn.textContent = 'Mutants';
        btn.onclick = () => { invFiltreActif = 'Mutants'; renderInventaire(); };
        filterDiv.appendChild(btn);
      }
    };
  }
}

function eclosionOeuf(type) {
  const inv = J.inventaire;
  if (!inv[type] || inv[type] <= 0) { log('Pas d\'oeuf disponible.', 'warn'); return; }
  inv[type]--;
  if (!inv[type]) delete inv[type];

  let pool;
  if (type === 'oeuf_mutant_rare') {
    // Rare egg: 50% rare, 35% epique, 15% legendaire
    const roll = Math.random();
    if (roll < 0.15) pool = MUTANTS_DB.filter(m => m.rarete === 'legendaire');
    else if (roll < 0.50) pool = MUTANTS_DB.filter(m => m.rarete === 'epique');
    else pool = MUTANTS_DB.filter(m => m.rarete === 'rare');
  } else {
    // Normal egg: 60% commun, 30% rare, 10% epique
    const roll = Math.random();
    if (roll < 0.10) pool = MUTANTS_DB.filter(m => m.rarete === 'epique');
    else if (roll < 0.40) pool = MUTANTS_DB.filter(m => m.rarete === 'rare');
    else pool = MUTANTS_DB.filter(m => m.rarete === 'commun');
  }

  if (!pool.length) pool = MUTANTS_DB.filter(m => m.rarete === 'commun');
  const base = pool[Math.floor(Math.random() * pool.length)];

  const mutant = {
    uid: Date.now() + '_' + Math.random().toString(36).substr(2,5),
    id: base.id,
    nom: base.nom,
    icone: base.icone,
    rarete: base.rarete,
    niveau: 1,
    xp: 0,
    xpMax: 50,
    att: base.attBase,
    def: base.defBase,
    vie: base.vieBase,
    vieMax: base.vieBase,
    vitesse: base.vitesse,
    desc: base.desc,
    stamina: 100,
    staminaMax: 100,
  };

  J.mutantsCollection.push(mutant);
  const coulRarete = {commun:'var(--text)',rare:'var(--blue)',epique:'#9b59b6',legendaire:'var(--yellow)'}[mutant.rarete];
  log(`🥚 Eclosion ! ${mutant.icone} ${mutant.nom} (${mutant.rarete.toUpperCase()}) !`, 'xp');
  ajouterJournal(`Mutant obtenu: ${mutant.nom} (${mutant.rarete})`);
  sauvegarder();
  updateUI();
  renderMutants();
}

function renderMutants() {
  initMutants();
  const div = document.getElementById('skills-content');
  if (!div) return;

  const oeufs = (J.inventaire['oeuf_mutant']||0);
  const oeufsRares = (J.inventaire['oeuf_mutant_rare']||0);

  let html = `<div class="section-title">MUTANTS</div>
  <div style="color:var(--text2);font-size:11px;margin-bottom:12px;">
    Trouve des oeufs dans les donjons. Fais-les eclore, equipe tes mutants et envoie-les en chasse.
  </div>`;

  // Eggs section
  if (oeufs > 0 || oeufsRares > 0) {
    html += `<div style="background:var(--bg2);border:1px solid var(--border);padding:10px 12px;margin-bottom:12px;">
      <div style="font-family:'Oswald',sans-serif;color:var(--yellow);font-size:13px;margin-bottom:8px;">🥚 OEUFS</div>`;
    if (oeufs > 0)
      html += `<button class="btn yellow" style="margin:0 0 6px;padding:8px;" onclick="eclosionOeuf('oeuf_mutant')">
        FAIRE ECLORE (Oeuf x${oeufs})<span class="btn-sub">60% commun | 30% rare | 10% epique</span></button>`;
    if (oeufsRares > 0)
      html += `<button class="btn" style="border-left-color:#9b59b6;margin:0;padding:8px;" onclick="eclosionOeuf('oeuf_mutant_rare')">
        FAIRE ECLORE (Oeuf Rare x${oeufsRares})<span class="btn-sub">50% rare | 35% epique | 15% legendaire</span></button>`;
    html += `</div>`;
  }

  // Mutant en chasse
  if (J.mutantEnChasse) {
    const elapsed = Date.now() - J.mutantEnChasse.debut;
    const restant = Math.max(0, J.mutantEnChasse.duree - elapsed);
    if (restant <= 0) {
      // Hunt complete — collect
      html += `<div style="background:#0d1a0d;border:1px solid var(--green);padding:10px 12px;margin-bottom:12px;">
        <div style="font-family:'Oswald',sans-serif;color:var(--green);margin-bottom:4px;">🏹 CHASSE TERMINEE !</div>
        <button class="btn green" style="margin:0;padding:8px;" onclick="collecterChasseMutant()">RECUPERER LE BUTIN</button>
      </div>`;
    } else {
      const m = Math.floor(restant / 60000);
      const s = Math.floor((restant % 60000) / 1000);
      const mut = J.mutantsCollection.find(m => m.uid === J.mutantEnChasse.mutantUid);
      html += `<div style="background:#0d0d00;border:1px solid var(--yellow);padding:10px 12px;margin-bottom:12px;">
        <div style="font-family:'Oswald',sans-serif;color:var(--yellow);margin-bottom:4px;">
          🏹 ${mut ? mut.icone+' '+mut.nom : 'Mutant'} EN CHASSE
        </div>
        <div style="font-size:16px;color:var(--white);text-align:center;">${m}m ${s}s</div>
      </div>`;
    }
  }

  // Equipped mutant
  if (J.mutantEquipe) {
    const eq = J.mutantsCollection.find(m => m.uid === J.mutantEquipe);
    if (eq) {
      const coulR = {commun:'var(--text)',rare:'var(--blue)',epique:'#9b59b6',legendaire:'var(--yellow)'}[eq.rarete];
      html += `<div style="background:var(--bg2);border:1px solid ${coulR};border-left:3px solid ${coulR};padding:10px 12px;margin-bottom:12px;">
        <div style="font-family:'Oswald',sans-serif;color:${coulR};font-size:14px;margin-bottom:4px;">${eq.icone} ${eq.nom.toUpperCase()} — EQUIPE</div>
        <div style="font-size:11px;color:var(--text2);">${eq.rarete.toUpperCase()} | Niv.${eq.niveau} | ⚔${eq.att} 🛡${eq.def} ❤${eq.vie}</div>
        <div style="font-size:10px;color:var(--text2);margin-top:2px;">Bonus : +${eq.att} ATT, +${eq.def} DEF</div>
        <button onclick="desequiperMutant()" style="margin-top:6px;background:#1a0000;border:1px solid var(--red);color:var(--red2);font-family:'Share Tech Mono',monospace;font-size:10px;padding:4px 10px;cursor:pointer;">DESEQUIPER</button>
      </div>`;
    }
  }

  // Collection
  html += `<div style="font-family:'Oswald',sans-serif;color:var(--text);font-size:12px;margin-bottom:8px;">COLLECTION (${J.mutantsCollection.length})</div>`;

  if (J.mutantsCollection.length === 0) {
    html += `<div style="color:var(--text2);padding:10px;text-align:center;">Pas encore de mutants. Explore les donjons pour trouver des oeufs !</div>`;
  }

  J.mutantsCollection.forEach(mut => {
    const coulR = {commun:'var(--text)',rare:'var(--blue)',epique:'#9b59b6',legendaire:'var(--yellow)'}[mut.rarete];
    const isEquipe = J.mutantEquipe === mut.uid;
    const isEnChasse = J.mutantEnChasse && J.mutantEnChasse.mutantUid === mut.uid;
    const pctXP = Math.round((mut.xp / mut.xpMax) * 100);
    const pctSta = Math.round((mut.stamina / mut.staminaMax) * 100);

    html += `
    <div style="background:var(--bg3);border:1px solid ${isEquipe?coulR:'var(--border)'};border-left:3px solid ${coulR};padding:10px 12px;margin-bottom:6px;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
        <div style="font-family:'Oswald',sans-serif;color:${coulR};font-size:13px;">${mut.icone} ${mut.nom}</div>
        <div style="font-size:10px;color:var(--text2);">${mut.rarete.toUpperCase()} | Niv.${mut.niveau}</div>
      </div>
      <div style="font-size:10px;color:var(--text2);margin-bottom:4px;">${mut.desc}</div>
      <div style="font-size:10px;color:var(--text);margin-bottom:4px;">⚔${mut.att} 🛡${mut.def} ❤${mut.vie}/${mut.vieMax} ⚡${mut.stamina}/${mut.staminaMax}</div>
      <div style="display:flex;gap:4px;margin-bottom:4px;">
        <div style="flex:1;">
          <div style="font-size:9px;color:var(--text2);">XP</div>
          <div class="stat-bar-bg" style="height:5px;"><div style="height:100%;width:${pctXP}%;background:#9b59b6;border-radius:2px;"></div></div>
        </div>
        <div style="flex:1;">
          <div style="font-size:9px;color:var(--text2);">Stamina</div>
          <div class="stat-bar-bg" style="height:5px;"><div style="height:100%;width:${pctSta}%;background:var(--green);border-radius:2px;"></div></div>
        </div>
      </div>
      <div style="display:flex;gap:6px;flex-wrap:wrap;">
        ${!isEquipe && !isEnChasse ? `<button onclick="equiperMutant('${mut.uid}')" style="background:#0d1a0d;border:1px solid var(--green);color:var(--green);font-size:10px;padding:3px 8px;cursor:pointer;font-family:'Share Tech Mono',monospace;">EQUIPER</button>` : ''}
        ${!isEquipe && !isEnChasse && mut.stamina >= 30 ? `<button onclick="envoyerChasseMutant('${mut.uid}')" style="background:#1a1a0d;border:1px solid var(--yellow);color:var(--yellow);font-size:10px;padding:3px 8px;cursor:pointer;font-family:'Share Tech Mono',monospace;">CHASSE (30 sta)</button>` : ''}
        ${mut.stamina < mut.staminaMax && !isEnChasse ? `<button onclick="reposerMutant('${mut.uid}')" style="background:#0d0d1a;border:1px solid var(--blue);color:var(--blue);font-size:10px;padding:3px 8px;cursor:pointer;font-family:'Share Tech Mono',monospace;">DORMIR (+20 sta)</button>` : ''}
        ${!isEquipe && !isEnChasse ? `<button onclick="relacherMutant('${mut.uid}')" style="background:#1a0000;border:1px solid #555;color:#666;font-size:10px;padding:3px 8px;cursor:pointer;font-family:'Share Tech Mono',monospace;">RELACHER</button>` : ''}
        ${isEquipe ? '<span style="color:var(--green);font-size:10px;">✓ Equipe</span>' : ''}
        ${isEnChasse ? '<span style="color:var(--yellow);font-size:10px;">🏹 En chasse</span>' : ''}
      </div>
    </div>`;
  });

  div.innerHTML = html;
}

function equiperMutant(uid) {
  const mut = J.mutantsCollection.find(m => m.uid === uid);
  if (!mut) return;
  J.mutantEquipe = uid;
  log(`${mut.icone} ${mut.nom} equipe ! +${mut.att} ATT, +${mut.def} DEF`, 'good');
  sauvegarder();
  updateUI();
  renderMutants();
}

function desequiperMutant() {
  J.mutantEquipe = null;
  log('Mutant desequipe.', 'info');
  sauvegarder();
  updateUI();
  renderMutants();
}

function envoyerChasseMutant(uid) {
  const mut = J.mutantsCollection.find(m => m.uid === uid);
  if (!mut || mut.stamina < 30) { log('Stamina insuffisante.', 'warn'); return; }
  if (J.mutantEnChasse) { log('Un mutant est deja en chasse.', 'warn'); return; }

  mut.stamina -= 30;
  const dureeMs = (5 + mut.vitesse) * 60 * 1000; // 5-9 minutes based on speed

  J.mutantEnChasse = {
    mutantUid: uid,
    debut: Date.now(),
    duree: dureeMs,
  };

  log(`${mut.icone} ${mut.nom} part en chasse (${Math.round(dureeMs/60000)} min).`, 'info');
  sauvegarder();
  renderMutants();
}

function collecterChasseMutant() {
  if (!J.mutantEnChasse) return;
  const mut = J.mutantsCollection.find(m => m.uid === J.mutantEnChasse.mutantUid);

  // Generate loot based on mutant level and rarity
  const bonus = mut ? mut.niveau * 0.1 : 0;
  const rareteBonus = mut ? {commun:0,rare:0.1,epique:0.2,legendaire:0.4}[mut.rarete] : 0;

  const lootPossible = ['nourriture','eau','metal','bois','medicament','capsules','cuir','cristal'];
  const nbItems = Math.floor(2 + bonus + rareteBonus * 5 + Math.random() * 3);

  for (let i = 0; i < nbItems; i++) {
    const item = lootPossible[Math.floor(Math.random() * lootPossible.length)];
    if (item === 'capsules') {
      J.capsules += Math.floor(5 + Math.random() * 10);
    } else {
      ajouter(item, 1);
    }
  }

  // Give mutant XP
  if (mut) {
    const xpGain = 15 + Math.floor(Math.random() * 10);
    mut.xp += xpGain;
    while (mut.xp >= mut.xpMax) {
      mut.xp -= mut.xpMax;
      mut.niveau++;
      mut.xpMax = Math.floor(mut.xpMax * 1.35);
      mut.att += Math.ceil(mut.att * 0.1);
      mut.def += Math.ceil(mut.def * 0.08);
      mut.vieMax += Math.floor(mut.vieMax * 0.1);
      mut.vie = mut.vieMax;
      mut.staminaMax += 5;
      log(`${mut.icone} ${mut.nom} NIVEAU ${mut.niveau} !`, 'xp');
    }
    gagnerSkillXP('fouille', 10);
  }

  log(`🏹 Chasse terminee ! ${nbItems} objets ramenes.`, 'good');
  J.mutantEnChasse = null;
  sauvegarder();
  updateUI();
  renderMutants();
}

function reposerMutant(uid) {
  const mut = J.mutantsCollection.find(m => m.uid === uid);
  if (!mut) return;
  mut.stamina = Math.min(mut.staminaMax, mut.stamina + 20);
  mut.vie = Math.min(mut.vieMax, mut.vie + Math.floor(mut.vieMax * 0.3));
  log(`${mut.icone} ${mut.nom} se repose. Stamina: ${mut.stamina}/${mut.staminaMax}`, 'info');
  sauvegarder();
  renderMutants();
}

function relacherMutant(uid) {
  const idx = J.mutantsCollection.findIndex(m => m.uid === uid);
  if (idx === -1) return;
  const mut = J.mutantsCollection[idx];
  J.mutantsCollection.splice(idx, 1);
  log(`${mut.icone} ${mut.nom} relache dans la nature.`, 'info');
  sauvegarder();
  renderMutants();
}


// ===== 4. MUTANT COMBAT INTEGRATION =====
function getMutantCombatBonus() {
  if (!J.mutantEquipe) return { att: 0, def: 0 };
  const mut = J.mutantsCollection.find(m => m.uid === J.mutantEquipe);
  if (!mut) return { att: 0, def: 0 };
  return { att: mut.att, def: mut.def };
}

// Mutant gains XP from player combat
function mutantCombatXP(xpAmount) {
  if (!J.mutantEquipe) return;
  const mut = J.mutantsCollection.find(m => m.uid === J.mutantEquipe);
  if (!mut) return;
  const xpGain = Math.ceil(xpAmount * 0.2);
  mut.xp += xpGain;
  while (mut.xp >= mut.xpMax) {
    mut.xp -= mut.xpMax;
    mut.niveau++;
    mut.xpMax = Math.floor(mut.xpMax * 1.35);
    mut.att += Math.ceil(mut.att * 0.1);
    mut.def += Math.ceil(mut.def * 0.08);
    mut.vieMax += Math.floor(mut.vieMax * 0.1);
    mut.vie = mut.vieMax;
    mut.staminaMax += 5;
    log(`${mut.icone} ${mut.nom} NIVEAU ${mut.niveau} !`, 'xp');
  }
}


// ===== 5. SKILL XP HOOKS — Patch existing functions =====
function patchSkillHooks() {
  // Patch fouille completion — check type BEFORE original clears it
  const origVerifierAction = window.verifierActionEnCours;
  window.verifierActionEnCours = function() {
    let actionType = null;
    if (J.actionEnCours) {
      const elapsed = Date.now() - J.actionEnCours.debut;
      if (elapsed >= J.actionEnCours.duree) {
        actionType = J.actionEnCours.type;
      }
    }
    origVerifierAction.call(this);
    // Give skill XP after action completes
    if (actionType === 'fouille') gagnerSkillXP('fouille', 15);
    if (actionType === 'voyage') gagnerSkillXP('fouille', 5);
  };

  // Patch crafting
  const origCrafter = window.crafter;
  if (origCrafter) {
    window.crafter = function(idx) {
      origCrafter.call(this, idx);
      gagnerSkillXP('craft', 20);
    };
  }

  // Patch cooking
  const origCuisiner = window.cuisiner;
  if (origCuisiner) {
    window.cuisiner = function(idx) {
      origCuisiner.call(this, idx);
      gagnerSkillXP('cuisine', 25);
    };
  }

  // Patch healing
  const origSoigner = window.actionSoigner;
  if (origSoigner) {
    window.actionSoigner = function() {
      origSoigner.call(this);
      gagnerSkillXP('medecine', 15);
    };
  }

  // Patch gagnerXP to also give mutant XP
  const origGagnerXP = window.gagnerXP;
  window.gagnerXP = function(montant) {
    origGagnerXP.call(this, montant);
    mutantCombatXP(montant);
  };
}


// ===== 6. NAVIGATION — Add Skills/Donjons/Mutants Tab =====
function addSkillsTab() {
  const nav = document.getElementById('nav');
  if (!nav || document.getElementById('nav-skills-btn')) return;

  const btn = document.createElement('button');
  btn.className = 'nav-btn';
  btn.id = 'nav-skills-btn';
  btn.textContent = 'SKILLS';
  btn.onclick = () => showTabSkills('skills');
  nav.appendChild(btn);

  // Create skills screen container
  const container = document.createElement('div');
  container.id = 'tab-skills';
  container.className = 'screen';
  container.style.display = 'none';
  container.innerHTML = `<div style="padding:10px;">
    <div id="skills-sub-nav" style="display:flex;gap:4px;margin-bottom:10px;">
      <button class="btn" style="flex:1;margin:0;padding:8px;border-left-color:var(--yellow);" onclick="renderSkills()">⭐ SKILLS</button>
      <button class="btn" style="flex:1;margin:0;padding:8px;border-left-color:var(--red);" onclick="renderDonjons()">⚔ DONJONS</button>
      <button class="btn" style="flex:1;margin:0;padding:8px;border-left-color:#9b59b6;" onclick="renderMutants()">🐾 MUTANTS</button>
    </div>
    <div id="skills-content"></div>
  </div>`;

  // Insert before the popup
  const popup = document.getElementById('popup-overlay');
  popup.parentNode.insertBefore(container, popup);

  // Patch showTab to handle the new tab
  const origShowTab = window.showTab;
  window.showTab = function(tab) {
    const skillsTab = document.getElementById('tab-skills');
    if (skillsTab) skillsTab.style.display = 'none';
    const skillsBtn = document.getElementById('nav-skills-btn');
    if (skillsBtn) skillsBtn.classList.remove('active');
    origShowTab.call(this, tab);
  };
}

function showTabSkills(sub) {
  // Hide all normal tabs
  ['profil','actions','carte','inventaire','base'].forEach(t => {
    const el = document.getElementById('tab-'+t);
    if (el) el.style.display = 'none';
  });
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  const skillsBtn = document.getElementById('nav-skills-btn');
  if (skillsBtn) skillsBtn.classList.add('active');
  const skillsTab = document.getElementById('tab-skills');
  if (skillsTab) skillsTab.style.display = 'block';
  renderSkills(); // Default to skills view
}


// ===== 7. MUTANT HUNT TIMER =====
function tickMutantHunt() {
  if (!J.mutantEnChasse) return;
  const elapsed = Date.now() - J.mutantEnChasse.debut;
  if (elapsed >= J.mutantEnChasse.duree) {
    // Auto-notify, don't auto-collect
    if (!J.mutantEnChasse.notified) {
      log('🏹 Ton mutant est revenu de la chasse !', 'good');
      J.mutantEnChasse.notified = true;
      if (typeof notifier === 'function') notifier('Mutant de retour !');
    }
  }
}

// Add to existing tick interval
setInterval(tickMutantHunt, 5000);


// ===== 8. INITIALIZATION =====
function initFeatures() {
  initSkills();
  initDonjons();
  initMutants();
  addSkillsTab();
  patchFinCombat();
  patchSkillHooks();
  patchUpdateUI();
  patchCombatAction();
  console.log('DEAD WORLD v2.0 — Skills + Donjons + Mutants loaded!');
}

// Patch updateUI to show mutant bonus on ATT/DEF
function patchUpdateUI() {
  const origUpdateUI = window.updateUI;
  window.updateUI = function() {
    origUpdateUI.call(this);
    // Show mutant bonus in profile
    const bonus = getMutantCombatBonus();
    const attEl = document.getElementById('p-att');
    const defEl = document.getElementById('p-def');
    if (attEl && bonus.att > 0) attEl.textContent = `${J.att} +${bonus.att}`;
    if (defEl && bonus.def > 0) defEl.textContent = `${J.def} +${bonus.def}`;

    // Show equipped mutant on profile
    const compEl = document.getElementById('p-compagnon');
    if (compEl && J.mutantEquipe) {
      const mut = J.mutantsCollection.find(m => m.uid === J.mutantEquipe);
      if (mut) compEl.innerHTML = `${mut.icone} ${mut.nom} <span style="font-size:9px;color:var(--text2);">Niv.${mut.niveau}</span>`;
    }
  };
}

// Patch combatAction to include mutant ATT/DEF bonus
function patchCombatAction() {
  const origCombatAction = window.combatAction;
  if (!origCombatAction) return;

  window.combatAction = function(action) {
    // Temporarily boost J.att and J.def with mutant bonus
    const bonus = getMutantCombatBonus();
    J.att += bonus.att;
    J.def += bonus.def;

    origCombatAction.call(this, action);

    // Restore original values
    J.att -= bonus.att;
    J.def -= bonus.def;
  };
}

// Auto-init when game loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => setTimeout(initFeatures, 500));
} else {
  setTimeout(initFeatures, 500);
}
