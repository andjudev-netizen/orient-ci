import { StorageManager } from './storage.js';

export const PaymentManager = {
  plans: {
    student: {
      id: 'student',
      name: 'Formule Élève',
      price: 1500,
      period: 'mois',
      description: 'Idéal pour concevoir son projet d\'orientation en toute autonomie.',
      features: [
        'Accès complet au simulateur d\'éligibilité',
        'Fiches détaillées de toutes les universités publiques et grandes écoles',
        'Sauvegarde de vos filières favorites',
        'Recommandations mises à jour en temps réel'
      ],
      role: 'student'
    },
    parent: {
      id: 'parent',
      name: 'Formule Parent',
      price: 3000,
      period: 'mois',
      description: 'Pour suivre et soutenir activement le projet d\'orientation de votre enfant.',
      features: [
        'Toutes les fonctionnalités de la formule Élève',
        'Suivi en direct des progrès de votre enfant',
        'Téléchargement du rapport d\'orientation complet (PDF)',
        'Messagerie directe de consultation avec un conseiller expert',
        'Jusqu\'à 3 profils élèves inclus'
      ],
      role: 'parent',
      popular: true
    },
    school: {
      id: 'school',
      name: 'Formule Établissement',
      price: 25000,
      period: 'mois',
      description: 'Pour les lycées souhaitant accompagner collectivement leurs classes de terminale.',
      features: [
        'Licence illimitée pour tous les élèves de terminale de l\'école',
        'Tableau de bord d\'administration pour la direction',
        'Statistiques de choix d'orientation de la promotion (graphiques)',
        'Génération automatique de codes d\'accès individuels pour les élèves',
        'Support technique dédié et webinaires d\'orientation'
      ],
      role: 'school'
    }
  },

  renderTariffs(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = '';

    const grid = document.createElement('div');
    grid.className = 'tariffs-grid';

    Object.values(this.plans).forEach(plan => {
      const card = document.createElement('div');
      card.className = `tariff-card glass ${plan.popular ? 'popular-card' : ''}`;
      
      card.innerHTML = `
        ${plan.popular ? '<span class="popular-badge">Conseillé</span>' : ''}
        <h3 class="plan-name">${plan.name}</h3>
        <p class="plan-desc">${plan.description}</p>
        <div class="plan-price">
          <span class="price-amount">${plan.price.toLocaleString('fr-FR')}</span>
          <span class="price-currency">FCFA</span>
          <span class="price-period">/${plan.period}</span>
        </div>
        <ul class="plan-features">
          ${plan.features.map(f => `
            <li>
              <svg class="checkmark-icon" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" width="18" height="18">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
              </svg>
              <span>${f}</span>
            </li>
          `).join('')}
        </ul>
        <button class="btn ${plan.popular ? 'btn-primary' : 'btn-secondary'} btn-block select-plan-btn" data-plan="${plan.id}">
          Choisir cette formule
        </button>
      `;

      card.querySelector('.select-plan-btn').addEventListener('click', () => {
        this.openCheckout(plan.id);
      });

      grid.appendChild(card);
    });

    container.appendChild(grid);
  },

  openCheckout(planId) {
    const plan = this.plans[planId];
    if (!plan) return;

    // Création de la modale de paiement
    const modal = document.createElement('div');
    modal.className = 'checkout-modal-overlay';
    modal.id = 'checkout-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'modal-title');

    modal.innerHTML = `
      <div class="checkout-modal glass">
        <button class="close-modal-btn" aria-label="Fermer la fenêtre de paiement">&times;</button>
        <div class="checkout-grid">
          
          <!-- Récapitulatif Plan -->
          <div class="checkout-summary">
            <h3>Votre Commande</h3>
            <div class="summary-plan-details mt-3">
              <h4>${plan.name}</h4>
              <p>${plan.description}</p>
              <div class="summary-price mt-3">
                <span class="price-value">${plan.price.toLocaleString('fr-FR')} FCFA</span>
                <span class="price-term">/mois</span>
              </div>
            </div>
            <div class="security-badge mt-4">
              <span>🛡️ Paiement 100% sécurisé via passerelle cryptée</span>
            </div>
          </div>

          <!-- Formulaire de Paiement -->
          <div class="checkout-payment-details">
            <h3 id="modal-title">Mode de Paiement</h3>
            <p class="subtitle">Sélectionnez votre moyen de paiement préféré</p>
            
            <div class="payment-methods mt-3">
              <button class="method-btn selected" data-method="momo" aria-label="Mobile Money Côte d'Ivoire">
                <span class="method-icon">📱</span>
                <span class="method-label">Mobile Money</span>
              </button>
              <button class="method-btn" data-method="card" aria-label="Carte Bancaire Visa ou Mastercard">
                <span class="method-icon">💳</span>
                <span class="method-label">Carte Bancaire</span>
              </button>
            </div>

            <!-- Conteneurs Formulaires -->
            <div class="payment-forms-container mt-4">
              
              <!-- Formulaire MoMo -->
              <div class="payment-form" id="form-momo">
                <div class="operator-logos">
                  <button class="op-logo-btn selected" data-operator="orange" aria-label="Orange Money">
                    <span class="op-badge op-orange">Orange Money</span>
                  </button>
                  <button class="op-logo-btn" data-operator="mtn" aria-label="MTN Mobile Money">
                    <span class="op-badge op-mtn">MTN MoMo</span>
                  </button>
                  <button class="op-logo-btn" data-operator="wave" aria-label="Wave">
                    <span class="op-badge op-wave">Wave</span>
                  </button>
                  <button class="op-logo-btn" data-operator="moov" aria-label="Moov Money">
                    <span class="op-badge op-moov">Moov Flooz</span>
                  </button>
                </div>

                <div class="form-group mt-3">
                  <label for="momo-name">Nom complet de l'abonné :</label>
                  <input type="text" id="momo-name" class="input-text" placeholder="Ex: Koffi Konan Paul" required>
                </div>

                <div class="form-group mt-3">
                  <label for="momo-phone">Numéro de téléphone Côte d'Ivoire :</label>
                  <div class="phone-input-wrapper">
                    <span class="phone-prefix">+225</span>
                    <input type="tel" id="momo-phone" class="input-text" placeholder="07 01 02 03 04" pattern="^[0-9\\s]{10}$" required>
                  </div>
                  <span class="field-hint">Format à 10 chiffres (ex: 07 00 00 00 00)</span>
                </div>
              </div>

              <!-- Formulaire Carte Bancaire -->
              <div class="payment-form d-none" id="form-card">
                <div class="form-group">
                  <label for="card-name">Nom sur la carte :</label>
                  <input type="text" id="card-name" class="input-text" placeholder="KOFFI KONAN PAUL">
                </div>
                <div class="form-group mt-3">
                  <label for="card-number">Numéro de Carte :</label>
                  <input type="text" id="card-number" class="input-text" placeholder="4000 1234 5678 9010" maxlength="19">
                </div>
                <div class="form-row mt-3">
                  <div class="form-group col-6">
                    <label for="card-expiry">Date d'expiration :</label>
                    <input type="text" id="card-expiry" class="input-text" placeholder="MM/AA" maxlength="5">
                  </div>
                  <div class="form-group col-6">
                    <label for="card-cvc">CVC :</label>
                    <input type="password" id="card-cvc" class="input-text" placeholder="123" maxlength="4">
                  </div>
                </div>
              </div>

            </div>

            <!-- Bouton de validation -->
            <div class="payment-actions mt-4">
              <button class="btn btn-primary btn-block" id="pay-submit-btn">
                Payer ${plan.price.toLocaleString('fr-FR')} FCFA
              </button>
            </div>
            
            <div class="checkout-error text-error mt-3" aria-live="polite"></div>

          </div>

        </div>
      </div>
    `;

    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden'; // Bloquer le défilement de la page en arrière-plan

    // Elements
    const closeBtn = modal.querySelector('.close-modal-btn');
    const methodBtns = modal.querySelectorAll('.method-btn');
    const formMomo = modal.querySelector('#form-momo');
    const formCard = modal.querySelector('#form-card');
    const paySubmitBtn = modal.querySelector('#pay-submit-btn');
    const checkoutError = modal.querySelector('.checkout-error');

    // Pré-remplir le nom s'il y a un utilisateur courant connecté
    const currentUser = StorageManager.getCurrentUser();
    if (currentUser && currentUser.name && currentUser.role !== 'anonymous') {
      const momoNameInput = modal.querySelector('#momo-name');
      const cardNameInput = modal.querySelector('#card-name');
      if (momoNameInput) momoNameInput.value = currentUser.name;
      if (cardNameInput) cardNameInput.value = currentUser.name.toUpperCase();
    }

    // Fermeture modale
    const closeModal = () => {
      if (this.timerInterval) {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
      }
      modal.remove();
      document.body.style.overflow = '';
    };

    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    // Bascule de moyen de paiement
    methodBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        methodBtns.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        const method = btn.dataset.method;
        if (method === 'momo') {
          formMomo.classList.remove('d-none');
          formCard.classList.add('d-none');
        } else {
          formMomo.classList.add('d-none');
          formCard.classList.remove('d-none');
        }
      });
    });

    // Gestion de la sélection d'opérateur mobile
    const opLogoBtns = modal.querySelectorAll('.op-logo-btn');
    let selectedOperator = 'orange';
    opLogoBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        opLogoBtns.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        selectedOperator = btn.dataset.operator;
      });
    });

    // Formatage numéro carte et date expiration
    const cardNumberInput = modal.querySelector('#card-number');
    if (cardNumberInput) {
      cardNumberInput.addEventListener('input', (e) => {
        let val = e.target.value.replace(/\D/g, '');
        let formatted = val.match(/.{1,4}/g)?.join(' ') || val;
        e.target.value = formatted.substring(0, 19);
      });
    }

    const cardExpiryInput = modal.querySelector('#card-expiry');
    if (cardExpiryInput) {
      cardExpiryInput.addEventListener('input', (e) => {
        let val = e.target.value.replace(/\D/g, '');
        if (val.length > 2) {
          e.target.value = val.substring(0, 2) + '/' + val.substring(2, 4);
        } else {
          e.target.value = val;
        }
      });
    }

    // Soumission du paiement
    paySubmitBtn.addEventListener('click', () => {
      checkoutError.textContent = '';
      const selectedMethod = modal.querySelector('.method-btn.selected').dataset.method;

      if (selectedMethod === 'momo') {
        const name = modal.querySelector('#momo-name').value.trim();
        const phone = modal.querySelector('#momo-phone').value.replace(/\s+/g, '');
        
        if (!name) {
          checkoutError.textContent = 'Veuillez saisir votre nom complet.';
          return;
        }

        // Regex Côte d'Ivoire: 10 chiffres obligatoires
        const ciPhoneRegex = /^[0-9]{10}$/;
        if (!ciPhoneRegex.test(phone)) {
          checkoutError.textContent = 'Numéro de téléphone invalide. Il doit comporter exactement 10 chiffres.';
          return;
        }

        this.startSimulationProcess(modal, plan, name, {
          method: `Mobile Money (${selectedOperator.toUpperCase()})`,
          phone: `+225 ${phone}`
        });

      } else {
        const name = modal.querySelector('#card-name').value.trim();
        const cardNum = modal.querySelector('#card-number').value.replace(/\s+/g, '');
        const expiry = modal.querySelector('#card-expiry').value;
        const cvc = modal.querySelector('#card-cvc').value;

        if (!name || cardNum.length < 16 || expiry.length < 5 || cvc.length < 3) {
          checkoutError.textContent = 'Veuillez renseigner correctement les informations bancaires.';
          return;
        }

        this.startSimulationProcess(modal, plan, name, {
          method: 'Carte Bancaire',
          cardNumber: `**** **** **** ${cardNum.slice(-4)}`
        });
      }
    });
  },

  startSimulationProcess(modalEl, plan, clientName, details) {
    const paymentArea = modalEl.querySelector('.checkout-payment-details');
    
    // Étape 1 : Simulation de la validation OTP/Push
    paymentArea.innerHTML = `
      <div class="simulation-screen text-center py-4">
        <div class="spinner-container">
          <div class="loading-spinner-ring"></div>
        </div>
        <h3 class="mt-4">Validation en cours...</h3>
        <p class="mt-2 text-muted">Nous avons envoyé une demande d'autorisation de débit sur votre appareil.</p>
        <div class="momo-push-details mt-4 glass-card py-3 px-4">
          <p><strong>Mode :</strong> ${details.method}</p>
          ${details.phone ? `<p><strong>Destinataire :</strong> ${details.phone}</p>` : ''}
          <p class="highlight-orange mt-2 font-bold">Veuillez saisir votre code PIN secret sur votre téléphone pour approuver le paiement de ${plan.price.toLocaleString('fr-FR')} FCFA.</p>
        </div>
        <p class="waiting-timer mt-4 text-small">Délai restant : <span id="timer-sec">12</span> secondes...</p>
      </div>
    `;

    let seconds = 12;
    this.timerInterval = setInterval(() => {
      seconds--;
      const timerEl = modalEl.querySelector('#timer-sec');
      if (timerEl) timerEl.textContent = seconds;
      
      if (seconds <= 0) {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
        this.completeSimulationProcess(modalEl, plan, clientName, details);
      }
    }, 1000);

    // Ajouter un bouton pour simuler instantanément la validation de l'utilisateur
    const speedBtn = document.createElement('button');
    speedBtn.className = 'btn btn-secondary btn-sm mt-3';
    speedBtn.textContent = 'Simuler l\'approbation immédiate';
    speedBtn.addEventListener('click', () => {
      if (this.timerInterval) {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
      }
      this.completeSimulationProcess(modalEl, plan, clientName, details);
    });
    modalEl.querySelector('.simulation-screen').appendChild(speedBtn);
  },

  completeSimulationProcess(modalEl, plan, clientName, details) {
    if (!document.body.contains(modalEl)) return;
    const paymentArea = modalEl.querySelector('.checkout-payment-details');
    if (!paymentArea) return;
    const transactionRef = 'TX-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    
    // Activer l'abonnement
    StorageManager.activateSubscription(plan.role, plan.id, {
      name: clientName,
      method: details.method,
      price: plan.price,
      transactionId: transactionRef
    });

    // Mettre à jour le nom de l'utilisateur courant s'il n'en avait pas
    const user = StorageManager.getCurrentUser();
    user.name = clientName;
    StorageManager.setCurrentUser(user);

    // Générer des codes scolaires si c'est la formule Établissement
    if (plan.id === 'school') {
      const schoolId = 'school_' + Math.random().toString(36).substr(2, 5);
      user.schoolId = schoolId;
      StorageManager.setCurrentUser(user);
      
      // Générer 5 codes initiaux
      for(let i=0; i<5; i++) {
        StorageManager.generateSchoolCode(schoolId);
      }
    }

    // Étape 2 : Succès du paiement
    paymentArea.innerHTML = `
      <div class="success-screen text-center py-4">
        <span class="success-check-icon animate-pop">🎉</span>
        <h3 class="text-success mt-3">Paiement Réussi !</h3>
        <p class="mt-2 text-muted font-semibold">Félicitations, votre abonnement Orient.ci est actif.</p>
        
        <div class="receipt-box mt-4 glass-card p-3 text-left">
          <p><strong>Référence :</strong> ${transactionRef}</p>
          <p><strong>Formule :</strong> ${plan.name}</p>
          <p><strong>Montant :</strong> ${plan.price.toLocaleString('fr-FR')} FCFA</p>
          <p><strong>Bénéficiaire :</strong> ${clientName}</p>
          <p><strong>Statut :</strong> <span class="badge badge-green">Actif (Renouvellement mensuel)</span></p>
        </div>

        <p class="mt-4 text-small">Un reçu fiscal et une facture acquittée ont été envoyés à votre adresse.</p>

        <button class="btn btn-primary btn-block mt-4" id="go-to-dashboard-btn">
          Accéder à mon Tableau de Bord
        </button>
      </div>
    `;

    modalEl.querySelector('#go-to-dashboard-btn').addEventListener('click', () => {
      // Fermer la modale
      modalEl.remove();
      document.body.style.overflow = '';
      
      // Rediriger vers le dashboard
      window.location.hash = '#dashboard';
      window.location.reload(); // Recharger pour rafraîchir l'interface globale
    });
  }
};
export default PaymentManager;
