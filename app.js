import { StorageManager } from './modules/storage.js';
import { SimulatorUI } from './modules/simulator.js';
import { PaymentManager } from './modules/payment.js';
import { DashboardsUI } from './modules/dashboards.js';

// Configuration du routeur et des sections
const SECTIONS = {
  accueil: 'view-accueil',
  orienter: 'view-orienter',
  tarifs: 'view-tarifs',
  dashboard: 'view-dashboard'
};

const App = {
  init() {
    // Initialiser les données de stockage
    StorageManager.init();

    // Configuration des écouteurs globaux
    window.addEventListener('hashchange', () => this.handleRouting());
    
    // Configurer le sélecteur de rôle en en-tête
    this.setupHeaderControls();

    // Initialiser les fonctionnalités de scroll & reveal
    this.setupScrollFeatures();
    this.setupScrollReveal();

    // Lancer la première route
    this.handleRouting();
  },

  handleRouting() {
    const hash = window.location.hash.substring(1) || 'accueil';
    const activeSectionId = SECTIONS[hash] || SECTIONS.accueil;

    // Masquer toutes les sections
    Object.values(SECTIONS).forEach(id => {
      const section = document.getElementById(id);
      if (section) section.classList.add('d-none');
    });

    // Afficher la section active
    const activeSection = document.getElementById(activeSectionId);
    if (activeSection) {
      activeSection.classList.remove('d-none');
      // Placer le focus pour l'accessibilité
      activeSection.setAttribute('tabindex', '-1');
      activeSection.focus();

      // Défilement fluide vers le haut de la section
      const headerHeight = document.querySelector('.main-header')?.offsetHeight || 70;
      const elementPosition = activeSection.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - headerHeight - 20;

      window.scrollTo({
        top: offsetPosition >= 0 ? offsetPosition : 0,
        behavior: 'smooth'
      });
    }

    // Mettre à jour l'état visuel du menu de navigation
    this.updateNavLinks(hash);

    // Initialiser le module correspondant
    this.mountModule(hash);

    // Relancer l'observateur pour les nouveaux éléments dynamiques éventuellement révélés
    setTimeout(() => {
      this.setupScrollReveal();
    }, 100);
  },

  updateNavLinks(activeHash) {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.classList.remove('active');
      link.removeAttribute('aria-current');
    });

    const activeLink = document.getElementById(`link-${activeHash}`);
    if (activeLink) {
      activeLink.classList.add('active');
      activeLink.setAttribute('aria-current', 'page');
    }
  },

  mountModule(hash) {
    if (hash === 'orienter') {
      // Monter le simulateur
      SimulatorUI.init('simulator-mount-point', (studentResults) => {
        console.log('Simulation complétée :', studentResults);
      });
    } else if (hash === 'tarifs') {
      // Monter les grilles de tarifs
      PaymentManager.renderTariffs('tarifs-mount-point');
    } else if (hash === 'dashboard') {
      // Monter le dashboard selon le rôle
      DashboardsUI.render('dashboard-mount-point');
    }
  },

  setupScrollFeatures() {
    const progressIndicator = document.getElementById('scroll-progress');
    const backToTopBtn = document.getElementById('btn-back-to-top');
    const circleBar = document.getElementById('scroll-circle-bar');

    const onScroll = () => {
      const pageHeight = document.documentElement.scrollHeight;
      const viewportHeight = window.innerHeight;
      const maxScroll = pageHeight - viewportHeight;
      const currentScroll = window.pageYOffset;
      
      const scrollPercent = maxScroll > 0 ? (currentScroll / maxScroll) : 0;

      // 1. Mettre à jour la barre horizontale supérieure
      if (progressIndicator) {
        progressIndicator.style.width = `${scrollPercent * 100}%`;
      }

      // 2. Mettre à jour le bouton de retour en haut
      if (backToTopBtn) {
        if (currentScroll > 300) {
          backToTopBtn.classList.add('visible');
        } else {
          backToTopBtn.classList.remove('visible');
        }
      }

      // 3. Mettre à jour le cercle SVG du bouton back-to-top
      if (circleBar) {
        const radius = circleBar.r.baseVal.value;
        const circumference = 2 * Math.PI * radius; // ~125.66 pour r=20
        const offset = circumference - (scrollPercent * circumference);
        circleBar.style.strokeDashoffset = offset;
      }
    };

    // Attacher l'événement scroll
    window.addEventListener('scroll', onScroll, { passive: true });
    // Lancer une première fois pour calibrer
    onScroll();

    // Attacher le clic sur le bouton de retour en haut
    if (backToTopBtn) {
      backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
    }
  },

  setupScrollReveal() {
    // Si IntersectionObserver n'est pas supporté (vieux navigateurs)
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('.reveal').forEach(el => {
        el.classList.add('reveal-active');
      });
      return;
    }

    const observerOptions = {
      threshold: 0.05,
      rootMargin: '0px 0px -40px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-active');
          observer.unobserve(entry.target); // Cesser d'observer une fois animé
        }
      });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => {
      observer.observe(el);
    });
  },

  setupHeaderControls() {
    const roleSwitch = document.getElementById('header-role-switch');
    const loginLogoutBtn = document.getElementById('btn-login-logout');
    const currentUser = StorageManager.getCurrentUser();

    // Synchroniser le sélecteur de rôle avec l'état courant
    if (roleSwitch) {
      // Déterminer la valeur adéquate
      roleSwitch.value = currentUser.role;

      roleSwitch.addEventListener('change', (e) => {
        const selectedRole = e.target.value;
        this.switchDemoRole(selectedRole);
      });
    }

    // Gérer l'état du bouton Connexion/Déconnexion
    if (loginLogoutBtn) {
      if (currentUser.role !== 'anonymous') {
        loginLogoutBtn.textContent = 'Déconnexion';
        loginLogoutBtn.classList.remove('btn-secondary');
        loginLogoutBtn.classList.add('btn-secondary'); // Garde un aspect cohérent
        loginLogoutBtn.addEventListener('click', () => {
          StorageManager.logout();
        });
      } else {
        loginLogoutBtn.textContent = 'Connexion';
        loginLogoutBtn.classList.remove('btn-secondary');
        loginLogoutBtn.classList.add('btn-primary');
        loginLogoutBtn.addEventListener('click', () => {
          this.openDemoLoginModal();
        });
      }
    }
  },

  switchDemoRole(role) {
    let newUser = { role: 'anonymous', name: 'Visiteur', plan: null, activeSubscription: false };

    if (role === 'student') {
      // Simuler Kouassi Konan Yao (élève Premium BAC C via l'école)
      newUser = {
        role: 'student',
        id: 'student_1',
        name: 'Kouassi Konan Yao',
        series: 'C',
        average: 14.5,
        grades: { 'Mathématiques': 15, 'Physique-Chimie': 16, 'Français': 12, 'Philosophie': 11, 'Anglais': 13, 'SVT': 14 },
        interests: ['engineering'],
        favorites: ['CPGE (Classes Préparatoires aux Grandes Écoles) - INP-HB', 'Licence en Réseaux et Télécommunications / Informatique - ESATIC'],
        activeSubscription: true,
        plan: 'school',
        schoolId: 'school_1'
      };
    } else if (role === 'parent') {
      newUser = {
        role: 'parent',
        name: 'M. Kouassi Koffi',
        activeSubscription: true,
        plan: 'parent'
      };
    } else if (role === 'school') {
      newUser = {
        role: 'school',
        name: 'Lycée Scientifique de Yamoussoukro',
        activeSubscription: true,
        plan: 'school',
        schoolId: 'school_1'
      };
    }

    StorageManager.setCurrentUser(newUser);
    
    // Recharger la page pour propager le changement d'état
    window.location.reload();
  },

  openDemoLoginModal() {
    // Création d'une modale de connexion simplifiée pour la démo
    const modal = document.createElement('div');
    modal.className = 'checkout-modal-overlay';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.innerHTML = `
      <div class="checkout-modal glass max-w-md">
        <button class="close-modal-btn" aria-label="Fermer la connexion">&times;</button>
        <h3 class="text-center">Connexion Démo</h3>
        <p class="text-center subtitle mt-2">Choisissez votre profil pour vous connecter instantanément.</p>
        
        <div class="form-group mt-4">
          <label for="demo-select-profile">Sélectionner un profil type :</label>
          <select id="demo-select-profile" class="select-input mt-2" style="width: 100%;">
            <option value="student">Élève : Kouassi Konan (BAC C - Premium École)</option>
            <option value="parent">Parent : M. Kouassi Koffi (Premium)</option>
            <option value="school">Lycée : Scientifique de Yamoussoukro (Admin)</option>
          </select>
        </div>

        <button class="btn btn-primary btn-block mt-4" id="btn-demo-login-submit">Se Connecter</button>
      </div>
    `;

    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';

    const closeBtn = modal.querySelector('.close-modal-btn');
    closeBtn.addEventListener('click', () => {
      modal.remove();
      document.body.style.overflow = '';
    });

    modal.querySelector('#btn-demo-login-submit').addEventListener('click', () => {
      const selected = modal.querySelector('#demo-select-profile').value;
      this.switchDemoRole(selected);
    });
  }
};

// Lancement au chargement du DOM
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
