// Gestion de l'état persistant via localStorage
const STORAGE_KEYS = {
  CURRENT_USER: 'orient_ci_current_user',
  STUDENTS: 'orient_ci_students',
  SUBSCRIPTIONS: 'orient_ci_subscriptions',
  SCHOOL_CODES: 'orient_ci_school_codes'
};

// Utilisateurs de démo par défaut si localStorage est vide
const DEFAULT_STUDENTS = [];

export const StorageManager = {
  init() {
    if (!localStorage.getItem(STORAGE_KEYS.STUDENTS)) {
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(DEFAULT_STUDENTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.SCHOOL_CODES)) {
      const initialCodes = [
        { code: 'ABIDJAN-INP-2026', used: false, schoolId: 'school_1' },
        { code: 'BOUAKE-BAC-7789', used: false, schoolId: 'school_1' },
        { code: 'YAKRO-CPGE-9901', used: false, schoolId: 'school_1' }
      ];
      localStorage.setItem(STORAGE_KEYS.SCHOOL_CODES, JSON.stringify(initialCodes));
    }
  },

  getCurrentUser() {
    const user = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (!user) {
      // Utilisateur anonyme par défaut
      const defaultUser = { role: 'anonymous', name: 'Visiteur', plan: null, activeSubscription: false };
      this.setCurrentUser(defaultUser);
      return defaultUser;
    }
    return JSON.parse(user);
  },

  setCurrentUser(user) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  },

  logout() {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    window.location.reload();
  },

  getStudents() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.STUDENTS)) || [];
  },

  saveStudent(student) {
    const students = this.getStudents();
    const index = students.findIndex(s => s.id === student.id);
    if (index !== -1) {
      students[index] = student;
    } else {
      students.push(student);
    }
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  },

  getSchoolCodes() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.SCHOOL_CODES)) || [];
  },

  useSchoolCode(codeString, studentName) {
    const codes = this.getSchoolCodes();
    const codeObj = codes.find(c => c.code === codeString && !c.used);
    if (codeObj) {
      codeObj.used = true;
      codeObj.usedBy = studentName;
      codeObj.usedAt = new Date().toISOString();
      localStorage.setItem(STORAGE_KEYS.SCHOOL_CODES, JSON.stringify(codes));
      return { success: true, schoolId: codeObj.schoolId };
    }
    return { success: false, error: 'Code invalide ou déjà utilisé' };
  },

  generateSchoolCode(schoolId) {
    const codes = this.getSchoolCodes();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newCode = {
      code: `ORIENT-ECOLE-${schoolId.substring(0, 3).toUpperCase()}-${randomSuffix}`,
      used: false,
      schoolId: schoolId,
      createdAt: new Date().toISOString()
    };
    codes.push(newCode);
    localStorage.setItem(STORAGE_KEYS.SCHOOL_CODES, JSON.stringify(codes));
    return newCode;
  },

  activateSubscription(role, planType, details = {}) {
    const currentUser = this.getCurrentUser();
    currentUser.role = role;
    currentUser.plan = planType;
    currentUser.activeSubscription = true;
    currentUser.subscriptionDetails = {
      date: new Date().toLocaleDateString('fr-FR'),
      method: details.method || 'Mobile Money',
      ...details
    };
    this.setCurrentUser(currentUser);
    
    // Si c'est un élève, on met également à jour son enregistrement élève
    if (role === 'student') {
      const student = {
        id: currentUser.id || 'student_new_' + Math.floor(Math.random() * 1000),
        name: currentUser.name,
        plan: planType,
        activeSubscription: true,
        grades: currentUser.grades || {},
        series: currentUser.series || '',
        interests: currentUser.interests || [],
        results: currentUser.results || []
      };
      currentUser.id = student.id;
      this.setCurrentUser(currentUser);
      this.saveStudent(student);
    }
  }
};
