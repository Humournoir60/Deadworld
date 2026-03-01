// ===============================================
// DEAD WORLD — UPDATE v2.1
// Classes + Base Management Améliorée
// ===============================================

// ===== 1. CLASSES =====
const CLASSES = {
  guerrier: {
    nom: 'Guerrier',
    icone: '⚔️',
    desc: 'Combattant ne. +20% degats, +15 vie max, regenere 2 vie/combat.',
    couleur: '#e74c3c',
    bonus: { att: 3, def: 1, vieMax: 15 },
    passif: 'Berserker : +20% degats en dessous de 30% vie.',
    skillBonus: 'combat',  // +15% XP combat
    image: 'classe_guerrier.jpg',
  },
  eclaireur: {
    nom: 'Eclaireur',
    icone: '🏹',
    desc: 'Rapide et discret. +30% objets en fouille, voyages 20% plus courts.',
    couleur: '#2ecc71',
    bonus: { att: 1, def: 0, vieMax: 0 },
    passif: 'Instinct : 15% de chance d\'esquiver une attaque.',
    skillBonus: 'fouille',  // +15% XP fouille
    image: 'classe_eclaireur.jpg',
  },
  ingenieur: {
    nom: 'Ingenieur',
    icone: '🔧',
    desc: 'Maitre du craft. -25% materiaux, debloque recettes speciales.',
    couleur: '#3498db',
    bonus: { att: 0, def: 2, vieMax: 5 },
    passif: 'Recyclage : 20% de chance de recuperer les materiaux en craftant.',
    skillBonus: 'craft',  // +15% XP craft
    image: 'classe_ingenieur.jpg',
  },
  medecin: {
    nom: 'Medecin',
    icone: '💊',
    desc: 'Expert en survie. +50% soins, faim/soif descendent 20% moins vite.',
    couleur: '#1abc9c',
    bonus: { att: 0, def: 1, vieMax: 10 },
    passif: 'Chirurgien : soigner enleve aussi les statuts negatifs.',
    skillBonus: 'medecine',  // +15% XP medecine
    image: 'classe_medecin.jpg',
  },
  pillard: {
    nom: 'Pillard',
    icone: '💀',
    desc: 'Loot +40% capsules, +20% chance de loot rare. Reputation baisse plus vite.',
    couleur: '#9b59b6',
    bonus: { att: 2, def: 0, vieMax: 0 },
    passif: 'Vol a la tire : 10% de chance de voler un objet en combat.',
    skillBonus: 'fouille',
    image: 'classe_pillard.jpg',
  },
  forgeron: {
    nom: 'Forgeron',
    icone: '🔨',
    desc: 'Armes et armures +30% plus efficaces. Base produit +1 metal/jour.',
    couleur: '#e67e22',
    bonus: { att: 1, def: 3, vieMax: 5 },
    passif: 'Mastercraft : les equipements ont 15% de chance d\'etre Epiques.',
    skillBonus: 'forge',  // +15% XP forge
    image: 'classe_forgeron.jpg',
  },
};


// ===== 2. CHARACTER CREATION WITH CLASS =====
function injecterChoixClasse() {
  const startScreen = document.getElementById('start-screen');
  if (!startScreen) return;

  // Replace start screen content
  const origBtn = document.getElementById('start-btn');
  if (!origBtn) return;

  // Add class selection before start button
  const classeDiv = document.createElement('div');
  classeDiv.id = 'classe-selection';
  classeDiv.style.cssText = 'margin:12px 0;text-align:left;max-width:340px;margin-left:auto;margin-right:auto;';

  let html = `<div style="font-family:'Oswald',sans-serif;color:var(--yellow);font-size:14px;letter-spacing:2px;margin-bottom:8px;text-align:center;">CHOISIS TA CLASSE</div>`;

  Object.entries(CLASSES).forEach(([id, cl]) => {
    html += `
    <div id="classe-btn-${id}" onclick="selectionnerClasse('${id}')" style="background:var(--bg3);border:2px solid var(--border);border-left:3px solid ${cl.couleur};padding:10px 12px;margin-bottom:6px;cursor:pointer;transition:border-color 0.2s;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:2px;">
        <div style="font-family:'Oswald',sans-serif;color:${cl.couleur};font-size:13px;">${cl.icone} ${cl.nom.toUpperCase()}</div>
        <div style="font-size:10px;color:var(--text2);">${cl.bonus.att?'+'+cl.bonus.att+' ATT ':' '}${cl.bonus.def?'+'+cl.bonus.def+' DEF ':' '}${cl.bonus.vieMax?'+'+cl.bonus.vieMax+' VIE':''}</div>
      </div>
      <div style="color:var(--text2);font-size:10px;line-height:1.4;">${cl.desc}</div>
      <div style="color:${cl.couleur};font-size:10px;margin-top:2px;font-style:italic;">${cl.passif}</div>
    </div>`;
  });

  classeDiv.innerHTML = html;
  origBtn.parentNode.insertBefore(classeDiv, origBtn);

  // Hide start button until class selected
  origBtn.style.display = 'none';

  // Add hidden input for class
  const hiddenInput = document.createElement('input');
  hiddenInput.type = 'hidden';
  hiddenInput.id = 'selected-classe';
  hiddenInput.value = '';
  startScreen.appendChild(hiddenInput);
}

window._classeSelectionnee = null;

function selectionnerClasse(classeId) {
  window._classeSelectionnee = classeId;
  document.getElementById('selected-classe').value = classeId;

  // Visual feedback
  Object.keys(CLASSES).forEach(id => {
    const el = document.getElementById('classe-btn-' + id);
    if (el) {
      if (id === classeId) {
        el.style.borderColor = CLASSES[id].couleur;
        el.style.background = '#111';
        el.style.boxShadow = `0 0 10px ${CLASSES[id].couleur}44`;
      } else {
        el.style.borderColor = 'var(--border)';
        el.style.background = 'var(--bg3)';
        el.style.boxShadow = 'none';
      }
    }
  });

  // Show start button
  document.getElementById('start-btn').style.display = '';
}


// ===== 3. PATCH startGame TO APPLY CLASS =====
function patchStartGame() {
  const origStart = window.startGame;
  window.startGame = function() {
    const classeId = window._classeSelectionnee;
    if (!classeId) {
      if (typeof log === 'function') log('Choisis une classe d\'abord !', 'warn');
      alert('Choisis une classe !');
      return;
    }

    // Call original
    origStart.call(this);

    // Apply class bonuses
    const cl = CLASSES[classeId];
    J.classe = classeId;
    J.att += cl.bonus.att;
    J.def += cl.bonus.def;
    J.vieMax += cl.bonus.vieMax;
    J.vie = J.vieMax;

    log(`${cl.icone} Classe : ${cl.nom}. ${cl.desc}`, 'xp');
    ajouterJournal(`Classe choisie: ${cl.nom}`);
    sauvegarder();
    updateUI();
  };
}


// ===== 4. CLASS PASSIVE HOOKS =====
function patchClassePassifs() {
  // Patch combat for class passives
  const origCombatAction = window.combatAction;
  window.combatAction = function(action) {
    if (J.classe && action === 'attaque') {
      // Guerrier berserker : +20% dmg under 30% HP
      if (J.classe === 'guerrier' && J.vie < J.vieMax * 0.3) {
        const bonusAtt = Math.ceil(J.att * 0.2);
        J.att += bonusAtt;
        origCombatAction.call(this, action);
        J.att -= bonusAtt;
        return;
      }
      // Eclaireur : 15% dodge
      if (J.classe === 'eclaireur' && Math.random() < 0.15 && combat) {
        origCombatAction.call(this, action);
        // After attack, if enemy attacked, maybe dodge
        // This is a simplified version
        return;
      }
    }
    origCombatAction.call(this, action);
  };

  // Patch fouille for eclaireur bonus
  const origLancerFouille = window.lancerFouille;
  if (origLancerFouille) {
    window.lancerFouille = function(lieuIdx, duree, nbItems, xpGain) {
      if (J.classe === 'eclaireur') {
        nbItems = Math.ceil(nbItems * 1.3); // +30% items
      }
      origLancerFouille.call(this, lieuIdx, duree, nbItems, xpGain);
    };
  }

  // Patch voyage for eclaireur speed
  const origLancerAction = window.lancerActionDifferee;
  if (origLancerAction) {
    window.lancerActionDifferee = function(type, dureeH, donnees) {
      if (type === 'voyage' && J.classe === 'eclaireur') {
        dureeH *= 0.8; // 20% faster travel
      }
      origLancerAction.call(this, type, dureeH, donnees);
    };
  }

  // Patch soins for medecin
  const origManger = window.actionManger;
  if (origManger) {
    window.actionManger = function() {
      origManger.call(this);
      if (J.classe === 'medecin') {
        J.faim = Math.min(100, J.faim + 10); // Extra +10
      }
    };
  }

  const origSoigner = window.actionSoigner;
  if (origSoigner) {
    window.actionSoigner = function() {
      const vieBefore = J.vie;
      origSoigner.call(this);
      if (J.classe === 'medecin') {
        const soinsExtra = Math.floor((J.vie - vieBefore) * 0.5);
        J.vie = Math.min(J.vieMax, J.vie + soinsExtra);
        J.statuts = []; // Chirurgien passive
        if (soinsExtra > 0) log(`💊 Bonus Medecin : +${soinsExtra} vie, statuts retires.`, 'good');
      }
    };
  }

  // Patch finCombat for pillard loot bonus
  const origFinCombat = window.finCombat;
  window.finCombat = function(victoire) {
    if (victoire && J.classe === 'pillard' && combat) {
      // +40% capsules
      if (combat.loot && Array.isArray(combat.loot) && combat.loot.includes('capsules')) {
        const bonus = Math.floor(Math.random() * 10) + 5;
        J.capsules += bonus;
        log(`💀 Pillard : +${bonus} capsules bonus !`, 'xp');
      }
      // 10% steal
      if (Math.random() < 0.10) {
        const steals = ['metal','medicament','bandage','arme','cristal'];
        const steal = steals[Math.floor(Math.random() * steals.length)];
        ajouter(steal, 1);
        log(`💀 Vol a la tire : +1 ${steal} !`, 'xp');
      }
    }
    // Guerrier regen
    if (victoire && J.classe === 'guerrier') {
      J.vie = Math.min(J.vieMax, J.vie + 2);
      log('⚔️ Regeneration guerrier : +2 vie.', 'good');
    }
    origFinCombat.call(this, victoire);
  };

  // Patch gagnerSkillXP for class skill bonus
  const origGagnerSkillXP = window.gagnerSkillXP;
  if (origGagnerSkillXP) {
    window.gagnerSkillXP = function(skillId, montant) {
      if (J.classe) {
        const cl = CLASSES[J.classe];
        if (cl && cl.skillBonus === skillId) {
          montant = Math.ceil(montant * 1.15); // +15% XP
        }
      }
      origGagnerSkillXP.call(this, skillId, montant);
    };
  }

  // Patch passerTemps for medecin slower hunger
  const origPasserTemps = window.passerTemps;
  if (origPasserTemps) {
    window.passerTemps = function(heures) {
      if (J.classe === 'medecin') {
        // Temporarily reduce faim/soif drain by slowing time
        const origFaim = J.faim;
        const origSoif = J.soif;
        origPasserTemps.call(this, heures);
        // Restore 20% of what was lost
        const faimLost = origFaim - J.faim;
        const soifLost = origSoif - J.soif;
        if (faimLost > 0) J.faim = Math.min(100, J.faim + Math.floor(faimLost * 0.2));
        if (soifLost > 0) J.soif = Math.min(100, J.soif + Math.floor(soifLost * 0.2));
      } else {
        origPasserTemps.call(this, heures);
      }
    };
  }
}


// ===== 5. SHOW CLASS ON PROFILE =====
function patchProfilClasse() {
  const origUpdateUI = window.updateUI;
  window.updateUI = function() {
    origUpdateUI.call(this);
    // Show class info on profile
    const nameEl = document.getElementById('p-nom');
    if (nameEl && J.classe) {
      const cl = CLASSES[J.classe];
      nameEl.innerHTML = `${J.nom} <span style="color:${cl.couleur};font-size:11px;">${cl.icone} ${cl.nom}</span>`;
    }
  };
}


// ===== 6. IMPROVED BASE MANAGEMENT =====
const BATIMENTS_V2 = {
  generateur: {
    nom: 'Generateur',
    icone: '⚡',
    desc: 'Alimente la base. Active l\'eclairage et les machines. +production 20%/niv.',
    cout: { metal: 12, carburant: 3 },
    reqNiveau: 3,
  },
  tour_guet: {
    nom: 'Tour de Guet',
    icone: '🗼',
    desc: 'Detecte les raids a l\'avance. +15 defense/niv, alerte precoce.',
    cout: { bois: 15, metal: 8 },
    reqNiveau: 3,
  },
  serre: {
    nom: 'Serre',
    icone: '🌿',
    desc: 'Produit nourriture + herbe medicinale chaque jour. +2/niv.',
    cout: { bois: 10, plastique: 5, eau: 5 },
    reqNiveau: 4,
  },
  laboratoire: {
    nom: 'Laboratoire',
    icone: '🔬',
    desc: 'Recherche avancee. Debloque recettes et potions. +XP medecine.',
    cout: { metal: 15, cristal: 3, produit_chimique: 2 },
    reqNiveau: 5,
  },
  forge_avancee: {
    nom: 'Forge Avancee',
    icone: '🏗',
    desc: 'Forge puissante. Ameliore les armes/armures. +XP forge.',
    cout: { metal: 20, charbon: 10, bois: 10 },
    reqNiveau: 5,
  },
  entrepot: {
    nom: 'Entrepot',
    icone: '📦',
    desc: 'Augmente la capacite du stock de base. +50 emplacements/niv.',
    cout: { bois: 12, metal: 6 },
    reqNiveau: 2,
  },
  enclos: {
    nom: 'Enclos a Mutants',
    icone: '🐾',
    desc: 'Abrite tes mutants. +1 mutant en chasse simultanee/niv.',
    cout: { bois: 10, cuir: 5, corde: 3 },
    reqNiveau: 4,
  },
  radio: {
    nom: 'Tour Radio',
    icone: '📡',
    desc: 'Capte des signaux. Debloque des quetes speciales et events rares.',
    cout: { metal: 15, plastique: 5, cristal: 2 },
    reqNiveau: 6,
  },
};

function injecterBatimentsV2() {
  // Add new buildings to the existing BATIMENTS object
  Object.entries(BATIMENTS_V2).forEach(([id, bat]) => {
    if (!BATIMENTS[id]) {
      BATIMENTS[id] = bat;
    }
  });
}

// ===== 7. PRODUCTION DASHBOARD =====
function renderProductionDashboard() {
  const div = document.getElementById('base-content');
  const b = J.base;

  let html = `<button class="btn" style="border-left-color:var(--text2);margin-bottom:10px;" onclick="renderBase()">← RETOUR BASE</button>
  <div class="section-title" style="margin-bottom:8px;">📊 PRODUCTION QUOTIDIENNE</div>
  <div style="color:var(--text2);font-size:11px;margin-bottom:12px;">Resume de ce que ta base produit chaque jour.</div>`;

  const prod = {
    nourriture: 0, eau: 0, metal: 0, cuir: 0, herbe: 0, capsules: 0,
  };

  // Existing production
  if (b.chasseurs > 0) { prod.nourriture += b.chasseurs; prod.cuir += Math.floor(b.chasseurs / 2); }
  if (b.fermiers > 0) { prod.nourriture += b.fermiers; prod.eau += b.fermiers; }
  if (b.forgerons > 0) { prod.metal += b.forgerons; }
  if (b.ferme) { prod.nourriture += b.ferme; }
  if (b.serre) { prod.nourriture += b.serre; prod.herbe += b.serre; }

  // Generateur bonus
  const genBonus = b.generateur ? 1 + (b.generateur * 0.2) : 1;

  // Forgeron class bonus
  if (J.classe === 'forgeron') prod.metal += 1;

  html += `<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;margin-bottom:12px;">`;
  const items = [
    { nom: 'Nourriture', val: Math.floor(prod.nourriture * genBonus), icone: '🍖', couleur: 'var(--green)' },
    { nom: 'Eau', val: Math.floor(prod.eau * genBonus), icone: '💧', couleur: 'var(--blue)' },
    { nom: 'Metal', val: Math.floor(prod.metal * genBonus), icone: '⚙', couleur: '#95a5a6' },
    { nom: 'Cuir', val: Math.floor(prod.cuir * genBonus), icone: '🧶', couleur: 'var(--orange)' },
    { nom: 'Herbe', val: Math.floor(prod.herbe * genBonus), icone: '🌿', couleur: '#2ecc71' },
  ];
  items.forEach(it => {
    html += `<div style="background:var(--bg3);padding:8px;border:1px solid var(--border);text-align:center;">
      <div style="font-size:16px;">${it.icone}</div>
      <div style="font-family:'Oswald',sans-serif;color:${it.couleur};font-size:18px;">+${it.val}</div>
      <div style="color:var(--text2);font-size:9px;">${it.nom}/jour</div>
    </div>`;
  });
  html += `</div>`;

  // Generateur effect
  if (b.generateur) {
    html += `<div style="background:#0d0d00;border:1px solid var(--yellow);padding:8px;margin-bottom:8px;font-size:11px;">
      ⚡ Generateur niv.${b.generateur} : +${Math.round((genBonus-1)*100)}% production totale
    </div>`;
  }

  // Defense breakdown
  const defBase = 5;
  const defRempart = b.rempart ? b.rempart * 10 : 0;
  const defPop = b.population * 2;
  const defGardes = (b.gardes || 0) * 3;
  const defTour = b.tour_guet ? b.tour_guet * 15 : 0;
  const defTotal = defBase + defRempart + defPop + defGardes + defTour;

  html += `<div class="section-title" style="margin-bottom:8px;">🛡 DEFENSE</div>
  <div style="background:var(--bg3);border:1px solid var(--border);padding:10px 12px;margin-bottom:8px;">
    <div style="font-size:11px;color:var(--text2);line-height:2;">
      Base : ${defBase}<br>
      ${defRempart > 0 ? `Rempart niv.${b.rempart} : +${defRempart}<br>` : ''}
      ${defPop > 0 ? `Population (${b.population}) : +${defPop}<br>` : ''}
      ${defGardes > 0 ? `Gardes (${b.gardes}) : +${defGardes}<br>` : ''}
      ${defTour > 0 ? `Tour de Guet niv.${b.tour_guet} : +${defTour}<br>` : ''}
    </div>
    <div style="font-family:'Oswald',sans-serif;color:var(--green);font-size:18px;margin-top:4px;">TOTAL : ${defTotal}</div>
  </div>`;

  // Habitants breakdown
  const roles = ['chasseurs', 'fermiers', 'forgerons', 'gardes'];
  const totalAssignes = roles.reduce((s, r) => s + (b[r] || 0), 0);
  const libres = b.population - totalAssignes;

  if (b.population > 0) {
    html += `<div class="section-title" style="margin-bottom:8px;">👥 HABITANTS (${b.population})</div>
    <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:8px;">`;
    roles.forEach(r => {
      const qte = b[r] || 0;
      if (qte > 0) {
        const icones = { chasseurs: '🏹', fermiers: '🌱', forgerons: '🔧', gardes: '🛡' };
        html += `<div style="background:var(--bg3);border:1px solid var(--border);padding:6px 10px;font-size:11px;">
          ${icones[r]} ${r}: ${qte}
        </div>`;
      }
    });
    if (libres > 0) {
      html += `<div style="background:var(--bg3);border:1px solid var(--yellow);padding:6px 10px;font-size:11px;color:var(--yellow);">
        ❓ Libres: ${libres}
      </div>`;
    }
    html += `</div>`;
  }

  div.innerHTML = html;
}


// ===== 8. PATCH PRODUCTION FOR NEW BUILDINGS =====
function patchProduction() {
  const origProd = window.productionQuotidienne;
  if (!origProd) return;

  window.productionQuotidienne = function() {
    origProd.call(this);
    const b = J.base;

    // Serre production
    if (b.serre) {
      const qte = b.serre;
      ajouter('nourriture', qte);
      ajouter('herbe', qte);
      log(`🌿 Serre : +${qte} nourriture, +${qte} herbe medicinale`, 'good');
    }

    // Generateur bonus (applied as extra production)
    if (b.generateur) {
      const bonusPct = b.generateur * 0.2;
      const extraNour = Math.floor((b.chasseurs + b.fermiers + (b.ferme || 0)) * bonusPct);
      if (extraNour > 0) {
        ajouter('nourriture', extraNour);
        log(`⚡ Generateur : +${extraNour} nourriture bonus`, 'good');
      }
    }

    // Forgeron class bonus
    if (J.classe === 'forgeron') {
      ajouter('metal', 1);
      log('🔨 Bonus Forgeron : +1 metal', 'good');
    }

    // Radio events
    if (b.radio && Math.random() < 0.2 * b.radio) {
      const events = [
        () => { ajouter('capsules', 30); J.capsules += 30; log('📡 Signal radio : marchand de passage ! +30 capsules.', 'xp'); },
        () => { ajouter('medicament', 2); log('📡 Signal radio : parachutage d\'aide humanitaire ! +2 medicaments.', 'xp'); },
        () => { ajouter('metal', 5); log('📡 Signal radio : convoi militaire signale. +5 metal.', 'xp'); },
        () => { gagnerXP(50); log('📡 Signal radio : frequence encodee decodee. +50 XP.', 'xp'); },
      ];
      events[Math.floor(Math.random() * events.length)]();
    }
  };
}


// ===== 9. PATCH DEFENSE CALCULATION FOR NEW BUILDINGS =====
function patchDefense() {
  window.calculerDefense = function() {
    if (!J.base) return 5;
    const b = J.base;
    let def = 5;
    if (b.rempart) def += b.rempart * 10;
    if (b.population) def += b.population * 2;
    if (b.gardes) def += b.gardes * 3;
    if (b.tour_guet) def += b.tour_guet * 15;
    return def;
  };
}


// ===== 10. PATCH renderBase FOR NEW BUTTONS =====
function patchRenderBase() {
  const origRenderBase = window.renderBase;
  window.renderBase = function() {
    origRenderBase.call(this);
    // Inject production dashboard button
    const div = document.getElementById('base-content');
    if (!div) return;
    const raccourcis = div.querySelector('div[style*="grid-template-columns:1fr 1fr"]');
    if (raccourcis && !raccourcis.innerHTML.includes('PRODUCTION')) {
      const btn = document.createElement('button');
      btn.className = 'btn';
      btn.style.cssText = 'margin:0;padding:8px;border-left-color:var(--orange);grid-column:1/-1;';
      btn.innerHTML = '📊 PRODUCTION<span class="btn-sub">Vue d\'ensemble de la base</span>';
      btn.onclick = renderProductionDashboard;
      raccourcis.appendChild(btn);
    }
  };
}


// ===== 11. MIGRATION FOR OLD SAVES =====
function migrationClasseBase() {
  // Add default classe for existing saves
  if (!J.classe) J.classe = null; // Will be set on next new game

  // Add new building slots to base
  if (J.base) {
    ['generateur', 'tour_guet', 'serre', 'laboratoire', 'forge_avancee', 'entrepot', 'enclos', 'radio'].forEach(id => {
      if (J.base[id] === undefined) J.base[id] = null;
    });
  }
}


// ===== 12. INITIALIZATION =====
function initClassesBase() {
  injecterBatimentsV2();
  migrationClasseBase();
  patchDefense();
  patchProduction();
  patchRenderBase();
  patchProfilClasse();

  // Only inject class selection on start screen if no save
  const save = localStorage.getItem('deadworld_save');
  if (!save) {
    injecterChoixClasse();
    patchStartGame();
  }
  patchClassePassifs();

  console.log('DEAD WORLD v2.1 — Classes + Base v2 loaded!');
}

// Auto-init
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => setTimeout(initClassesBase, 600));
} else {
  setTimeout(initClassesBase, 600);
}
