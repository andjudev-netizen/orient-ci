import { StorageManager } from './storage.js';

export const CodeActivationUI = {
  render(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const user = StorageManager.getCurrentUser();
    // Pre-fill student name if they have a non-generic name
    const defaultName = (user.name && user.name !== 'Visiteur') ? user.name : '';

    container.innerHTML = `
      <form id="code-activation-form" class="activation-form glass p-4 mt-3" aria-labelledby="form-title">
        <h3 id="form-title" class="sr-only">Formulaire d'activation du code d'accès</h3>
        
        <div class="form-group mb-3 text-left">
          <label for="activation-student-name">Votre Nom Complet :</label>
          <input 
            type="text" 
            id="activation-student-name" 
            class="input-text w-full mt-1" 
            placeholder="Ex: Jean Kouassi" 
            value="${defaultName}" 
            required
            aria-required="true"
          >
        </div>

        <div class="form-group mb-3 text-left">
          <label for="activation-code">Code d'accès Élève :</label>
          <input 
            type="text" 
            id="activation-code" 
            class="input-text w-full mt-1 uppercase-input" 
            placeholder="Ex: ORIENT-ECOLE-SCH-1234" 
            required
            aria-required="true"
          >
          <small class="text-muted block mt-1">Saisissez le code fourni par votre établissement ou parent.</small>
        </div>

        <button type="submit" class="btn btn-primary btn-block mt-4" id="btn-submit-code">
          🚀 Activer l'accès Premium
        </button>

        <div id="activation-feedback" class="code-activation-feedback mt-3 text-small" aria-live="polite"></div>
      </form>
    `;

    // Apply auto-uppercase during typing
    const codeInput = document.getElementById('activation-code');
    if (codeInput) {
      codeInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.toUpperCase().trim();
      });
    }

    const form = document.getElementById('code-activation-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const feedback = document.getElementById('activation-feedback');
        const nameVal = document.getElementById('activation-student-name').value.trim();
        const codeVal = document.getElementById('activation-code').value.trim();

        if (!feedback) return;
        feedback.textContent = '';
        feedback.className = 'code-activation-feedback mt-3 text-small';

        if (!nameVal || !codeVal) {
          feedback.textContent = 'Veuillez remplir tous les champs.';
          feedback.classList.add('text-error');
          return;
        }

        // Validate code
        let result;
        let activationType = ''; // 'school' or 'parent'
        
        if (codeVal.startsWith('ORIENT-PARENT')) {
          result = StorageManager.useParentCode(codeVal, nameVal);
          activationType = 'parent';
        } else {
          result = StorageManager.useSchoolCode(codeVal, nameVal);
          activationType = 'school';
        }

        if (result.success) {
          feedback.textContent = '🎉 Félicitations ! Votre code d\'accès a été activé avec succès.';
          feedback.className = 'code-activation-feedback mt-3 text-small text-success font-semibold';

          // Update current user's profile and activate subscription
          StorageManager.activateSubscription('student', activationType === 'parent' ? 'parent' : 'school', {
            method: activationType === 'parent' ? 'Code Parent' : 'Code Établissement',
            schoolId: activationType === 'school' ? result.schoolId : undefined,
            parentId: activationType === 'parent' ? result.parentId : undefined
          });

          // Set name of current user to what they entered
          const currentUser = StorageManager.getCurrentUser();
          currentUser.name = nameVal;
          StorageManager.setCurrentUser(currentUser);

          // Force update in STUDENTS array for the active student profile
          const studentProfile = {
            id: 'student_1', // We can tie it to student_1 to ensure it updates this profile in the student list
            name: nameVal,
            series: currentUser.series || '',
            average: currentUser.average || 0,
            grades: currentUser.grades || {},
            interests: currentUser.interests || [],
            results: currentUser.results || [],
            favorites: currentUser.favorites || [],
            activeSubscription: true,
            plan: activationType === 'parent' ? 'parent' : 'school',
            schoolId: activationType === 'school' ? result.schoolId : undefined,
            parentId: activationType === 'parent' ? result.parentId : undefined
          };
          StorageManager.saveStudent(studentProfile);

          // Show success animation or visual glow, then redirect
          setTimeout(() => {
            window.location.hash = '#dashboard';
          }, 1500);
        } else {
          feedback.textContent = result.error || 'Code invalide ou déjà utilisé.';
          feedback.className = 'code-activation-feedback mt-3 text-small text-error font-semibold';
        }
      });
    }
  }
};
