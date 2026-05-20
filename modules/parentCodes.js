import { StorageManager } from './storage.js';

export const ParentCodesUI = {
  render(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const user = StorageManager.getCurrentUser();
    
    // Safety check: only parents should access this page
    if (user.role !== 'parent') {
      container.innerHTML = `
        <div class="glass-card text-center p-5">
          <span style="font-size: 3rem;">⚠️</span>
          <h3 class="mt-3">Accès restreint</h3>
          <p class="text-muted mt-2">Cette page est réservée aux comptes Parents.</p>
          <a href="#dashboard" class="btn btn-primary mt-4">Retour au Tableau de Bord</a>
        </div>
      `;
      return;
    }

    const isPremium = user.activeSubscription;

    const renderSlots = () => {
      const allCodes = StorageManager.getParentCodes();
      // Use parent's ID (default to parent_demo if not set)
      const parentId = user.id || 'parent_demo';
      const myCodes = allCodes.filter(c => c.parentId === parentId);

      let slotsHtml = '';
      
      // Limit to 3 slots
      for (let i = 0; i < 3; i++) {
        const codeObj = myCodes[i];
        
        if (codeObj) {
          if (codeObj.used) {
            slotsHtml += `
              <div class="slot-card glass-card p-4 text-center status-linked" style="border-top: 4px solid var(--color-success);">
                <div style="font-size: 2.5rem; margin-bottom: 10px;">👦</div>
                <h4>Enfant ${i + 1} : Lié</h4>
                <p class="mt-2 text-large"><strong>${codeObj.usedBy}</strong></p>
                <div class="mt-3">
                  <span class="badge badge-green-glow">Compte Élève Premium lié</span>
                </div>
                <p class="text-muted text-small mt-3">Activé le ${new Date(codeObj.usedAt).toLocaleDateString('fr-FR')}</p>
              </div>
            `;
          } else {
            slotsHtml += `
              <div class="slot-card glass-card p-4 text-center status-available" style="border-top: 4px solid var(--color-primary);">
                <div style="font-size: 2.5rem; margin-bottom: 10px;">🔑</div>
                <h4>Enfant ${i + 1} : Prêt</h4>
                <p class="text-muted text-small mt-1">Donnez ce code à votre enfant pour qu'il l'active.</p>
                <div class="access-code-box mt-3" style="background: rgba(0,0,0,0.3); padding: 8px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.08);">
                  <code style="font-family: monospace; font-size: 1.1rem; color: var(--color-primary); font-weight: bold; letter-spacing: 1px;">${codeObj.code}</code>
                </div>
                <div class="mt-4" style="display: flex; gap: 8px; justify-content: center;">
                  <button class="btn btn-secondary btn-sm btn-copy-code" data-code="${codeObj.code}">📋 Copier</button>
                  <span class="badge badge-blue-glow" style="align-self: center;">Disponible</span>
                </div>
              </div>
            `;
          }
        } else {
          if (isPremium) {
            slotsHtml += `
              <div class="slot-card glass-card p-4 text-center status-empty" style="border-top: 4px dashed rgba(255,255,255,0.2);">
                <div style="font-size: 2.5rem; margin-bottom: 10px; opacity: 0.5;">➕</div>
                <h4>Enfant ${i + 1} : Libre</h4>
                <p class="text-muted text-small mt-1">Vous pouvez générer un accès pour un autre enfant.</p>
                <button class="btn btn-primary btn-sm mt-4 btn-generate-slot" data-parent-id="${parentId}">
                  Générer le code d'accès
                </button>
              </div>
            `;
          } else {
            slotsHtml += `
              <div class="slot-card glass-card p-4 text-center status-locked" style="opacity: 0.7; border-top: 4px solid var(--color-error);">
                <div style="font-size: 2.5rem; margin-bottom: 10px;">🔒</div>
                <h4>Enfant ${i + 1} : Verrouillé</h4>
                <p class="text-muted text-small mt-1">Nécessite un abonnement Parent Premium.</p>
                <a href="#tarifs" class="btn btn-orange btn-sm mt-4">S'abonner maintenant</a>
              </div>
            `;
          }
        }
      }

      container.innerHTML = `
        <div class="parent-codes-manager">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 15px; margin-bottom: 20px;">
            <div>
              <h2 style="text-align: left;">Gestion des Codes d'Accès Enfants</h2>
              <p class="subtitle mt-1" style="text-align: left;">Créez et gérez les invitations Premium pour vos enfants (maximum 3 enfants par famille).</p>
            </div>
            <a href="#dashboard" class="btn btn-secondary btn-sm">⬅ Retour au Tableau de Bord</a>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px;" class="mt-4">
            ${slotsHtml}
          </div>
          
          <div class="info-card glass-card p-4 mt-5">
            <h4 style="color: var(--color-warning);">💡 Comment lier le compte de votre enfant ?</h4>
            <ol class="mt-2 text-small" style="padding-left: 20px; line-height: 1.8;">
              <li>Cliquez sur le bouton <strong>"Générer le code d'accès"</strong> ci-dessus pour le slot disponible.</li>
              <li>Copiez le code généré (ex: <code>ORIENT-PARENT-PAR-...</code>).</li>
              <li>Transmettez ce code à votre enfant (par WhatsApp, SMS, ou de vive voix).</li>
              <li>Votre enfant doit aller sur Orient.ci, se rendre sur la page <strong>"Activer un Code"</strong> dans le menu, renseigner son nom et valider le code.</li>
              <li>Une fois activé, son compte passe en Premium et vous pourrez voir son avancement en temps réel sur votre Tableau de Bord Parent.</li>
            </ol>
          </div>
        </div>
      `;

      // Attach copy listeners
      container.querySelectorAll('.btn-copy-code').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const code = e.target.dataset.code;
          navigator.clipboard.writeText(code).then(() => {
            const originalText = btn.textContent;
            btn.textContent = '✓ Copié !';
            setTimeout(() => {
              btn.textContent = originalText;
            }, 2000);
          });
        });
      });

      // Attach generate listeners
      container.querySelectorAll('.btn-generate-slot').forEach(btn => {
        btn.addEventListener('click', () => {
          const parentId = btn.dataset.parentId;
          const result = StorageManager.generateParentCode(parentId);
          if (result.success) {
            renderSlots();
          } else {
            alert(result.error);
          }
        });
      });
    };

    renderSlots();
  }
};
