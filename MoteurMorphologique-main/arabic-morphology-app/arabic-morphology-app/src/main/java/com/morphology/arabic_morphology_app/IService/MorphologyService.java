package com.morphology.arabic_morphology_app.IService;

import com.morphology.arabic_morphology_app.model.StatisticsResponse;
import com.morphology.arabic_morphology_app.model.TransformationGroup;
import com.morphology.arabic_morphology_app.model.ValidationResult;

import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * Interface définissant les services de morphologie arabe.
 * Regroupe la logique de chargement, de génération, de validation
 * et d'administration des règles de transformation.
 */
public interface MorphologyService {

    // ==========================================
    //      CHARGEMENT ET INITIALISATION
    // ==========================================

    /**
     * Charge les racines arabes depuis un fichier texte vers la structure AVL.
     * @param filePath Chemin du fichier ressources.
     */
    void loadRoots(String filePath);

    /**
     * Charge les schèmes morphologiques depuis un fichier texte vers la table de hachage.
     * @param filePath Chemin du fichier ressources.
     */
    void loadSchemes(String filePath);

    // ==========================================
    //       CŒUR DE LA LOGIQUE MORPHOLOGIQUE
    // ==========================================

    /**
     * Ajoute dynamiquement un schème et sa règle associée.
     * @param scheme Nom du schème (ex: فاعل).
     * @param rule Règle de construction (ex: {1}ا{2}{3}).
     */
    void addScheme(String scheme, String rule);

    /**
     * Génère un mot arabe à partir d'une racine et d'un schème.
     * @param root La racine de 3 lettres.
     * @param scheme Le nom du schème à appliquer.
     * @return Le mot généré.
     */
    String generate(String root, String scheme);

    /**
     * Génère l'intégralité des dérivés possibles pour une racine.
     * @param root La racine cible.
     * @return Liste de tous les mots générés.
     */
    List<String> generateAll(String root);

    /**
     * Valide un mot par rapport à une racine en cherchant un schème correspondant.
     * @param root La racine d'origine.
     * @param word Le mot à tester.
     * @return Résultat de validation (booléen, racine, schème).
     */
    ValidationResult validate(String root, String word);

    // ==========================================
    //        GESTION DES DÉRIVÉS ET LISTES
    // ==========================================

    /**
     * Récupère les dérivés déjà validés et leur fréquence pour une racine.
     * @param root La racine cible.
     * @return Un ensemble de dérivés formatés.
     */
    Set<String> getDerivatives(String root);

    /**
     * Retourne la liste triée de toutes les racines présentes dans l'arbre AVL.
     * @return Liste de chaînes de caractères.
     */
    List<String> getRootsList();

    /**
     * Retourne la liste de tous les noms de schèmes enregistrés.
     * @return Liste de chaînes de caractères.
     */
    List<String> getSchemesList();

    // ==========================================
    //     ADMINISTRATION DES TRANSFORMATIONS
    // ==========================================

    /**
     * Récupère tous les groupes de règles de transformation (Idgham, Ibdal, etc.).
     * @return Liste de TransformationGroup.
     */
    List<TransformationGroup> getAllTransformationGroups();

    /**
     * Récupère un groupe de transformation spécifique par sa clé.
     * @param key Identifiant du groupe.
     * @return Le groupe correspondant.
     */
    TransformationGroup getTransformationGroup(String key);

    /**
     * Sauvegarde ou met à jour un groupe de transformations physiquement et en mémoire.
     * @param group Le groupe à enregistrer.
     * @return Le groupe après sauvegarde.
     */
    TransformationGroup saveTransformationGroup(TransformationGroup group);

    /**
     * Supprime un groupe de règles de transformation.
     * @param key La clé du groupe à supprimer.
     * @return Vrai si la suppression a réussi.
     */
    boolean deleteTransformationGroup(String key);

    // ==========================================
    //      DEBUG ET STRUCTURES DE DONNÉES
    // ==========================================

    /**
     * Retourne la structure brute de l'arbre AVL pour visualisation.
     * @return Le nœud racine de l'arbre.
     */
    Object getTreeStructure();

    /**
     * Retourne l'état interne de la table de hachage manuelle.
     * @return Une structure représentant les buckets et les entrées.
     */
    List<List<Map<String, String>>> getHashStructure();

    StatisticsResponse computeStatistics();







    /**
     * Met à jour la règle associée à un schème existant.
     * @param scheme nom exact du schème (clé)
     * @param newRule nouvelle règle à associer
     * @throws IllegalArgumentException si le schème n'existe pas
     */
    void updateScheme(String scheme, String newRule);

    /**
     * Supprime complètement un schème (mémoire + fichier).
     * @param scheme nom exact du schème à supprimer
     * @throws IllegalArgumentException si le schème n'existe pas
     */
    void deleteScheme(String scheme);




    /**
     * Retourne tous les schèmes avec leurs règles (Map<nom, règle>)
     * Utile pour l'édition dans l'interface admin
     */
    Map<String, String> getSchemesWithRules();
}