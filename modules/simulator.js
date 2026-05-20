import { UNIVERSITIES, BAC_SERIES, CAREER_DOMAINS } from '../data.js';
import { StorageManager } from './storage.js';

export function calculateRecommendations(student) {
  const recommendations = [];
  const { series, average, grades, interests } = student;

  if (!series || isNaN(average)) return [];

  UNIVERSITIES.forEach(university => {
    university.programs.forEach(program => {
      // 1. Vérification de la série de BAC
      if (!program.bacRequired.includes(series)) {
        return; // Non éligible si la série n'est pas acceptée
      }

      let matchScore = 0;
      let criteriaMatch = {
        series: true,
        average: false,
        subjects: true,
        interests: false,
        reasons: []
      };

      // 2. Moyenne Générale
      const averageDiff = average - program.minAverage;
      if (averageDiff >= 0) {
        criteriaMatch.average = true;
        matchScore += 40; // 40 points pour la moyenne générale respectée
        matchScore += Math.min(averageDiff * 5, 10); // Bonus jusqu'à +10 points pour excellente moyenne
      } else if (averageDiff >= -1.5) {
        // Tolérance légère pour les notes
        criteriaMatch.average = false;
        matchScore += 20; // 20 points si légèrement en dessous
        criteriaMatch.reasons.push(`Moyenne de ${average}/20 (Requis: ${program.minAverage}/20)`);
      } else {
        return; // Trop en dessous de la moyenne minimale requise
      }

      // 3. Notes dans les matières clés
      let subjectCount = 0;
      let subjectScoreSum = 0;
      let missingSubjectScores = false;

      if (program.keySubjects) {
        for (const [subject, minGrade] of Object.entries(program.keySubjects)) {
          const studentGrade = grades[subject];
          if (studentGrade !== undefined) {
            subjectCount++;
            if (studentGrade >= minGrade) {
              subjectScoreSum += 30;
            } else {
              subjectScoreSum += (studentGrade / minGrade) * 20; // Score partiel
              criteriaMatch.reasons.push(`Note en ${subject}: ${studentGrade}/20 (Requis: ${minGrade}/20)`);
              criteriaMatch.subjects = false;
            }
          } else {
            missingSubjectScores = true;
          }
        }
      }

      if (subjectCount > 0) {
        matchScore += (subjectScoreSum / subjectCount);
      } else {
        matchScore += 30; // Pas de matières spécifiques requises
      }

      // 4. Intérêts / Domaines de carrière
      if (interests && interests.includes(program.domain)) {
        criteriaMatch.interests = true;
        matchScore += 20; // 20 points bonus si intérêt marqué
      } else {
        matchScore += 5; // Moindre affinité mais toujours envisageable
      }

      // Normalisation du score de match à 100 max
      const finalMatch = Math.min(Math.round(matchScore), 100);

      // On n'affiche que si le match est supérieur à 45%
      if (finalMatch >= 45) {
        recommendations.push({
          universityName: university.name,
          universityLogo: university.logo,
          universityLocation: university.location,
          universityWebsite: university.website,
          universityType: university.type,
          universityStatus: university.status || 'Public',
          program: program,
          matchPercentage: finalMatch,
          criteria: criteriaMatch
        });
      }
    });
  });

  return recommendations.sort((a, b) => b.matchPercentage - a.matchPercentage);
}

export const SimulatorUI = {
  state: {
    step: 1,
    student: {
      id: 'temp_student',
      name: '',
      series: '',
      average: 10,
      grades: {},
      interests: [],
      results: []
    }
  },

  // Réinitialisation COMPLÈTE de tout l'état du simulateur
  resetState() {
    this.state.step = 1;
    this.state.student = {
      id: 'temp_student',
      name: StorageManager.getCurrentUser().name || 'Élève Visiteur',
      series: '',
      average: 10,
      grades: {},
      interests: [],
      results: [],
      favorites: []
    };
  },

  init(containerId, onComplete) {
    this.container = document.getElementById(containerId);
    this.onComplete = onComplete;
    this.resetState(); // Toujours partir d'un état propre à l'initialisation
    this.render();
  },

  nextStep() {
    if (this.validateStep()) {
      // After interests are selected (step 3), redirect to student dashboard instead of proceeding to results
      if (this.state.step === 3) {
        window.location.hash = '#dashboard';
        return;
      }
      this.state.step++;
      this.render();
      this.scrollToTop();
    }
  },

  prevStep() {
    if (this.state.step > 1) {
      this.state.step--;
      this.render();
      this.scrollToTop();
    }
  },

  scrollToTop() {
    if (this.container) {
      const headerHeight = document.querySelector('.main-header')?.offsetHeight || 70;
      const elementPosition = this.container.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - headerHeight - 20;

      window.scrollTo({
        top: offsetPosition >= 0 ? offsetPosition : 0,
        behavior: 'smooth'
      });
    }
  },

  scrollToNextButton() {
    if (this.container) {
      const nextBtn = this.container.querySelector('.step-actions .btn-primary');
      if (nextBtn) {
        nextBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  },

  validateStep() {
    const errorEl = this.container.querySelector('.step-error');
    if (errorEl) errorEl.textContent = '';

    if (this.state.step === 1) {
      if (!this.state.student.series) {
        this.showError('Veuillez sélectionner votre série de BAC.');
        return false;
      }
    } else if (this.state.step === 2) {
      // Vérification des notes saisies
      const inputs = this.container.querySelectorAll('.grade-input');
      let allValid = true;
      let total = 0;
      let count = 0;
      
      const grades = {};
      inputs.forEach(input => {
        const val = parseFloat(input.value);
        const subject = input.dataset.subject;
        if (isNaN(val) || val < 0 || val > 20) {
          allValid = false;
          input.classList.add('invalid');
        } else {
          input.classList.remove('invalid');
          grades[subject] = val;
          total += val;
          count++;
        }
      });

      if (!allValid) {
        this.showError('Toutes les notes doivent être comprises entre 0 et 20.');
        return false;
      }

      this.state.student.grades = grades;
      this.state.student.average = parseFloat((total / count).toFixed(2));
    } else if (this.state.step === 3) {
      if (this.state.student.interests.length === 0) {
        this.showError('Sélectionnez au moins un domaine d\'intérêt.');
        return false;
      }
    }
    return true;
  },

  showError(msg) {
    const errorEl = this.container.querySelector('.step-error');
    if (errorEl) {
      errorEl.textContent = msg;
      errorEl.focus();
    }
  },

  toggleInterest(interestId) {
    const idx = this.state.student.interests.indexOf(interestId);
    if (idx === -1) {
      this.state.student.interests.push(interestId);
    } else {
      this.state.student.interests.splice(idx, 1);
    }
    this.render();
    if (this.state.student.interests.length > 0) {
      setTimeout(() => this.scrollToNextButton(), 150);
    }
  },

  render() {
    this.container.innerHTML = '';
    
    // Conteneur de progression
    const progressContainer = document.createElement('nav');
    progressContainer.className = 'progress-steps';
    progressContainer.setAttribute('aria-label', 'Étapes du questionnaire');
    
    const stepsData = [
      { num: 1, label: 'Série de BAC' },
      { num: 2, label: 'Vos Notes' },
      { num: 3, label: 'Intérêts' },
      { num: 4, label: 'Résultats' }
    ];

    stepsData.forEach(s => {
      const stepEl = document.createElement('div');
      stepEl.className = `step-indicator ${this.state.step === s.num ? 'active' : ''} ${this.state.step > s.num ? 'completed' : ''}`;
      stepEl.innerHTML = `
        <span class="step-num">${this.state.step > s.num ? '✓' : s.num}</span>
        <span class="step-label">${s.label}</span>
      `;
      progressContainer.appendChild(stepEl);
    });

    this.container.appendChild(progressContainer);

    // Contenu de l'étape
    const stepContent = document.createElement('div');
    stepContent.className = 'step-content glass';
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'step-error';
    errorDiv.setAttribute('aria-live', 'polite');
    stepContent.appendChild(errorDiv);

    if (this.state.step === 1) {
      this.renderStep1(stepContent);
    } else if (this.state.step === 2) {
      this.renderStep2(stepContent);
    } else if (this.state.step === 3) {
      this.renderStep3(stepContent);
    } else if (this.state.step === 4) {
      this.renderStep4(stepContent);
    }

    this.container.appendChild(stepContent);

    // Actions (Boutons Précédent/Suivant)
    if (this.state.step < 4) {
      const actionsDiv = document.createElement('div');
      actionsDiv.className = 'step-actions';

      if (this.state.step > 1) {
        const prevBtn = document.createElement('button');
        prevBtn.className = 'btn btn-secondary';
        prevBtn.textContent = 'Précédent';
        prevBtn.addEventListener('click', () => this.prevStep());
        actionsDiv.appendChild(prevBtn);
      } else {
        // Remplir un espace vide pour aligner le bouton suivant à droite
        const spacer = document.createElement('div');
        actionsDiv.appendChild(spacer);
      }

      const nextBtn = document.createElement('button');
      nextBtn.className = 'btn btn-primary';
      nextBtn.textContent = this.state.step === 3 ? 'Générer mon Orientation' : 'Suivant';
      nextBtn.addEventListener('click', () => this.nextStep());
      actionsDiv.appendChild(nextBtn);

      this.container.appendChild(actionsDiv);
    }
  },

  renderStep1(parent) {
    const title = document.createElement('h3');
    title.className = 'step-title';
    title.textContent = 'Sélectionnez votre Série du BACCALAUREAT';
    parent.appendChild(title);

    const desc = document.createElement('p');
    desc.className = 'step-description';
    desc.textContent = 'Choisissez la série de votre classe de terminale. Les matières principales requises s\'adapteront automatiquement.';
    parent.appendChild(desc);

    const grid = document.createElement('div');
    grid.className = 'series-grid';

    Object.entries(BAC_SERIES).forEach(([key, value]) => {
      const card = document.createElement('button');
      card.className = `series-card glass-card ${this.state.student.series === key ? 'selected' : ''}`;
      card.setAttribute('aria-pressed', this.state.student.series === key ? 'true' : 'false');
      
      let badgeColor = 'orange';
      if (key.startsWith('A')) badgeColor = 'blue';
      else if (key === 'C' || key === 'D' || key === 'E') badgeColor = 'green';

      card.innerHTML = `
        <span class="series-badge badge-${badgeColor}">${key}</span>
        <span class="series-name">${value.name}</span>
      `;
      card.addEventListener('click', () => {
        this.state.student.series = key;
        // Reset des notes si changement de série
        this.state.student.grades = {};
        this.render();
        setTimeout(() => this.scrollToNextButton(), 150);
      });
      grid.appendChild(card);
    });

    parent.appendChild(grid);
  },

  renderStep2(parent) {
    const seriesKey = this.state.student.series;
    const seriesInfo = BAC_SERIES[seriesKey];

    const title = document.createElement('h3');
    title.className = 'step-title';
    title.textContent = `Saisissez vos Notes pour la Série ${seriesKey}`;
    parent.appendChild(title);

    const desc = document.createElement('p');
    desc.className = 'step-description';
    desc.textContent = 'Entrez vos moyennes annuelles ou notes du BAC (sur 20) dans les matières ci-dessous pour affiner notre algorithme d\'admission.';
    parent.appendChild(desc);

    const form = document.createElement('form');
    form.className = 'grades-form';
    form.setAttribute('novalidate', 'true');
    form.addEventListener('submit', (e) => e.preventDefault());

    seriesInfo.subjects.forEach(subject => {
      const group = document.createElement('div');
      group.className = 'form-group-inline';

      const label = document.createElement('label');
      label.setAttribute('for', `grade-${subject}`);
      label.className = 'grade-label';
      label.textContent = subject;

      const inputContainer = document.createElement('div');
      inputContainer.className = 'grade-input-container';

      const input = document.createElement('input');
      input.type = 'number';
      input.id = `grade-${subject}`;
      input.className = 'grade-input';
      input.dataset.subject = subject;
      input.min = '0';
      input.max = '20';
      input.step = '0.25';
      input.placeholder = '10.00';
      input.value = this.state.student.grades[subject] || '';
      
      const feedback = document.createElement('span');
      feedback.className = 'grade-feedback';

      // Afficher un statut coloré dynamique à la frappe
      const updateFeedback = (val) => {
        if (val === '' || isNaN(val)) {
          feedback.textContent = '';
          input.className = 'grade-input';
          return;
        }
        if (val < 0 || val > 20) {
          feedback.textContent = 'Non valide';
          feedback.className = 'grade-feedback text-error';
          input.className = 'grade-input invalid';
        } else if (val >= 14) {
          feedback.textContent = 'Excellent';
          feedback.className = 'grade-feedback text-success';
          input.className = 'grade-input val-excellent';
        } else if (val >= 12) {
          feedback.textContent = 'Bien';
          feedback.className = 'grade-feedback text-success';
          input.className = 'grade-input val-good';
        } else if (val >= 10) {
          feedback.textContent = 'Passable';
          feedback.className = 'grade-feedback text-warning';
          input.className = 'grade-input val-average';
        } else {
          feedback.textContent = 'Insuffisant';
          feedback.className = 'grade-feedback text-error';
          input.className = 'grade-input val-poor';
        }
      };

      input.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        updateFeedback(val);
      });

      input.addEventListener('change', () => {
        const inputs = Array.from(this.container.querySelectorAll('.grade-input'));
        const allFilled = inputs.every(inp => inp.value !== '' && !isNaN(parseFloat(inp.value)) && parseFloat(inp.value) >= 0 && parseFloat(inp.value) <= 20);
        if (allFilled) {
          setTimeout(() => this.scrollToNextButton(), 150);
        }
      });

      // Initialiser si déjà rempli
      if (input.value !== '') {
        updateFeedback(parseFloat(input.value));
      }

      inputContainer.appendChild(input);
      inputContainer.appendChild(feedback);
      group.appendChild(label);
      group.appendChild(inputContainer);
      form.appendChild(group);
    });

    parent.appendChild(form);
  },

  renderStep3(parent) {
    const title = document.createElement('h3');
    title.className = 'step-title';
    title.textContent = 'Quels sont vos Domaines d\'Intérêts ?';
    parent.appendChild(title);

    const desc = document.createElement('p');
    desc.className = 'step-description';
    desc.textContent = 'Sélectionnez un ou plusieurs domaines professionnels dans lesquels vous aimeriez faire carrière.';
    parent.appendChild(desc);

    const grid = document.createElement('div');
    grid.className = 'interests-grid';

    CAREER_DOMAINS.forEach(domain => {
      const isSelected = this.state.student.interests.includes(domain.id);
      const card = document.createElement('button');
      card.className = `interest-card glass-card ${isSelected ? 'selected' : ''}`;
      card.setAttribute('aria-pressed', isSelected ? 'true' : 'false');
      card.innerHTML = `
        <span class="interest-icon" role="img" aria-hidden="true">${domain.icon}</span>
        <span class="interest-name">${domain.name}</span>
      `;
      card.addEventListener('click', () => this.toggleInterest(domain.id));
      grid.appendChild(card);
    });

    parent.appendChild(grid);
  },

  renderStep4(parent) {
    const title = document.createElement('h3');
    title.className = 'step-title';
    title.textContent = 'Vos Recommandations d\'Orientation';
    parent.appendChild(title);

    const user = StorageManager.getCurrentUser();
    const isPremium = user.activeSubscription;

    // Calculer les résultats
    const recommendations = calculateRecommendations(this.state.student);
    this.state.student.results = recommendations;

    // Sauvegarder dans le profil si l'utilisateur est connecté et abonné
    if (user.role === 'student' && isPremium) {
      this.state.student.id = user.id;
      StorageManager.saveStudent(this.state.student);
    }

    if (recommendations.length === 0) {
      parent.innerHTML += `
        <div class="empty-results text-center py-4">
          <p class="text-large text-warning">Aucun résultat ne correspond exactement à vos critères.</p>
          <p>Essayez de réajuster vos notes ou de sélectionner plus de domaines d'intérêt.</p>
          <button class="btn btn-secondary mt-3" id="restart-quiz-btn">Recommencer le test</button>
        </div>
      `;
      setTimeout(() => {
        document.getElementById('restart-quiz-btn').addEventListener('click', () => {
          this.resetState();
          this.render();
          this.scrollToTop();
        });
      }, 50);
      return;
    }

    // En-tête des résultats
    const header = document.createElement('div');
    header.className = 'results-header';
    header.innerHTML = `
      <p class="results-summary">Nous avons trouvé <strong>${recommendations.length} formations</strong> adaptées à votre profil de <strong>BAC ${this.state.student.series}</strong> (Moyenne calculée : ${this.state.student.average}/20).</p>
    `;
    parent.appendChild(header);

    // Zone de filtres
    const filters = document.createElement('div');
    filters.className = 'results-filters';
    filters.innerHTML = `
      <div class="filter-group">
        <label for="filter-status" class="filter-label">Statut d'établissement :</label>
        <select id="filter-status" class="select-input">
          <option value="all">Tous (Publics & Privés)</option>
          <option value="Public">Établissements Publics</option>
          <option value="Privé">Établissements Privés</option>
        </select>
      </div>
    `;
    parent.appendChild(filters);

    const resultsList = document.createElement('div');
    resultsList.className = 'results-list';
    parent.appendChild(resultsList);

    // Fonction de rendu des cartes de résultats
    const renderCards = (statusFilter = 'all') => {
      resultsList.innerHTML = '';
      let renderedCount = 0;

      recommendations.forEach((rec, index) => {
        if (statusFilter !== 'all' && rec.universityStatus !== statusFilter) {
          return;
        }

        renderedCount++;
        const card = document.createElement('article');
        card.className = 'recommendation-card glass-card';
        
        // Bloquer l'accès complet si l'utilisateur n'est pas Premium (sauf pour le 1er résultat)
        const isLocked = !isPremium && index > 0;

        let matchBadgeColor = 'green';
        if (rec.matchPercentage < 60) matchBadgeColor = 'orange';
        else if (rec.matchPercentage < 80) matchBadgeColor = 'blue';

        card.innerHTML = `
          <div class="rec-card-header">
            <div class="rec-header-info">
              <span class="rec-univ-logo">${rec.universityLogo}</span>
              <div>
                <h4 class="rec-program-title">${rec.program.name}</h4>
                <p class="rec-univ-name">${rec.universityName} — <span class="location">${rec.universityLocation}</span></p>
              </div>
            </div>
            <div class="rec-match-badge bg-${matchBadgeColor}-glow">${rec.matchPercentage}% d'adéquation</div>
          </div>
          
          <div class="rec-card-body ${isLocked ? 'blur-content' : ''}">
            <p class="rec-description">${rec.program.description}</p>
            
            <div class="rec-details">
              <div class="rec-detail-item">
                <strong>Durée d'études :</strong> ${rec.program.duration}
              </div>
              <div class="rec-detail-item">
                <strong>Moyenne requise au BAC :</strong> ${rec.program.minAverage}/20 (Votre moyenne : ${this.state.student.average}/20)
              </div>
              <div class="rec-detail-item">
                <strong>Statut établissement :</strong> <span class="badge ${rec.universityStatus === 'Public' ? 'badge-green-glow' : 'badge-orange-glow'}">${rec.universityStatus}</span>
              </div>
              <div class="rec-detail-item rec-detail-full">
                <strong>Admission :</strong> ${rec.program.concoursRequired ? `🏆 <span class="highlight-orange font-bold">Concours requis :</span> ${rec.program.concoursRequired}` : '📝 Directe (Sélection nationale MESRS)'}
              </div>
            </div>

            <div class="rec-reasons mt-3">
              <h5>Pourquoi cette recommandation ?</h5>
              <ul>
                <li>Votre BAC ${this.state.student.series} correspond aux prérequis.</li>
                ${rec.criteria.interests ? '<li>Ce programme correspond à l\'un de vos domaines d\'intérêt préférés.</li>' : ''}
                ${rec.criteria.average ? `<li>Votre moyenne générale (${this.state.student.average}) dépasse le seuil requis (${rec.program.minAverage}).</li>` : ''}
                ${rec.criteria.reasons.length === 0 ? '<li>Toutes vos notes respectent les moyennes minimales recommandées.</li>' : rec.criteria.reasons.map(r => `<li class="text-warning-bullet">${r}</li>`).join('')}
              </ul>
            </div>
          </div>

          ${isLocked ? `
            <div class="lock-overlay">
              <div class="lock-box">
                <span class="lock-icon">🔒</span>
                <h4>Résultat Verrouillé</h4>
                <p>Débloquez toutes vos recommandations d'orientation détaillées en souscrivant à un abonnement Orient.ci.</p>
                <button class="btn btn-orange go-to-tarifs-btn">S'abonner à partir de 1 500 FCFA</button>
              </div>
            </div>
          ` : `
            <div class="rec-card-footer mt-3">
              <a href="${rec.program.website || '#'}" target="_blank" class="btn btn-secondary btn-sm" aria-label="Visiter le site officiel de ${rec.universityName}">Visiter le site officiel</a>
              <button class="btn btn-primary btn-sm save-fav-btn" data-id="${rec.program.name}">${isPremium ? 'Sauvegarder dans mes favoris' : 'Favori (Premium)'}</button>
            </div>
          `}
        `;

        // Événements pour le bouton de favoris
        const favBtn = card.querySelector('.save-fav-btn');
        if (favBtn) {
          favBtn.addEventListener('click', (e) => {
            if (!isPremium) {
              this.showError("L'enregistrement des favoris nécessite un abonnement actif.");
              // Scroll to error
              errorDiv.scrollIntoView({ behavior: 'smooth' });
              return;
            }
            favBtn.textContent = '✓ Sauvegardé';
            favBtn.disabled = true;
            // Simuler l'ajout de favoris
            const currentUser = StorageManager.getCurrentUser();
            if (!currentUser.favorites) currentUser.favorites = [];
            if (!currentUser.favorites.includes(rec.program.name)) {
              currentUser.favorites.push(rec.program.name);
              StorageManager.setCurrentUser(currentUser);
              // Mettre à jour l'étudiant
              this.state.student.favorites = currentUser.favorites;
              StorageManager.saveStudent(this.state.student);
            }
          });
        }

        const lockBtn = card.querySelector('.go-to-tarifs-btn');
        if (lockBtn) {
          lockBtn.addEventListener('click', () => {
            // Déclencher le changement de hash vers les tarifs
            window.location.hash = '#tarifs';
          });
        }

        resultsList.appendChild(card);
      });

      if (renderedCount === 0) {
        resultsList.innerHTML = `<p class="text-center py-4">Aucune formation ne correspond à ce filtre.</p>`;
      }
    };

    // Initial Render
    renderCards();

    // Event listeners
    const statusSelect = document.getElementById('filter-status');
    statusSelect.addEventListener('change', (e) => {
      renderCards(e.target.value);
    });

    // Option de recommencer le test
    const restartContainer = document.createElement('div');
    restartContainer.className = 'text-center mt-5 mb-3';
    restartContainer.innerHTML = `<button class="btn btn-secondary" id="restart-full-quiz">Recommencer le test d'orientation</button>`;
    parent.appendChild(restartContainer);

    document.getElementById('restart-full-quiz').addEventListener('click', () => {
      this.resetState();
      this.render();
      this.scrollToTop();
    });
  }
};
export default SimulatorUI;
