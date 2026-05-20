// Gestion de l'état persistant via localStorage
const STORAGE_KEYS = {
  CURRENT_USER: 'orient_ci_current_user',
  STUDENTS: 'orient_ci_students',
  SUBSCRIPTIONS: 'orient_ci_subscriptions',
  SCHOOL_CODES: 'orient_ci_school_codes',
  PARENT_CODES: 'orient_ci_parent_codes'
};

export const StorageManager = {

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

  generateSchoolCodesBulk(schoolId, count) {
    const codes = this.getSchoolCodes();
    const prefix = schoolId.substring(0, 3).toUpperCase();
    const generated = [];
    
    for (let i = 0; i < count; i++) {
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const newCode = {
        code: `ORIENT-ECOLE-${prefix}-${randomSuffix}-${i + 1}`,
        used: false,
        schoolId: schoolId,
        createdAt: new Date().toISOString()
      };
      codes.push(newCode);
      generated.push(newCode);
    }
    
    localStorage.setItem(STORAGE_KEYS.SCHOOL_CODES, JSON.stringify(codes));
    return generated;
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
    if (details.parentId) currentUser.parentId = details.parentId;
    if (details.schoolId) currentUser.schoolId = details.schoolId;
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
        results: currentUser.results || [],
        parentId: details.parentId || undefined,
        schoolId: details.schoolId || undefined
      };
      currentUser.id = student.id;
      this.setCurrentUser(currentUser);
      this.saveStudent(student);
    }
  },

  getParentCodes() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.PARENT_CODES)) || [];
  },

  generateParentCode(parentId) {
    const codes = this.getParentCodes();
    const myCodes = codes.filter(c => c.parentId === parentId);
    if (myCodes.length >= 3) {
      return { success: false, error: 'Limite de 3 codes enfants atteinte.' };
    }
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newCode = {
      code: `ORIENT-PARENT-PAR-${randomSuffix}-${myCodes.length + 1}`,
      used: false,
      parentId: parentId,
      createdAt: new Date().toISOString()
    };
    codes.push(newCode);
    localStorage.setItem(STORAGE_KEYS.PARENT_CODES, JSON.stringify(codes));
    return { success: true, code: newCode };
  },

  useParentCode(codeString, studentName) {
    const codes = this.getParentCodes();
    const codeObj = codes.find(c => c.code === codeString && !c.used);
    if (codeObj) {
      codeObj.used = true;
      codeObj.usedBy = studentName;
      codeObj.usedAt = new Date().toISOString();
      localStorage.setItem(STORAGE_KEYS.PARENT_CODES, JSON.stringify(codes));
      return { success: true, parentId: codeObj.parentId };
    }
    return { success: false, error: 'Code parent invalide ou déjà utilisé' };
  }
};
