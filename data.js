// Données des universités et grandes écoles en Côte d'Ivoire
export const BAC_SERIES = {
  'A1': { name: 'Série A1 (Littéraire / Mathématiques)', subjects: ['Français', 'Philosophie', 'Anglais', 'Mathématiques', 'Histoire-Géographie'] },
  'A2': { name: 'Série A2 (Littéraire / Langues)', subjects: ['Français', 'Philosophie', 'Anglais', 'Espagnol/Allemand', 'Histoire-Géographie'] },
  'B': { name: 'Série B (Économique et Sociale)', subjects: ['Français', 'Mathématiques', 'Sciences Économiques', 'Philosophie', 'Anglais', 'Histoire-Géographie'] },
  'C': { name: 'Série C (Scientifique - Mathématiques/Physique)', subjects: ['Mathématiques', 'Physique-Chimie', 'Français', 'Philosophie', 'Anglais', 'SVT'] },
  'D': { name: 'Série D (Scientifique - Sciences de la Vie/Terre)', subjects: ['SVT', 'Mathématiques', 'Physique-Chimie', 'Français', 'Philosophie', 'Anglais'] },
  'E': { name: 'Série E (Technologique - Mathématiques/Technique)', subjects: ['Mathématiques', 'Physique-Chimie', 'Technologie', 'Français', 'Philosophie', 'Anglais'] },
  'G1': { name: 'Série G1 (Secrétariat / Bureautique)', subjects: ['Français', 'Anglais', 'Technique Secrétariat', 'Histoire-Géographie'] },
  'G2': { name: 'Série G2 (Comptabilité / Gestion)', subjects: ['Mathématiques', 'Comptabilité', 'Économie', 'Français', 'Anglais'] }
};

export const CAREER_DOMAINS = [
  { id: 'health', name: 'Santé & Médecine', icon: '🩺' },
  { id: 'engineering', name: 'Ingénierie & Technologies', icon: '⚙️' },
  { id: 'business', name: 'Gestion, Commerce & Finance', icon: '📊' },
  { id: 'law_politics', name: 'Droit, Sciences Politiques & Relations', icon: '⚖️' },
  { id: 'agronomy', name: 'Agronomie & Environnement', icon: '🌱' },
  { id: 'humanities', name: 'Lettres, Langues & Sciences Humaines', icon: '✍️' },
  { id: 'digital_art', name: 'Arts, Design & Multimédia', icon: '🎨' }
];

export const UNIVERSITIES = [
  // ==========================================
  // 20 ÉTABLISSEMENTS PUBLICS (1 à 20)
  // ==========================================
  {
    id: 'inphb',
    name: 'INP-HB (Institut National Polytechnique Félix Houphouët-Boigny)',
    location: 'Yamoussoukro',
    type: 'Grande École Publique',
    status: 'Public',
    logo: '🏛️',
    description: 'Le pôle d\'excellence de l\'enseignement supérieur technologique en Côte d\'Ivoire.',
    website: 'https://www.inphb.ci',
    programs: [
      {
        name: 'CPGE (Classes Préparatoires aux Grandes Écoles)',
        domain: 'engineering',
        description: 'Préparation intensive de 2 ans pour intégrer les grandes écoles d\'ingénieurs (MPSI/PCSI).',
        duration: '2 ans',
        bacRequired: ['C', 'D', 'E'],
        minAverage: 14,
        keySubjects: { 'Mathématiques': 14, 'Physique-Chimie': 14 },
        concoursRequired: 'Concours direct d\'entrée CPGE (Maths, Physique, Français, Anglais)'
      },
      {
        name: 'EST (École Supérieure de Technologie)',
        domain: 'engineering',
        description: 'Formations de techniciens supérieurs et ingénieurs en informatique, électronique, génie civil.',
        duration: '3 ans (DUT/Licence)',
        bacRequired: ['C', 'D', 'E', 'B', 'G2'],
        minAverage: 12,
        keySubjects: { 'Mathématiques': 12 },
        concoursRequired: 'Concours d\'entrée INP-HB (Dossier + Épreuves d\'admissibilité)'
      }
    ]
  },
  {
    id: 'ufhb',
    name: 'Université Félix Houphouët-Boigny (UFHB)',
    location: 'Abidjan - Cocody',
    type: 'Université Publique',
    status: 'Public',
    logo: '🎓',
    description: 'La plus grande et ancienne université publique de Côte d\'Ivoire, proposant un large éventail de formations.',
    website: 'https://www.univ-fhb.edu.ci',
    programs: [
      {
        name: 'UFR Sciences Médicales (Médecine / Pharmacie / Odonto)',
        domain: 'health',
        description: 'Études médicales pour devenir médecin, pharmacien ou chirurgien-dentiste.',
        duration: '7 à 8 ans',
        bacRequired: ['C', 'D'],
        minAverage: 13,
        keySubjects: { 'SVT': 13, 'Physique-Chimie': 13, 'Mathématiques': 12 },
        concoursRequired: 'Sélection nationale d\'orientation (MESRS) + Commission d\'attribution UFR'
      },
      {
        name: 'UFR Droit (Sciences Juridiques et Politiques)',
        domain: 'law_politics',
        description: 'Formations menant aux carrières d\'avocat, magistrat, juriste d\'entreprise et diplomate.',
        duration: '3 ans (Licence)',
        bacRequired: ['A1', 'A2', 'B', 'C', 'D', 'G1'],
        minAverage: 11,
        keySubjects: { 'Français': 12, 'Philosophie': 11 },
        concoursRequired: null
      }
    ]
  },
  {
    id: 'una',
    name: 'Université Nangui Abrogoua (UNA)',
    location: 'Abidjan - Abobo-Adjamé',
    type: 'Université Publique',
    status: 'Public',
    logo: '🔬',
    description: 'Spécialisée dans les sciences fondamentales et appliquées : environnement, agroforesterie, technologie alimentaire.',
    website: 'https://www.univ-na.ci',
    programs: [
      {
        name: 'UFR SGE (Sciences et Gestion de l\'Environnement)',
        domain: 'agronomy',
        description: 'Préservation des écosystèmes, gestion des eaux, traitement des déchets.',
        duration: '3 ans (Licence)',
        bacRequired: ['C', 'D', 'E'],
        minAverage: 10.5,
        keySubjects: { 'SVT': 11, 'Physique-Chimie': 10 },
        concoursRequired: null
      }
    ]
  },
  {
    id: 'uao',
    name: 'Université Alassane Ouattara (UAO)',
    location: 'Bouaké',
    type: 'Université Publique',
    status: 'Public',
    logo: '⚖️',
    description: 'Deuxième pôle universitaire du pays, reconnu pour ses départements de sciences juridiques et de lettres.',
    website: 'https://www.univ-ao.edu.ci',
    programs: [
      {
        name: 'UFR Sciences Juridiques, Administratives et Politiques',
        domain: 'law_politics',
        description: 'Droit public, Droit privé, Administration générale.',
        duration: '3 ans',
        bacRequired: ['A1', 'A2', 'B', 'C', 'D'],
        minAverage: 10.5,
        keySubjects: { 'Français': 11, 'Philosophie': 11 },
        concoursRequired: null
      }
    ]
  },
  {
    id: 'esatic',
    name: 'ESATIC (École Supérieure Africaine des TIC)',
    location: 'Abidjan - Treichville',
    type: 'Grande École Publique',
    status: 'Public',
    logo: '💻',
    description: 'Établissement public de formation spécialisé dans les Technologies de l\'Information et de la Communication.',
    website: 'https://www.esatic.ci',
    programs: [
      {
        name: 'Licence en Réseaux et Télécommunications / Informatique',
        domain: 'engineering',
        description: 'Formation pratique et théorique en développement logiciel, cybersécurité, réseaux et télécoms.',
        duration: '3 ans',
        bacRequired: ['C', 'D', 'E'],
        minAverage: 12.5,
        keySubjects: { 'Mathématiques': 13, 'Physique-Chimie': 12, 'Anglais': 12 },
        concoursRequired: 'Concours d\'entrée ESATIC (Mathématiques, Physique, Anglais)'
      }
    ]
  },
  {
    id: 'ensea',
    name: 'ENSEA (École Nationale Supérieure de Statistique et d\'Économie Appliquée)',
    location: 'Abidjan - Cocody',
    type: 'Grande École Publique',
    status: 'Public',
    logo: '📈',
    description: 'Centre d\'excellence régional formant les cadres de la statistique et de l\'économie en Afrique.',
    website: 'https://www.ensea.ed.ci',
    programs: [
      {
        name: 'Licence Analyste Statisticien / ITS',
        domain: 'business',
        description: 'Formation de haut niveau en statistiques, probabilités, économétrie et informatique de gestion.',
        duration: '3 ans',
        bacRequired: ['C', 'D', 'E', 'B'],
        minAverage: 13,
        keySubjects: { 'Mathématiques': 13, 'Français': 11 },
        concoursRequired: 'Concours National ENSEA (Mathématiques, Français, Culture Générale)'
      }
    ]
  },
  {
    id: 'infas',
    name: 'INFAS (Institut National de Formation des Agents de Santé)',
    location: 'Abidjan / Bouaké / Korhogo',
    type: 'Établissement Public de Santé',
    status: 'Public',
    logo: '🩺',
    description: 'Établissement public assurant la formation des infirmiers, sages-femmes et techniciens de santé.',
    website: 'https://www.infas.ci',
    programs: [
      {
        name: 'Licence en Sciences Infirmières (Infirmier)',
        domain: 'health',
        description: 'Formation professionnelle d\'État pour administrer des soins infirmiers cliniques et préventifs.',
        duration: '3 ans',
        bacRequired: ['A1', 'A2', 'B', 'C', 'D', 'G1', 'G2'],
        minAverage: 11,
        keySubjects: { 'Français': 10, 'SVT': 11 },
        concoursRequired: 'Concours direct d\'entrée INFAS (Biologie/SVT, Français, Culture Générale)'
      }
    ]
  },
  {
    id: 'ujlo',
    name: 'UJLo (Université Jean Lorougnon Guédé)',
    location: 'Daloa',
    type: 'Université Publique',
    status: 'Public',
    logo: '🌴',
    description: 'Université publique spécialisée dans le développement durable, l\'agroforesterie et l\'environnement.',
    website: 'https://www.ujlg.edu.ci',
    programs: [
      {
        name: 'UFR Agroforesterie (Licence en Agroforesterie)',
        domain: 'agronomy',
        description: 'Études spécialisées dans la gestion des forêts, la production agricole et le reboisement.',
        duration: '3 ans',
        bacRequired: ['C', 'D'],
        minAverage: 11,
        keySubjects: { 'SVT': 12, 'Mathématiques': 10 },
        concoursRequired: null
      }
    ]
  },
  {
    id: 'upgc',
    name: 'UPGC (Université Peleforo Gon Coulibaly)',
    location: 'Korhogo',
    type: 'Université Publique',
    status: 'Public',
    logo: '🏔️',
    description: 'Université publique du nord de la Côte d\'Ivoire, proposant des formations axées sur le développement rural.',
    website: 'https://www.univ-upgc.edu.ci',
    programs: [
      {
        name: 'UFR Sciences Biologiques (Licence en Biologie Animale / Végétale)',
        domain: 'agronomy',
        description: 'Formations axées sur les sciences naturelles, la biodiversité sahélienne et l\'agronomie.',
        duration: '3 ans',
        bacRequired: ['C', 'D'],
        minAverage: 11,
        keySubjects: { 'SVT': 11, 'Physique-Chimie': 10 },
        concoursRequired: null
      }
    ]
  },
  {
    id: 'ujdm',
    name: 'UJDM (Université de Man)',
    location: 'Man',
    type: 'Université Publique',
    status: 'Public',
    logo: '⛰️',
    description: 'Université thématique publique à vocation scientifique, technologique et minière.',
    website: 'https://www.univ-man.edu.ci',
    programs: [
      {
        name: 'UFR Sciences Géologiques et Minières',
        domain: 'engineering',
        description: 'Spécialisation dans les ressources minières, la géologie appliquée et le génie minier.',
        duration: '3 ans',
        bacRequired: ['C', 'D', 'E'],
        minAverage: 12,
        keySubjects: { 'Mathématiques': 12, 'Physique-Chimie': 11 },
        concoursRequired: null
      }
    ]
  },
  {
    id: 'usp',
    name: 'USP (Université de San-Pédro)',
    location: 'San-Pédro',
    type: 'Université Publique',
    status: 'Public',
    logo: '⚓',
    description: 'Université publique à vocation maritime, touristique et logistique au cœur du second port du pays.',
    website: 'https://www.usp.edu.ci',
    programs: [
      {
        name: 'UFR Logistique, Tourisme et Hôtellerie-Restauration',
        domain: 'business',
        description: 'Management de la logistique portuaire, du transport maritime et gestion touristique.',
        duration: '3 ans',
        bacRequired: ['A1', 'B', 'C', 'D', 'G2'],
        minAverage: 11.5,
        keySubjects: { 'Mathématiques': 11, 'Anglais': 12 },
        concoursRequired: null
      }
    ]
  },
  {
    id: 'ubondoukou',
    name: 'Université de Bondoukou',
    location: 'Bondoukou',
    type: 'Université Publique',
    status: 'Public',
    logo: '🕌',
    description: 'Université publique d\'excellence axée sur les langues, l\'architecture, l\'urbanisme et le patrimoine.',
    website: 'https://www.univ-bondoukou.edu.ci',
    programs: [
      {
        name: 'UFR Architecture et Urbanisme',
        domain: 'digital_art',
        description: 'Formation de concepteurs d\'espaces, architectes et urbanistes adaptés au contexte africain.',
        duration: '3 ans',
        bacRequired: ['C', 'D', 'E'],
        minAverage: 12,
        keySubjects: { 'Mathématiques': 12, 'Physique-Chimie': 10 },
        concoursRequired: 'Test d\'aptitude artistique et entretien'
      }
    ]
  },
  {
    id: 'ens',
    name: 'ENS d\'Abidjan (École Normale Supérieure)',
    location: 'Abidjan - Cocody',
    type: 'Grande École Publique',
    status: 'Public',
    logo: '🧑‍🏫',
    description: 'Établissement public historique formant les enseignants des lycées et collèges de Côte d\'Ivoire.',
    website: 'https://www.ensabidjan.edu.ci',
    programs: [
      {
        name: 'CAP/CM (Professeur de Collège - Lettres / Sciences)',
        domain: 'humanities',
        description: 'Formation pédagogique et disciplinaire pour devenir enseignant certifié de l\'État.',
        duration: '2 ans',
        bacRequired: ['A1', 'A2', 'B', 'C', 'D'],
        minAverage: 11.5,
        keySubjects: { 'Français': 12, 'Philosophie': 11 },
        concoursRequired: 'Concours direct d\'entrée ENS (Épreuves écrites et orales de spécialité)'
      }
    ]
  },
  {
    id: 'injs',
    name: 'INJS (Institut National de la Jeunesse et des Sports)',
    location: 'Abidjan - Marcory',
    type: 'Établissement Public de Formation',
    status: 'Public',
    logo: '🏃',
    description: 'Institut public de référence formant les cadres du sport, de l\'animation et de l\'éducation physique.',
    website: 'https://www.injs.ci',
    programs: [
      {
        name: 'Professeur Adjoint d\'Éducation Physique et Sportive (EPS)',
        domain: 'health',
        description: 'Formation pratique et théorique à l\'enseignement des sports dans les établissements secondaires.',
        duration: '3 ans',
        bacRequired: ['A1', 'A2', 'B', 'C', 'D', 'G2'],
        minAverage: 11,
        keySubjects: { 'SVT': 10, 'Français': 10 },
        concoursRequired: 'Concours direct d\'entrée INJS (Épreuves d\'aptitude physique et épreuves écrites)'
      }
    ]
  },
  {
    id: 'insaac',
    name: 'INSAAC (Institut National Supérieur des Arts et de l\'Action Culturelle)',
    location: 'Abidjan - Cocody',
    type: 'Établissement Public Culturel',
    status: 'Public',
    logo: '🎨',
    description: 'Établissement public de formation artistique : musique, arts plastiques, danse, théâtre, tourisme.',
    website: 'https://www.insaac.edu.ci',
    programs: [
      {
        name: 'Licence en Arts Plastiques / Design / Musique',
        domain: 'digital_art',
        description: 'Formation de créateurs visuels, designers d\'art, musiciens et experts en action culturelle.',
        duration: '3 ans',
        bacRequired: ['A1', 'A2', 'B', 'C', 'D', 'G1'],
        minAverage: 10.5,
        keySubjects: { 'Français': 11 },
        concoursRequired: 'Concours direct d\'entrée INSAAC (Dossier + Épreuves artistiques pratiques)'
      }
    ]
  },
  {
    id: 'infpa',
    name: 'INFPA (Institut National de Formation Professionnelle Agricole)',
    location: 'Bingerville / Bouaké',
    type: 'Établissement Public de Formation',
    status: 'Public',
    logo: '🌱',
    description: 'Institut formant les techniciens en agriculture, élevage, pêche et agroalimentaire.',
    website: 'https://www.infpa.ci',
    programs: [
      {
        name: 'Technicien Supérieur en Agriculture / Productions Animales',
        domain: 'agronomy',
        description: 'Formation pratique aux techniques culturales modernes, élevage et entrepreneuriat agricole.',
        duration: '2 ans',
        bacRequired: ['C', 'D'],
        minAverage: 11,
        keySubjects: { 'SVT': 11, 'Physique-Chimie': 10 },
        concoursRequired: 'Concours direct d\'entrée INFPA (Sciences de la vie et de la terre, Chimie, Français)'
      }
    ]
  },
  {
    id: 'infs',
    name: 'INFS (Institut National de Formation Sociale)',
    location: 'Abidjan - Cocody',
    type: 'Établissement Public Social',
    status: 'Public',
    logo: '🤝',
    description: 'Établissement public formant les éducateurs, travailleurs sociaux et gestionnaires de structures sociales.',
    website: 'https://www.infs.ci',
    programs: [
      {
        name: 'Éducateur Spécialisé / Assistant Social',
        domain: 'humanities',
        description: 'Formation aux métiers de l\'aide à l\'enfance en difficulté, des personnes handicapées et de la médiation sociale.',
        duration: '3 ans',
        bacRequired: ['A1', 'A2', 'B', 'C', 'D'],
        minAverage: 11,
        keySubjects: { 'Français': 12, 'Philosophie': 11 },
        concoursRequired: 'Concours direct d\'entrée INFS (Français, Culture Générale, Oral d\'admission)'
      }
    ]
  },
  {
    id: 'ipnets',
    name: 'IPNETP (Institut Pédagogique National de l\'Enseignement Technique)',
    location: 'Abidjan - Cocody',
    type: 'Grande École Publique',
    status: 'Public',
    logo: '⚙️',
    description: 'Institut public formant les enseignants de l\'enseignement technique et de la formation professionnelle.',
    website: 'https://www.ipnetp.ci',
    programs: [
      {
        name: 'Professeur d\'Enseignement Technique (Licence)',
        domain: 'engineering',
        description: 'Formation pédagogique pour enseigner les sciences industrielles, le tertiaire et le génie civil.',
        duration: '2 ans',
        bacRequired: ['C', 'D', 'E', 'G2'],
        minAverage: 12,
        keySubjects: { 'Mathématiques': 12, 'Physique-Chimie': 11 },
        concoursRequired: 'Concours direct d\'entrée IPNETP (Épreuves disciplinaires et entretien)'
      }
    ]
  },
  {
    id: 'cafop',
    name: 'CAFOP (Centre d\'Animation et de Formation Pédagogique)',
    location: 'Plusieurs antennes régionales',
    type: 'Établissement Public de Formation',
    status: 'Public',
    logo: '✏️',
    description: 'Centres publics d\'État formant les instituteurs adjoints du primaire en Côte d\'Ivoire.',
    website: 'https://www.men-dexc.ci',
    programs: [
      {
        name: 'Instituteur Adjoint (IA)',
        domain: 'humanities',
        description: 'Formation professionnelle d\'un an menant au métier d\'enseignant au primaire public.',
        duration: '1 an',
        bacRequired: ['A1', 'A2', 'B', 'C', 'D', 'G1', 'G2'],
        minAverage: 10.5,
        keySubjects: { 'Français': 11 },
        concoursRequired: 'Concours direct du CAFOP (Épreuves de Français, Mathématiques, Culture Générale)'
      }
    ]
  },
  {
    id: 'arstm',
    name: 'ARSTM (Académie Régionale des Sciences et Techniques de la Mer)',
    location: 'Abidjan - Yopougon',
    type: 'Institution Publique Régionale',
    status: 'Public',
    logo: '🚢',
    description: 'Institution publique régionale d\'excellence pour les formations maritimes, portuaires et industrielles.',
    website: 'https://www.arstm.org',
    programs: [
      {
        name: 'Sciences Nautiques / Machine (Officier Marine Marchande)',
        domain: 'engineering',
        description: 'Formation rigoureuse d\'officiers navigants et de techniciens supérieurs en génie maritime.',
        duration: '3 ans',
        bacRequired: ['C', 'D', 'E'],
        minAverage: 12.5,
        keySubjects: { 'Mathématiques': 13, 'Physique-Chimie': 12, 'Anglais': 11 },
        concoursRequired: 'Concours direct d\'entrée ARSTM (Mathématiques, Physique, Français, Anglais)'
      }
    ]
  },

  // ==========================================
  // 20 ÉTABLISSEMENTS PRIVÉS (21 à 40)
  // ==========================================
  {
    id: 'uigb',
    name: 'UIGB (Université Internationale de Grand-Bassam)',
    location: 'Grand-Bassam',
    type: 'Université Privée',
    status: 'Privé',
    logo: '🇺🇸',
    description: 'Université privée de style américain dispensant un enseignement supérieur entièrement en anglais.',
    website: 'https://www.uigb.edu.ci',
    programs: [
      {
        name: 'Bachelor of Business Administration (BBA)',
        domain: 'business',
        description: 'Formation de standard international en comptabilité, finance, marketing et management.',
        duration: '4 ans',
        bacRequired: ['A1', 'A2', 'B', 'C', 'D', 'G2'],
        minAverage: 12,
        keySubjects: { 'Anglais': 13, 'Mathématiques': 10 },
        concoursRequired: 'Sélection sur dossier + Entretien + Test d\'anglais TOEFL'
      },
      {
        name: 'Bachelor of Science in Computer Science',
        domain: 'engineering',
        description: 'Programme rigoureux axé sur le développement logiciel, les bases de données et la cybersécurité.',
        duration: '4 ans',
        bacRequired: ['C', 'D', 'E'],
        minAverage: 12.5,
        keySubjects: { 'Mathématiques': 12, 'Anglais': 12 },
        concoursRequired: 'Sélection sur dossier + Entretien + Test d\'anglais TOEFL'
      }
    ]
  },
  {
    id: 'lagunes',
    name: 'Université des Lagunes (CIDD)',
    location: 'Abidjan - Cocody',
    type: 'Université Privée',
    status: 'Privé',
    logo: '🏰',
    description: 'Établissement privé réputé pour sa rigueur académique en droit, économie et sciences de gestion.',
    website: 'https://www.universitedeslagunes.ci',
    programs: [
      {
        name: 'Licence en Droit',
        domain: 'law_politics',
        description: 'Formation solide en droit privé et public préparant aux carrières juridiques d\'excellence.',
        duration: '3 ans',
        bacRequired: ['A1', 'A2', 'B', 'C', 'D'],
        minAverage: 11.5,
        keySubjects: { 'Français': 12, 'Philosophie': 11 },
        concoursRequired: 'Concours propre d\'admission (Écrit de français/culture générale & Entretien)'
      }
    ]
  },
  {
    id: 'atlantique',
    name: 'Université de l\'Atlantique (UA)',
    location: 'Abidjan - Cocody',
    type: 'Université Privée',
    status: 'Privé',
    logo: '⚓',
    description: 'Université privée historique offrant des formations diversifiées et axées sur l\'employabilité directe.',
    website: 'https://www.uatlantique.org',
    programs: [
      {
        name: 'Licence en Droit / Sciences Politiques',
        domain: 'law_politics',
        description: 'Formation juridique générale menant vers les métiers de la justice et de l\'administration.',
        duration: '3 ans',
        bacRequired: ['A1', 'A2', 'B', 'C', 'D'],
        minAverage: 10,
        keySubjects: { 'Français': 10 },
        concoursRequired: 'Direct sur dossier (Étude des bulletins de terminale)'
      }
    ]
  },
  {
    id: 'ucao',
    name: 'UCAO-UUA (Université Catholique de l\'Afrique de l\'Ouest)',
    location: 'Abidjan - Cocody',
    type: 'Université Privée',
    status: 'Privé',
    logo: '⛪',
    description: 'Université privée confessionnelle de premier plan réputée pour ses facultés de Droit et de Gestion.',
    website: 'https://www.ucao-uua.ci',
    programs: [
      {
        name: 'Licence en Droit / Sciences Juridiques',
        domain: 'law_politics',
        description: 'Formation complète en droit des affaires, droit public et relations internationales.',
        duration: '3 ans',
        bacRequired: ['A1', 'A2', 'B', 'C', 'D'],
        minAverage: 11,
        keySubjects: { 'Français': 12, 'Philosophie': 11 },
        concoursRequired: 'Sélection sur dossier & entretien de motivation'
      }
    ]
  },
  {
    id: 'umeci',
    name: 'UMECI (Université Méthodiste de Côte d\'Ivoire)',
    location: 'Abidjan - Cocody',
    type: 'Université Privée',
    status: 'Privé',
    logo: '⛪',
    description: 'Université privée de la confession méthodiste offrant des programmes d\'études innovants en sciences politiques.',
    website: 'https://www.umeci.ci',
    programs: [
      {
        name: 'Licence Professionnelle en Criminologie',
        domain: 'law_politics',
        description: 'Études spécialisées dans la prévention de la délinquance, la sécurité et la psychologie criminelle.',
        duration: '3 ans',
        bacRequired: ['A1', 'A2', 'B', 'C', 'D'],
        minAverage: 11,
        keySubjects: { 'Français': 11, 'Philosophie': 10 },
        concoursRequired: 'Sélection sur dossier d\'inscription'
      }
    ]
  },
  {
    id: 'iua',
    name: 'IUA (Institut Universitaire d\'Abidjan)',
    location: 'Abidjan - Cocody',
    type: 'Université Privée',
    status: 'Privé',
    logo: '🦁',
    description: 'Institut universitaire privé d\'excellence reconnu pour la qualité de ses programmes de droit anglo-saxon.',
    website: 'https://www.iua.ci',
    programs: [
      {
        name: 'Licence en Sciences de Gestion / Finance',
        domain: 'business',
        description: 'Formation théorique et pratique aux techniques modernes de gestion et de finance des marchés.',
        duration: '3 ans',
        bacRequired: ['A1', 'B', 'C', 'D', 'G2'],
        minAverage: 11,
        keySubjects: { 'Mathématiques': 10, 'Anglais': 11 },
        concoursRequired: 'Dossier et entretien individuel de sélection'
      }
    ]
  },
  {
    id: 'loko',
    name: 'Groupe CSI Loko',
    location: 'Abidjan - Marcory',
    type: 'Grande École Privée',
    status: 'Privé',
    logo: '🏗️',
    description: 'L\'un des plus anciens et prestigieux groupes d\'enseignement technique et professionnel de Côte d\'Ivoire.',
    website: 'https://www.csiloko.ci',
    programs: [
      {
        name: 'BTS Génie Civil / Travaux Publics',
        domain: 'engineering',
        description: 'Formation de techniciens supérieurs capables de diriger des chantiers de construction routière ou de bâtiments.',
        duration: '2 ans',
        bacRequired: ['C', 'D', 'E'],
        minAverage: 10,
        keySubjects: { 'Mathématiques': 10, 'Physique-Chimie': 10 },
        concoursRequired: 'Admission directe sur étude de dossier de terminale'
      }
    ]
  },
  {
    id: 'hetec',
    name: 'HETEC (Haute École des Études Commerciales et Technologiques)',
    location: 'Abidjan - Marcory',
    type: 'Grande École Privée',
    status: 'Privé',
    logo: '🎓',
    description: 'Établissement privé réputé pour ses diplômes en marketing et commerce international dans toute l\'Afrique de l\'Ouest.',
    website: 'https://www.hetec.ci',
    programs: [
      {
        name: 'Licence Professionnelle en Marketing & Commerce International',
        domain: 'business',
        description: 'Formation pratique orientée commerce de gros, vente stratégique et commerce extérieur.',
        duration: '3 ans',
        bacRequired: ['A1', 'B', 'C', 'D', 'G2'],
        minAverage: 10.5,
        keySubjects: { 'Anglais': 10, 'Mathématiques': 9 },
        concoursRequired: 'Sélection sur dossier de candidature'
      }
    ]
  },
  {
    id: 'ustci',
    name: 'USTCI (Université des Sciences et Technologies de Côte d\'Ivoire)',
    location: 'Abidjan - Cocody',
    type: 'Université Privée',
    status: 'Privé',
    logo: '🔬',
    description: 'Université privée technologique affiliée au Réseau des Universités des Sciences et Technologies d\'Afrique.',
    website: 'https://www.ustci.ci',
    programs: [
      {
        name: 'Licence en Génie Informatique (Réseaux / Génie Logiciel)',
        domain: 'engineering',
        description: 'Spécialisation dans les infrastructures réseau, le codage applicatif et l\'administration système.',
        duration: '3 ans',
        bacRequired: ['C', 'D', 'E'],
        minAverage: 11,
        keySubjects: { 'Mathématiques': 11, 'Anglais': 10 },
        concoursRequired: 'Sélection sur étude de dossier'
      }
    ]
  },
  {
    id: 'mde',
    name: 'MDE Business School',
    location: 'Abidjan - Cocody',
    type: 'Grande École Privée',
    status: 'Privé',
    logo: '📈',
    description: 'École d\'affaires d\'élite en Côte d\'Ivoire, en partenariat avec le prestigieux IESE Business School.',
    website: 'https://www.mde.ci',
    programs: [
      {
        name: 'Executive Bachelor en Management des Affaires',
        domain: 'business',
        description: 'Programme de haut niveau pour futurs dirigeants d\'entreprises et managers opérationnels.',
        duration: '3 ans',
        bacRequired: ['A1', 'B', 'C', 'D', 'G2'],
        minAverage: 12,
        keySubjects: { 'Mathématiques': 11, 'Anglais': 12 },
        concoursRequired: 'Concours d\'admission interne (Logique, Anglais, Entretien de jury)'
      }
    ]
  },
  {
    id: 'agitel',
    name: 'AGITEL International',
    location: 'Abidjan - Cocody',
    type: 'Grande École Privée',
    status: 'Privé',
    logo: '📡',
    description: 'Grande école privée pionnière dans la formation des ingénieurs télécoms et des managers du tertiaire.',
    website: 'https://www.agitel.ci',
    programs: [
      {
        name: 'Licence en Télécommunications et Réseaux',
        domain: 'engineering',
        description: 'Études appliquées en conception de réseaux mobiles, câblage structuré et routage IP.',
        duration: '3 ans',
        bacRequired: ['C', 'D', 'E', 'B'],
        minAverage: 10.5,
        keySubjects: { 'Mathématiques': 11, 'Physique-Chimie': 10 },
        concoursRequired: 'Sélection sur dossier de terminale'
      }
    ]
  },
  {
    id: 'uiss',
    name: 'UISS (Université Internationale des Sciences Sociales)',
    location: 'Abidjan - Yopougon',
    type: 'Université Privée',
    status: 'Privé',
    logo: '👥',
    description: 'Université privée dédiée aux disciplines des sciences sociales, de la psychologie et des ressources humaines.',
    website: 'https://www.uiss.ci',
    programs: [
      {
        name: 'Licence en Sociologie et Développement',
        domain: 'humanities',
        description: 'Formation à l\'analyse des phénomènes sociaux, du développement communautaire et de la médiation interculturelle.',
        duration: '3 ans',
        bacRequired: ['A1', 'A2', 'B', 'C', 'D'],
        minAverage: 10,
        keySubjects: { 'Français': 10, 'Philosophie': 10 },
        concoursRequired: 'Dossier d\'inscription direct'
      }
    ]
  },
  {
    id: 'istci',
    name: 'IST-CI (Institut Supérieur de Technologie de Côte d\'Ivoire)',
    location: 'Abidjan - Cocody',
    type: 'Grande École Privée',
    status: 'Privé',
    logo: '⚡',
    description: 'Grande école privée formant les techniciens supérieurs et ingénieurs en génie électrique et maintenance.',
    website: 'https://www.istci.ci',
    programs: [
      {
        name: 'BTS Électrotechnique / Automatismes Industriels',
        domain: 'engineering',
        description: 'Formation orientée maintenance industrielle, automates programmables et réseaux électriques d\'usine.',
        duration: '2 ans',
        bacRequired: ['C', 'D', 'E'],
        minAverage: 10,
        keySubjects: { 'Mathématiques': 10, 'Physique-Chimie': 10 },
        concoursRequired: 'Dossier d\'inscription direct'
      }
    ]
  },
  {
    id: 'upionm',
    name: 'UPI-ONM (Université Polytechnique Obiang Nguema Mbasogo)',
    location: 'Abidjan - Cocody',
    type: 'Université Privée',
    status: 'Privé',
    logo: '🏢',
    description: 'Université polytechnique privée offrant des programmes de pointe en génie civil et architecture.',
    website: 'https://www.upionm.ci',
    programs: [
      {
        name: 'Licence en Architecture d\'Intérieur et Design',
        domain: 'digital_art',
        description: 'Étude du design d\'espace, modélisation 3D, gestion des volumes et décoration professionnelle.',
        duration: '3 ans',
        bacRequired: ['C', 'D', 'E'],
        minAverage: 11,
        keySubjects: { 'Mathématiques': 11, 'Français': 10 },
        concoursRequired: 'Sélection sur dossier & entretien d\'orientation'
      }
    ]
  },
  {
    id: 'celti',
    name: 'CELTI (Centre d\'Enseignement Libre et de Tech Informatiques)',
    location: 'Abidjan - Treichville',
    type: 'Grande École Privée',
    status: 'Privé',
    logo: '💻',
    description: 'Établissement privé historique axé sur le développement d\'applications informatiques complexes.',
    website: 'https://www.celti.ci',
    programs: [
      {
        name: 'Licence Professionnelle en Génie Logiciel',
        domain: 'engineering',
        description: 'Développement d\'applications de gestion, programmation Web (JS, Python, PHP) et bases de données SQL.',
        duration: '3 ans',
        bacRequired: ['C', 'D', 'E', 'G2'],
        minAverage: 10.5,
        keySubjects: { 'Mathématiques': 10, 'Anglais': 10 },
        concoursRequired: 'Sélection sur dossier'
      }
    ]
  },
  {
    id: 'estm',
    name: 'ESTM (École Supérieure des Technologies et de Management)',
    location: 'Abidjan - Cocody',
    type: 'Grande École Privée',
    status: 'Privé',
    logo: '🛡️',
    description: 'École d\'ingénieurs et de managers privée réputée pour ses formations en télécommunications et management.',
    website: 'https://www.estm.ci',
    programs: [
      {
        name: 'Licence en Management de projets de technologies',
        domain: 'engineering',
        description: 'Formation combinant les sciences de l\'ingénieur et les méthodologies agiles de gestion de projets technologiques.',
        duration: '3 ans',
        bacRequired: ['C', 'D', 'B', 'G2'],
        minAverage: 11,
        keySubjects: { 'Mathématiques': 10, 'Anglais': 11 },
        concoursRequired: 'Sélection sur dossier'
      }
    ]
  },
  {
    id: 'esm',
    name: 'Groupe ESM (École Supérieure de Management)',
    location: 'Abidjan - Plateau',
    type: 'Grande École Privée',
    status: 'Privé',
    logo: '👔',
    description: 'Grande école privée du Plateau spécialisée dans la formation aux ressources humaines et à la communication.',
    website: 'https://www.esm.ci',
    programs: [
      {
        name: 'Licence en Gestion des Ressources Humaines',
        domain: 'business',
        description: 'Administration du personnel, législation du travail en Côte d\'Ivoire, gestion de la paie.',
        duration: '3 ans',
        bacRequired: ['A1', 'A2', 'B', 'C', 'D', 'G1', 'G2'],
        minAverage: 10,
        keySubjects: { 'Français': 10, 'Philosophie': 10 },
        concoursRequired: 'Dossier d\'inscription direct'
      }
    ]
  },
  {
    id: 'iphb',
    name: 'Institut Polytechnique Houphouët-Boigny (IPHB)',
    location: 'Abidjan - Abobo',
    type: 'Grande École Privée',
    status: 'Privé',
    logo: '☀️',
    description: 'Établissement privé dédié aux formations industrielles, énergétiques et de développement durable.',
    website: 'https://www.iphb-abidjan.ci',
    programs: [
      {
        name: 'Licence Professionnelle en Énergies Renouvelables',
        domain: 'engineering',
        description: 'Formation aux installations solaires photovoltaïques, efficacité énergétique et réseaux électriques intelligents.',
        duration: '3 ans',
        bacRequired: ['C', 'D', 'E'],
        minAverage: 11,
        keySubjects: { 'Mathématiques': 11, 'Physique-Chimie': 11 },
        concoursRequired: 'Étude de dossier scolaire'
      }
    ]
  },
  {
    id: 'ued',
    name: 'UED (Université de l\'Entrepreneuriat et du Développement)',
    location: 'Abidjan - Cocody',
    type: 'Université Privée',
    status: 'Privé',
    logo: '🚀',
    description: 'Université privée innovante où le projet de fin d\'études est la création d\'une entreprise viable.',
    website: 'https://www.ued.ci',
    programs: [
      {
        name: 'Licence en Entrepreneuriat et Création de Start-up',
        domain: 'business',
        description: 'Incubation de projets, modélisation d\'affaires, levée de fonds et techniques de négociation commerciale.',
        duration: '3 ans',
        bacRequired: ['A1', 'B', 'C', 'D', 'G2'],
        minAverage: 10,
        keySubjects: { 'Français': 10, 'Mathématiques': 9 },
        concoursRequired: 'Entretien approfondi de sélection sur projet professionnel'
      }
    ]
  },
  {
    id: 'esam',
    name: 'ESAM (École Supérieure des Affaires et de Management)',
    location: 'Abidjan - Marcory',
    type: 'Grande École Privée',
    status: 'Privé',
    logo: '💵',
    description: 'Grande école privée orientée vers les métiers de la banque, de l\'assurance et de la comptabilité analytique.',
    website: 'https://www.esam.ci',
    programs: [
      {
        name: 'Licence en Finance & Comptabilité',
        domain: 'business',
        description: 'Comptabilité approfondie des sociétés, gestion de trésorerie, audit financier, fiscalité locale.',
        duration: '3 ans',
        bacRequired: ['B', 'C', 'D', 'G2'],
        minAverage: 10.5,
        keySubjects: { 'Mathématiques': 11, 'Anglais': 10 },
        concoursRequired: 'Sélection sur dossier de candidature'
      }
    ]
  }
];
