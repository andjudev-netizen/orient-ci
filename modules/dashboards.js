import { StorageManager } from './storage.js';
import { CAREER_DOMAINS, UNIVERSITIES } from '../data.js';

export const DashboardsUI = {
  render(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = '';
    const user = StorageManager.getCurrentUser();

    // Rendre l'espace selon le rôle de l'utilisateur
    if (user.role === 'student') {
      this.renderStudentDashboard(container, user);
    } else if (user.role === 'parent') {
      this.renderParentDashboard(container, user);
    } else if (user.role === 'school') {
      this.renderSchoolDashboard(container, user);
    } else {
      this.renderAnonymousDashboard(container);
    }
  },

  renderAnonymousDashboard(container) {
    container.innerHTML = `
      <div class="anonymous-dashboard glass text-center py-5 px-4">
        <span class="dashboard-lock-icon">🔒</span>
        <h2 class="mt-3">Espace Personnel Sécurisé</h2>
        <p class="subtitle max-w-md mx-auto mt-2">Connectez-vous ou souscrivez à un forfait pour accéder à votre tableau de bord élève, parent ou établissement.</p>
        
        <div class="role-selector-cards mt-5">
          <div class="role-card glass-card">
            <h3>Élève</h3>
            <p>Accédez à votre test d'orientation, sauvegardez vos favoris et débloquez vos recommandations.</p>
            <button class="btn btn-secondary mt-3 select-anonymous-role" data-role="student">Simuler Accès Élève</button>
          </div>
          <div class="role-card glass-card">
            <h3>Parent</h3>
            <p>Suivez l'orientation de vos enfants, téléchargez leurs rapports et échangez avec nos experts.</p>
            <button class="btn btn-secondary mt-3 select-anonymous-role" data-role="parent">Simuler Accès Parent</button>
          </div>
          <div class="role-card glass-card">
            <h3>Établissement</h3>
            <p>Gérez les licences de vos élèves, observez les statistiques collectives et pilotez l'orientation.</p>
            <button class="btn btn-secondary mt-3 select-anonymous-role" data-role="school">Simuler Accès École</button>
          </div>
        </div>

        <div class="divider mt-5"><span>OU</span></div>

        <div class="mt-4">
          <p>Vous n'avez pas encore d'abonnement ?</p>
          <a href="#tarifs" class="btn btn-orange mt-2">Découvrir les Tarifs</a>
        </div>
      </div>
    `;

    // Attacher les écouteurs de simulation de rôle
    container.querySelectorAll('.select-anonymous-role').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const role = e.target.dataset.role;
        // Créer un utilisateur temporaire non payant
        const tempUser = {
          role: role,
          id: role === 'student' ? 'student_1' : undefined,
          name: role === 'student' ? 'Kouassi Konan Yao' : (role === 'parent' ? 'M. Kouassi Koffi' : 'Lycée Municipal d\'Adjamé'),
          activeSubscription: false,
          plan: null
        };
        
        if (role === 'student') {
          tempUser.grades = {};
          tempUser.series = '';
          tempUser.interests = [];
        } else if (role === 'school') {
          tempUser.schoolId = 'school_demo';
        }

        StorageManager.setCurrentUser(tempUser);
        window.location.reload();
      });
    });
  },

  renderStudentDashboard(container, user) {
    container.innerHTML = '';
    const students = StorageManager.getStudents();
    // Rechercher si l'élève est enregistré
    let studentData = students.find(s => s.name === user.name) || user;
    const isPremium = user.activeSubscription;

    // En-tête
    const header = document.createElement('header');
    header.className = 'dashboard-header glass-card';
    header.innerHTML = `
      <div class="header-user-info">
        <span class="user-avatar">👨‍🎓</span>
        <div>
          <h2>Bonjour, ${user.name}</h2>
          <p class="subtitle">Espace Personnel de Terminale</p>
        </div>
      </div>
      <div class="header-status">
        ${isPremium 
          ? `<span class="badge badge-green-glow">✓ Abonnement ${user.plan === 'school' ? 'École' : 'Personnel'} Actif</span>`
          : `<span class="badge badge-orange-glow">🔒 Mode Gratuit Limité</span>`
        }
      </div>
    `;
    container.appendChild(header);

    // Contenu principal du dashboard
    const mainGrid = document.createElement('div');
    mainGrid.className = 'dashboard-grid mt-4';

    // Colonne de gauche (Recommandations & Favoris)
    const leftCol = document.createElement('div');
    leftCol.className = 'dashboard-main-col';

    // Section 1: Profil et notes
    const profileCard = document.createElement('div');
    profileCard.className = 'dashboard-card glass';
    profileCard.innerHTML = `
      <h3>Mon Profil de Terminale</h3>
      <div class="student-profile-summary mt-3">
        <div class="profile-meta-item">
          <strong>Série de BAC :</strong> 
          <span class="profile-badge">${studentData.series || 'Non définie'}</span>
        </div>
        <div class="profile-meta-item">
          <strong>Moyenne Estimée :</strong> 
          <span class="profile-badge badge-green">${studentData.average ? `${studentData.average}/20` : 'Non calculée'}</span>
        </div>
      </div>

      ${studentData.grades && Object.keys(studentData.grades).length > 0 ? `
        <div class="profile-grades-mini mt-3">
          <h4>Mes Notes saisies :</h4>
          <div class="grades-badge-list mt-2">
            ${Object.entries(studentData.grades).map(([subj, gr]) => `
              <span class="grade-pill">${subj} : <strong>${gr}</strong></span>
            `).join('')}
          </div>
        </div>
      ` : ''}

      <div class="mt-4">
        <a href="#orienter" class="btn btn-secondary btn-sm">Modifier mes notes / Refaire le test</a>
        <button class="btn btn-primary btn-sm restart-test-btn">Recommencer le test</button>
      </div>
    `;
    leftCol.appendChild(profileCard);
        // Attach listener for "Recommencer le test" button
        setTimeout(() => {
          const restartBtn = container.querySelector('.restart-test-btn');
          if (restartBtn) {
            restartBtn.addEventListener('click', () => {
              // Navigate to the orientation test view, which resets state
              window.location.hash = '#orienter';
            });
          }
        }, 50);

    // Section 2: Recommandations
    const recsCard = document.createElement('div');
    recsCard.className = 'dashboard-card glass mt-4';
    
    if (studentData.results && studentData.results.length > 0) {
      const topRecs = studentData.results.slice(0, 3);
      recsCard.innerHTML = `
        <h3>Mes Recommandations (Top 3)</h3>
        <p class="subtitle">Calculé selon vos notes de terminale et vos intérêts.</p>
        
        <div class="recs-mini-list mt-3">
          ${topRecs.map((r, i) => `
            <div class="rec-mini-item glass-card">
              <div class="rec-mini-meta">
                <span class="rec-mini-logo">${r.universityLogo}</span>
                <div>
                  <strong>${r.program.name}</strong>
                  <p class="text-small text-muted">${r.universityName}</p>
                </div>
              </div>
              <div class="rec-mini-score bg-green-glow">${r.matchPercentage}%</div>
            </div>
          `).join('')}
        </div>
        <div class="mt-3 text-right">
          <a href="#orienter" class="btn btn-primary btn-sm">Voir tous les résultats</a>
        </div>
      `;
    } else {
      recsCard.innerHTML = `
        <h3>Calculer mon Orientation</h3>
        <p class="subtitle">Entrez vos notes de terminale et découvrez les universités publiques et grandes écoles ivoiriennes qui vous correspondent.</p>
        <div class="text-center py-4">
          <span class="decor-icon">🎯</span>
          <p class="mt-2">Vous n'avez pas encore finalisé votre test d'orientation.</p>
          <a href="#orienter" class="btn btn-primary mt-3">Lancer le Test d'Orientation</a>
        </div>
      `;
    }
    leftCol.appendChild(recsCard);

    // Section 3: Favoris
    const favsCard = document.createElement('div');
    favsCard.className = 'dashboard-card glass mt-4';
    const favorites = user.favorites || [];
    favsCard.innerHTML = `
      <h3>Filières Favorites</h3>
      ${favorites.length > 0 ? `
        <ul class="favorites-list mt-3">
          ${favorites.map(fav => `
            <li>
              <span>⭐ ${fav}</span>
              <button class="btn-remove-fav text-error" data-fav="${fav}" aria-label="Supprimer ${fav} des favoris">&times;</button>
            </li>
          `).join('')}
        </ul>
      ` : `
        <p class="text-muted mt-3">Aucune filière sauvegardée en favori pour le moment. Parcourez vos résultats d'orientation pour en ajouter.</p>
      `}
    `;
    leftCol.appendChild(favsCard);

    // Événement de suppression de favori
    setTimeout(() => {
      favsCard.querySelectorAll('.btn-remove-fav').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const toRemove = e.target.dataset.fav;
          user.favorites = user.favorites.filter(f => f !== toRemove);
          StorageManager.setCurrentUser(user);
          if (studentData.id) {
            studentData.favorites = user.favorites;
            StorageManager.saveStudent(studentData);
          }
          this.renderStudentDashboard(container, user);
        });
      });
    }, 50);

    mainGrid.appendChild(leftCol);

    // Colonne de droite (Abonnement et Activation)
    const rightCol = document.createElement('aside');
    rightCol.className = 'dashboard-side-col';

    // Carte d'abonnement / activation par code école
    const activationCard = document.createElement('div');
    activationCard.className = 'dashboard-card glass';
    
    if (isPremium) {
      activationCard.innerHTML = `
        <h3>Mon Forfait Actif</h3>
        <div class="active-plan-badge mt-3">
          <span class="plan-emoji">💳</span>
          <div>
            <strong>${user.plan === 'school' ? 'Forfait Établissement' : (user.plan === 'parent' ? 'Formule Parent' : 'Formule Élève')}</strong>
            <p class="text-small text-muted">Statut : Renouvellement automatique</p>
          </div>
        </div>
        <div class="plan-details mt-3 text-small">
          <p>✓ Accès illimité au conseiller virtuel</p>
          <p>✓ Toutes les fiches d'admissions débloquées</p>
          <p>✓ Sauvegarde des filières favorites</p>
        </div>
        <button class="btn btn-secondary btn-sm btn-block mt-4" id="btn-cancel-sub">Se déconnecter / Simuler Résiliation</button>
      `;
      setTimeout(() => {
        const cancelBtn = activationCard.querySelector('#btn-cancel-sub');
        if (cancelBtn) {
          cancelBtn.addEventListener('click', () => {
            StorageManager.logout();
          });
        }
      }, 50);
    } else {
      activationCard.innerHTML = `
        <h3>Activer ma Version Premium</h3>
        <p class="subtitle text-small">Votre lycée a souscrit à Orient.ci ? Saisissez le code d'accès fourni par votre administration.</p>
        
        <div class="activation-code-form mt-3">
          <div class="form-group">
            <label for="input-school-code">Code d'accès Établissement :</label>
            <input type="text" id="input-school-code" class="input-text uppercase" placeholder="Ex: ABIDJAN-INP-2026">
          </div>
          <button class="btn btn-primary btn-sm btn-block mt-2" id="submit-school-code-btn">Activer par Code École</button>
          <div class="code-activation-feedback mt-2 text-small text-error" id="code-feedback" aria-live="polite"></div>
        </div>

        <div class="divider my-4"><span>OU S'ABONNER</span></div>

        <p class="text-small">Souscrivez individuellement à notre formule mensuelle pour débloquer tous vos résultats.</p>
        <a href="#tarifs" class="btn btn-orange btn-block btn-sm mt-2 text-center">Souscrire (1 500 FCFA/mois)</a>
      `;

      setTimeout(() => {
        const codeInput = activationCard.querySelector('#input-school-code');
        const codeBtn = activationCard.querySelector('#submit-school-code-btn');
        const feedback = activationCard.querySelector('#code-feedback');

        if (codeBtn) {
          codeBtn.addEventListener('click', () => {
            feedback.textContent = '';
            const codeVal = codeInput.value.trim().toUpperCase();
            if (!codeVal) {
              feedback.textContent = 'Veuillez saisir un code.';
              feedback.className = 'code-activation-feedback mt-2 text-small text-error';
              return;
            }

            const result = StorageManager.useSchoolCode(codeVal, user.name);
            if (result.success) {
              feedback.textContent = 'Félicitations ! Code école activé avec succès.';
              feedback.className = 'code-activation-feedback mt-2 text-small text-success';
              
              // Activer l'abonnement élève via l'école
              StorageManager.activateSubscription('student', 'school', {
                method: 'Code Établissement',
                schoolId: result.schoolId
              });

              setTimeout(() => {
                window.location.reload();
              }, 1500);
            } else {
              feedback.textContent = result.error || 'Code invalide.';
              feedback.className = 'code-activation-feedback mt-2 text-small text-error';
            }
          });
        }
      }, 50);
    }
    
    rightCol.appendChild(activationCard);

    // Section Conseils
    const guidanceCard = document.createElement('div');
    guidanceCard.className = 'dashboard-card glass mt-4';
    guidanceCard.innerHTML = `
      <h3>Dates clés du BAC 2026</h3>
      <ul class="dates-list mt-3 text-small">
        <li><strong>Fin Mai 2026 :</strong> Clôture des vœux d'orientation régionaux.</li>
        <li><strong>Juin 2026 :</strong> Épreuves écrites du BACCALAUREAT.</li>
        <li><strong>Juillet 2026 :</strong> Proclamation des résultats du BAC.</li>
        <li><strong>Août 2026 :</strong> Ouverture de la plateforme d'orientation du MESRS (supérieur).</li>
      </ul>
    `;
    rightCol.appendChild(guidanceCard);

    mainGrid.appendChild(rightCol);
    container.appendChild(mainGrid);
  },

  renderParentDashboard(container, user) {
    container.innerHTML = '';
    const isPremium = user.activeSubscription;

    // En-tête
    const header = document.createElement('header');
    header.className = 'dashboard-header glass-card';
    header.innerHTML = `
      <div class="header-user-info">
        <span class="user-avatar">👨‍👩‍👦</span>
        <div>
          <h2>Espace Parent — ${user.name}</h2>
          <p class="subtitle">Suivi d'orientation de vos enfants</p>
        </div>
      </div>
      <div class="header-status">
        ${isPremium 
          ? `<span class="badge badge-green-glow">✓ Abonnement Parent Actif</span>`
          : `<span class="badge badge-orange-glow">🔒 Mode Gratuit (Accès Limité)</span>`
        }
      </div>
    `;
    container.appendChild(header);

    // Contenu principal
    const mainGrid = document.createElement('div');
    mainGrid.className = 'dashboard-grid mt-4';

    // Colonne de gauche (Suivi des enfants)
    const leftCol = document.createElement('div');
    leftCol.className = 'dashboard-main-col';

    // Carte de suivi
    const trackingCard = document.createElement('div');
    trackingCard.className = 'dashboard-card glass';
    trackingCard.innerHTML = `
      <h3>Profils de mes Enfants</h3>
      
      <div class="children-list mt-3">
        <!-- Enfant 1 (Démo pré-chargé) -->
        <div class="child-card glass-card p-3">
          <div class="child-meta">
            <div>
              <h4>Yao Kouassi Junior</h4>
              <p class="text-small text-muted">Élève en Terminale C au Lycée Scientifique de Yamoussoukro</p>
            </div>
            <span class="badge badge-blue">BAC C</span>
          </div>
          
          <div class="child-progress mt-3">
            <div class="progress-bar-container">
              <span class="progress-bar-label text-small">Progression du projet d'orientation : 85%</span>
              <div class="progress-bar"><div class="progress-fill" style="width: 85%"></div></div>
            </div>
          </div>

          <div class="child-results-summary mt-3 text-small">
            <p><strong>Dernière moyenne saisie :</strong> 14.50/20</p>
            <p><strong>Orientation recommandée :</strong> Classes Préparatoires (CPGE MPSI) — INP-HB (90% d'adéquation)</p>
          </div>

          <div class="child-actions mt-3">
            <button class="btn btn-secondary btn-sm download-report-btn" data-child="Yao Junior">Télécharger le Rapport d'Orientation (PDF)</button>
          </div>
        </div>
      </div>
    `;
    leftCol.appendChild(trackingCard);

    // Module de chat d'orientation
    const chatCard = document.createElement('div');
    chatCard.className = 'dashboard-card glass mt-4';
    chatCard.innerHTML = `
      <h3>Ligne Directe avec un Conseiller Expert</h3>
      <p class="subtitle">Posez toutes vos questions sur les inscriptions et les frais de scolarité des universités publiques et privées.</p>
      
      ${isPremium ? `
        <div class="chat-container mt-3 glass-card">
          <div class="chat-messages" id="chat-messages" aria-live="polite">
            <div class="chat-message system">
              <p>Discussion sécurisée avec M. Traoré, Conseiller principal d'orientation post-BAC.</p>
            </div>
            <div class="chat-message agent">
              <span class="message-sender">M. Traoré</span>
              <div class="message-bubble">
                <p>Bonjour M. Kouassi. J'ai analysé les notes de Yao Junior en Terminale C. Ses excellentes moyennes en mathématiques (15/20) et physique-chimie (16/20) le qualifient parfaitement pour les Classes Préparatoires de l'INP-HB ou l'ESATIC. Avez-vous des questions sur les procédures d'inscription ?</p>
              </div>
              <span class="message-time">Aujourd'hui, 08:30</span>
            </div>
          </div>
          
          <div class="chat-input-area">
            <label for="chat-text-input" class="sr-only">Votre message</label>
            <input type="text" id="chat-text-input" placeholder="Tapez votre question ici..." aria-label="Tapez votre message">
            <button class="btn btn-primary" id="chat-send-btn">Envoyer</button>
          </div>
        </div>
      ` : `
        <div class="chat-locked-overlay py-4 text-center">
          <span class="lock-icon">🔒</span>
          <p class="mt-2">La consultation directe avec nos conseillers est réservée aux abonnés Premium.</p>
          <a href="#tarifs" class="btn btn-orange btn-sm mt-3">Débloquer cette fonctionnalité</a>
        </div>
      `}
    `;
    leftCol.appendChild(chatCard);

    // Gérer l'événement de chat et téléchargement de rapport
    setTimeout(() => {
      // Télécharger rapport simulation
      trackingCard.querySelectorAll('.download-report-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          if (!isPremium) {
            alert("Le téléchargement de rapports complets au format PDF est une fonctionnalité Premium. Veuillez souscrire à la formule Parent.");
            window.location.hash = '#tarifs';
            return;
          }
          
          btn.textContent = 'Génération en cours...';
          btn.disabled = true;
          setTimeout(() => {
            btn.textContent = '✓ Téléchargé';
            // Simuler le téléchargement
            const dummyBlob = new Blob(["Rapport d'Orientation Orient.ci pour Yao Kouassi Junior\nSérie BAC C - Moyenne: 14.50\nFilière recommandée: INP-HB CPGE (90%)\nAutre choix: ESATIC (85%)\nEdité le " + new Date().toLocaleDateString('fr-FR')], {type: "text/plain;charset=utf-8"});
            const url = URL.createObjectURL(dummyBlob);
            const a = document.createElement('a');
            a.href = url;
            a.download = "Rapport_Orientation_Yao_Junior.txt";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            
            setTimeout(() => {
              btn.textContent = "Télécharger le Rapport d'Orientation (PDF)";
              btn.disabled = false;
            }, 3000);
          }, 1500);
        });
      });

      // Chat send message simulation
      const sendBtn = chatCard.querySelector('#chat-send-btn');
      const chatInput = chatCard.querySelector('#chat-text-input');
      const messagesContainer = chatCard.querySelector('#chat-messages');

      if (sendBtn && chatInput) {
        const sendMessage = () => {
          const text = chatInput.value.trim();
          if (!text) return;

          // Ajouter le message parent
          const parentMsg = document.createElement('div');
          parentMsg.className = 'chat-message user';
          parentMsg.innerHTML = `
            <div class="message-bubble">
              <p>${text}</p>
            </div>
            <span class="message-time">À l'instant</span>
          `;
          messagesContainer.appendChild(parentMsg);
          chatInput.value = '';
          messagesContainer.scrollTop = messagesContainer.scrollHeight;

          // Simuler une réponse automatique du conseiller après 2 secondes
          setTimeout(() => {
            const replyMsg = document.createElement('div');
            replyMsg.className = 'chat-message agent';
            replyMsg.innerHTML = `
              <span class="message-sender">M. Traoré</span>
              <div class="message-bubble">
                <p>Bien reçu. Je note votre question et je vous apporte des précisions sur les bourses d'études et le logement à Yamoussoukro d'ici quelques instants.</p>
              </div>
              <span class="message-time">À l'instant</span>
            `;
            messagesContainer.appendChild(replyMsg);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
          }, 2000);
        };

        sendBtn.addEventListener('click', sendMessage);
        chatInput.addEventListener('keypress', (e) => {
          if (e.key === 'Enter') sendMessage();
        });
      }
    }, 50);

    mainGrid.appendChild(leftCol);

    // Colonne de droite (Abonnement et liens d'achat)
    const rightCol = document.createElement('aside');
    rightCol.className = 'dashboard-side-col';

    const subCard = document.createElement('div');
    subCard.className = 'dashboard-card glass';
    if (isPremium) {
      subCard.innerHTML = `
        <h3>Abonnement Parent</h3>
        <div class="active-plan-badge mt-3">
          <span class="plan-emoji">💳</span>
          <div>
            <strong>Formule Parent active</strong>
            <p class="text-small text-muted">Tarif: 3 000 FCFA/mois</p>
          </div>
        </div>
        <p class="text-small mt-3">Facture prélevée sur votre compte mobile le ${new Date().toLocaleDateString('fr-FR')}.</p>
        <button class="btn btn-secondary btn-sm btn-block mt-3" id="btn-logout-parent">Se déconnecter</button>
      `;
      setTimeout(() => {
        document.getElementById('btn-logout-parent').addEventListener('click', () => {
          StorageManager.logout();
        });
      }, 50);
    } else {
      subCard.innerHTML = `
        <h3>Passer au Forfait Parent</h3>
        <p class="subtitle text-small">Obtenez un accompagnement sur mesure pour sécuriser l'avenir post-bac de votre enfant.</p>
        <a href="#tarifs" class="btn btn-orange btn-block btn-sm mt-3 text-center">Activer pour 3 000 FCFA/mois</a>
      `;
    }
    rightCol.appendChild(subCard);

    // Conseils parentaux
    const helperCard = document.createElement('div');
    helperCard.className = 'dashboard-card glass mt-4';
    helperCard.innerHTML = `
      <h3>Guide de l'Orientation Parent</h3>
      <p class="text-small">
        En Côte d'Ivoire, les affectations dans le public dépendent à la fois de la moyenne d'orientation calculée par la DEXC (Direction des Examens et Concours) et des capacités d'accueil des universités. 
      </p>
      <p class="text-small mt-2 font-semibold text-warning-bullet">💡 Conseil : Sélectionnez toujours au moins un vœu de secours dans une grande école privée agréée pour parer aux imprévus.</p>
    `;
    rightCol.appendChild(helperCard);

    mainGrid.appendChild(rightCol);
    container.appendChild(mainGrid);
  },

  renderSchoolDashboard(container, user) {
    container.innerHTML = '';
    const isPremium = user.activeSubscription;

    // En-tête
    const header = document.createElement('header');
    header.className = 'dashboard-header glass-card';
    header.innerHTML = `
      <div class="header-user-info">
        <span class="user-avatar">🏫</span>
        <div>
          <h2>${user.name} — Portail Administrateur</h2>
          <p class="subtitle">Gestion collective des classes de Terminale</p>
        </div>
      </div>
      <div class="header-status">
        ${isPremium 
          ? `<span class="badge badge-green-glow">✓ Licence Établissement Active</span>`
          : `<span class="badge badge-orange-glow">🔒 Version d'évaluation</span>`
        }
      </div>
    `;
    container.appendChild(header);

    // Contenu principal
    const mainGrid = document.createElement('div');
    mainGrid.className = 'dashboard-grid mt-4';

    // Colonne de gauche (Liste des élèves et graphiques)
    const leftCol = document.createElement('div');
    leftCol.className = 'dashboard-main-col';

    // Section Statistique avec un graphique SVG de grande qualité
    const statsCard = document.createElement('div');
    statsCard.className = 'dashboard-card glass';
    statsCard.innerHTML = `
      <h3>Statistiques de la Promotion de Terminale</h3>
      <p class="subtitle">Répartition des choix d'orientation principaux des élèves (180 élèves au total)</p>
      
      <div class="stats-visualization mt-4">
        <!-- Graphique SVG personnalisé -->
        <svg viewBox="0 0 500 200" class="svg-chart" aria-label="Graphique des intentions d'orientation" role="img">
          <!-- Grille de fond -->
          <line x1="50" y1="20" x2="480" y2="20" stroke="rgba(255,255,255,0.1)" stroke-dasharray="4"/>
          <line x1="50" y1="70" x2="480" y2="70" stroke="rgba(255,255,255,0.1)" stroke-dasharray="4"/>
          <line x1="50" y1="120" x2="480" y2="120" stroke="rgba(255,255,255,0.1)" stroke-dasharray="4"/>
          <line x1="50" y1="170" x2="480" y2="170" stroke="rgba(255,255,255,0.2)"/>
          
          <!-- Barres de données -->
          <!-- Santé & Médecine (35%) -->
          <rect x="70" y="70" width="40" height="100" rx="4" fill="url(#blueGrad)" class="chart-bar" />
          <text x="90" y="60" text-anchor="middle" fill="#fff" class="chart-val-text">35%</text>
          
          <!-- Ingénierie & TIC (45%) -->
          <rect x="150" y="40" width="40" height="130" rx="4" fill="url(#orangeGrad)" class="chart-bar" />
          <text x="170" y="30" text-anchor="middle" fill="#fff" class="chart-val-text">45%</text>
          
          <!-- Commerce & Gestion (12%) -->
          <rect x="230" y="130" width="40" height="40" rx="4" fill="url(#greenGrad)" class="chart-bar" />
          <text x="250" y="120" text-anchor="middle" fill="#fff" class="chart-val-text">12%</text>
          
          <!-- Droit (8%) -->
          <rect x="310" y="145" width="40" height="25" rx="4" fill="url(#pinkGrad)" class="chart-bar" />
          <text x="330" y="135" text-anchor="middle" fill="#fff" class="chart-val-text">8%</text>

          <!-- Lettres et Autres (5%) -->
          <rect x="390" y="155" width="40" height="15" rx="4" fill="#a0aec0" class="chart-bar" />
          <text x="410" y="145" text-anchor="middle" fill="#fff" class="chart-val-text">5%</text>

          <!-- Libellés d'axes -->
          <text x="90" y="190" text-anchor="middle" fill="#a0aec0" class="chart-label-text">Santé</text>
          <text x="170" y="190" text-anchor="middle" fill="#a0aec0" class="chart-label-text">Ingénierie/TIC</text>
          <text x="250" y="190" text-anchor="middle" fill="#a0aec0" class="chart-label-text">Commerce</text>
          <text x="330" y="190" text-anchor="middle" fill="#a0aec0" class="chart-label-text">Droit</text>
          <text x="410" y="190" text-anchor="middle" fill="#a0aec0" class="chart-label-text">Lettres</text>

          <!-- Dégradés de couleurs -->
          <defs>
            <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#4299e1" />
              <stop offset="100%" stop-color="#2b6cb0" />
            </linearGradient>
            <linearGradient id="orangeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#ed8936" />
              <stop offset="100%" stop-color="#dd6b20" />
            </linearGradient>
            <linearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#48bb78" />
              <stop offset="100%" stop-color="#2f855a" />
            </linearGradient>
            <linearGradient id="pinkGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#ed64a6" />
              <stop offset="100%" stop-color="#b83280" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    `;
    leftCol.appendChild(statsCard);

    // Section Liste des Éléves
    const students = StorageManager.getStudents();
    const studentTableCard = document.createElement('div');
    studentTableCard.className = 'dashboard-card glass mt-4';
    studentTableCard.innerHTML = `
      <h3>Suivi Individuel des Éléves</h3>
      <p class="subtitle">Liste des élèves inscrits via les codes de votre établissement.</p>
      
      <div class="table-responsive mt-3">
        <table class="students-table" aria-label="Liste de suivi des élèves">
          <thead>
            <tr>
              <th scope="col">Nom de l'élève</th>
              <th scope="col">Série</th>
              <th scope="col">Moyenne BAC</th>
              <th scope="col">Vœu Principal</th>
              <th scope="col">Match</th>
            </tr>
          </thead>
          <tbody>
            ${students.map(s => `
              <tr>
                <td><strong>${s.name}</strong></td>
                <td><span class="table-badge badge-blue">${s.series}</span></td>
                <td><strong>${s.average}/20</strong></td>
                <td>${s.interests.includes('engineering') ? 'CPGE INP-HB (Génie)' : (s.interests.includes('health') ? 'Médecine (UFHB)' : 'UFR Droit (UFHB)')}</td>
                <td><span class="table-badge badge-green">${s.average >= 12 ? '90%' : '75%'}</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
    leftCol.appendChild(studentTableCard);

    mainGrid.appendChild(leftCol);

    // Colonne de droite (Codes d'activation & Gestion)
    const rightCol = document.createElement('aside');
    rightCol.className = 'dashboard-side-col';

    // Codes d'activation
    const codesCard = document.createElement('div');
    codesCard.className = 'dashboard-card glass';
    
    const renderCodesList = () => {
      const allCodes = StorageManager.getSchoolCodes();
      const schoolId = user.schoolId || 'school_demo';
      const myCodes = allCodes.filter(c => c.schoolId === schoolId);

      codesCard.innerHTML = `
        <h3>Codes d'Accès Élèves</h3>
        <p class="subtitle text-small">Distribuez ces codes à vos élèves pour qu'ils débloquent la version Premium.</p>
        
        <div class="codes-list-container mt-3">
          ${isPremium ? `
            <ul class="school-codes-list">
              ${myCodes.map(c => `
                <li class="code-item">
                  <code class="access-code-badge">${c.code}</code>
                  <span class="code-status-pill ${c.used ? 'used' : 'free'}">
                    ${c.used ? `Utilisé par ${c.usedBy.split(' ')[0]}` : 'Disponible'}
                  </span>
                </li>
              `).join('')}
            </ul>
            <button class="btn btn-primary btn-sm btn-block mt-3" id="btn-generate-new-code">Générer un Code d'Accès</button>
          ` : `
            <div class="codes-locked text-center py-3">
              <span class="lock-icon">🔒</span>
              <p class="text-small mt-2">La génération de codes d'accès nécessite un abonnement Établissement actif.</p>
              <a href="#tarifs" class="btn btn-orange btn-sm mt-3">S'abonner à la formule École</a>
            </div>
          `}
        </div>

        <div class="divider my-4"><span>ADMINISTRATION</span></div>
        <button class="btn btn-secondary btn-sm btn-block" id="btn-logout-school">Se déconnecter</button>
      `;

      // Attacher listener génération
      const genBtn = codesCard.querySelector('#btn-generate-new-code');
      if (genBtn) {
        genBtn.addEventListener('click', () => {
          StorageManager.generateSchoolCode(schoolId);
          renderCodesList();
        });
      }

      // Attacher déconnexion
      const logoutBtn = codesCard.querySelector('#btn-logout-school');
      if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
          StorageManager.logout();
        });
      }
    };

    renderCodesList();
    rightCol.appendChild(codesCard);

    mainGrid.appendChild(rightCol);
    container.appendChild(mainGrid);
  }
};
export default DashboardsUI;
