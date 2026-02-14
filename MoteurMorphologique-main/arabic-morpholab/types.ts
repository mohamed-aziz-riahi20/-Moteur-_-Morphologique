/**
 * ============================================================================
 * MODÈLES DE REQUÊTES (DTO)
 * ============================================================================
 */

/**
 * Objet de requête pour les opérations morphologiques standard.
 */
export interface MorphologyRequest {
  /** La racine trilitère cible (ex: كتب) */
  root: string;
  /** Le nom du schème (requis pour la génération simple) */
  scheme?: string;
  /** Le mot complet (requis pour la validation) */
  word?: string;
}

/**
 * Objet de requête pour l'ajout ou la modification d'un schème.
 */
export interface SchemeRequest {
  /** Nom unique du schème (ex: فاعل) */
  scheme: string;
  /** Formule de construction utilisant {1}, {2}, {3} */
  rule: string;
}

/**
 * ============================================================================
 * MODÈLES DE RÉPONSES
 * ============================================================================
 */

/**
 * Résultat détaillé d'une opération de validation morphologique.
 */
export interface ValidationResult {
  /** Indique si la structure du mot est conforme à la racine */
  valid: boolean;
  /** La racine identifiée par l'analyseur */
  root: string | null;
  /** Le nom du schème détecté lors de la validation */
  scheme: string | null;
}

/**
 * ============================================================================
 * STRUCTURES DE DONNÉES (VISUALISATION)
 * ============================================================================
 */

/**
 * Représentation d'un nœud de l'arbre AVL pour la visualisation du débogage.
 */
export interface AVLNode {
  /** La valeur de la racine stockée dans le nœud */
  root: string;
  /** Hauteur du nœud dans l'arbre pour l'équilibre */
  height: number;
  /** Enfant gauche (optionnel) */
  left?: AVLNode;
  /** Enfant droit (optionnel) */
  right?: AVLNode;
}

/**
 * Entrée unique dans un compartiment de la table de hachage.
 */
export interface HashEntry {
  /** Clé (nom du schème) */
  key: string;
  /** Valeur (règle de construction) */
  value: string;
}

/**
 * Représentation globale de la structure de la table de hachage manuelle.
 */
export interface HashTableStructure {
  /** Tableau de buckets, chaque bucket contenant une liste d'entrées (chaînage) */
  buckets: (HashEntry[])[];
}

/**
 * ============================================================================
 * GESTION DES TRANSFORMATIONS (ADMINISTRATION)
 * ============================================================================
 */

/**
 * Règle de transformation unitaire appliquée après la construction de base.
 */
export interface TransformationRule {
  /** Type d'action : remplacement global ou du caractère final */
  type: 'replace' | 'replace_final';
  /** Chaîne source à rechercher (optionnel pour replace_final) */
  from?: string;
  /** Chaîne de remplacement */
  to: string;
  /** Rang d'exécution de la règle (0-n) */
  order: number;
  /** Note explicative sur la transformation */
  comment?: string;
}

/**
 * Groupe de règles de transformation associé à un contexte spécifique.
 */
export interface TransformationGroup {
  /** Identifiant du groupe (ex: naqis_فاعل) */
  key: string;
  /** Liste ordonnée des règles à appliquer */
  rules: TransformationRule[];
  /** Description globale du groupe de règles */
  comment?: string;
}
export interface Stats {
  totalRoots: number;
  totalPatterns: number;
  totalDerivatives: number;
  density: string;
}

/**
 * ============================================================================
 * NAVIGATION ET UI
 * ============================================================================
 */

/**
 * Identifiants des différents onglets de l'application.
 */
export type TabType =
  | 'generate'
  | 'validate'
  | 'schemes'
  | 'derivatives'
  | 'visualize'
  | 'transformations'
  | 'statistics';