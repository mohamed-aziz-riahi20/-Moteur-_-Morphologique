import { 
  MorphologyRequest, 
  SchemeRequest, 
  ValidationResult, 
  AVLNode, 
  HashTableStructure, 
  TransformationGroup 
} from '../types';

/**
 * URL de base pour les appels API du backend Spring Boot.
 */
const BASE_URL = 'http://localhost:8080/api/morphology';

/**
 * Utilitaire de gestion des réponses HTTP.
 * Traite les erreurs et parse le contenu en fonction du type (JSON ou Texte brut).
 * 
 * @param response La réponse Fetch API.
 * @returns Le contenu de la réponse (objet JSON ou string).
 * @throws Error si le statut HTTP n'est pas OK.
 */
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Une erreur est survenue');
  }
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  }
  return response.text();
};

/**
 * Service API pour l'interaction avec le module de morphologie arabe.
 */
export const morphologyApi = {

  // ==========================================
  //      SERVICES DE GÉNÉRATION ET VALIDATION
  // ==========================================

  /**
   * Génère un mot unique basé sur une racine et un schème.
   * @param request Objet contenant la racine et le schème.
   */
  generate: async (request: MorphologyRequest): Promise<string> => {
    const response = await fetch(`${BASE_URL}/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });
    return handleResponse(response);
  },

  /**
   * Génère tous les dérivés possibles pour une racine donnée.
   * @param request Objet contenant la racine cible.
   */
  generateAll: async (request: MorphologyRequest): Promise<string[]> => {
    const response = await fetch(`${BASE_URL}/generate-all`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });
    return handleResponse(response);
  },

  /**
   * Valide l'appartenance d'un mot à une racine.
   * @param request Objet contenant la racine et le mot à tester.
   */
  validate: async (request: MorphologyRequest): Promise<ValidationResult> => {
    const response = await fetch(`${BASE_URL}/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });
    return handleResponse(response);
  },

  /**
   * Récupère l'historique des dérivés validés pour une racine.
   * @param request Objet contenant la racine cible.
   */
  getDerivatives: async (request: MorphologyRequest): Promise<string[]> => {
    const response = await fetch(`${BASE_URL}/derivatives`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });
    return handleResponse(response);
  },

  // ==========================================
  //       SERVICES DE RÉCUPÉRATION DE LISTES
  // ==========================================

  /**
   * Récupère la liste de toutes les racines présentes dans le système.
   */
  getRoots: async (): Promise<string[]> => {
    const response = await fetch(`${BASE_URL}/roots`);
    return handleResponse(response);
  },

  /**
   * Récupère la liste de tous les schèmes disponibles.
   */
  getSchemes: async (): Promise<string[]> => {
    const response = await fetch(`${BASE_URL}/schemes`);
    return handleResponse(response);
  },

  // ==========================================
  //       SERVICES D'ADMINISTRATION
  // ==========================================

  /**
   * Ajoute un nouveau schème morphologique.
   * @param request Objet contenant le nom et la règle du schème.
   */
  addScheme: async (request: SchemeRequest): Promise<string> => {
    const response = await fetch(`${BASE_URL}/scheme`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });
    return handleResponse(response);
  },

  /**
   * Récupère tous les groupes de règles de transformation.
   */
  getAllTransformations: async (): Promise<TransformationGroup[]> => {
    const response = await fetch(`${BASE_URL}/admin/transformations`);
    return handleResponse(response);
  },

  /**
   * Enregistre ou met à jour un groupe de transformations complexes.
   * @param group L'objet TransformationGroup complet.
   */
  saveTransformationGroup: async (group: TransformationGroup): Promise<TransformationGroup> => {
    const response = await fetch(`${BASE_URL}/admin/transformations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(group),
    });
    return handleResponse(response);
  },

  /**
   * Supprime un groupe de transformations par sa clé unique.
   * @param key Identifiant du groupe (ex: mithal_افتعل).
   */
  deleteTransformationGroup: async (key: string): Promise<void> => {
    const response = await fetch(`${BASE_URL}/admin/transformations/${encodeURIComponent(key)}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      const err = await response.text();
      throw new Error(err || 'Erreur suppression');
    }
  },

  // ==========================================
  //       DÉBOGAGE ET STRUCTURES INTERNES
  // ==========================================

  /**
   * Récupère l'état complet de l'arbre AVL (Visualisation).
   */
  getTreeStructure: async (): Promise<AVLNode> => {
    const response = await fetch(`${BASE_URL}/debug/tree`);
    return handleResponse(response);
  },

      getStatistics: async (): Promise<any> => {
    const response = await fetch(`${BASE_URL}/statistics`);
    return handleResponse(response);
  },

  /**
   * Récupère l'état complet de la table de hachage (Visualisation).
   */
  getHashStructure: async (): Promise<HashTableStructure> => {
    const response = await fetch(`${BASE_URL}/debug/hash`);
    return handleResponse(response);
  },
};