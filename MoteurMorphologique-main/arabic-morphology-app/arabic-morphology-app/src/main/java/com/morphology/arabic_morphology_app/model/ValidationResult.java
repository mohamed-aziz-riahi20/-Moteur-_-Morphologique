package com.morphology.arabic_morphology_app.model;

/**
 * Représente le résultat d'une opération de validation morphologique.
 * Cet objet encapsule le verdict de l'analyse (valide ou non) ainsi que les
 * métadonnées identifiées lors du processus (racine et schème).
 */
public class ValidationResult {

    /** Indique si le mot testé est conforme à la racine selon les schèmes connus. */
    private boolean valid;

    /** La racine arabe associée au mot validé. */
    private String root;

    /** Le nom du schème morphologique identifié (ex: فاعل). */
    private String scheme;

    // ==========================================
    //              CONSTRUCTEUR
    // ==========================================

    /**
     * Constructeur complet pour initialiser un résultat de validation.
     *
     * @param valid  Verdict de la validation (true/false).
     * @param root   La racine trilitère identifiée.
     * @param scheme Le nom du schème identifié.
     */
    public ValidationResult(boolean valid, String root, String scheme) {
        this.valid = valid;
        this.root = root;
        this.scheme = scheme;
    }

    // ==========================================
    //            GETTERS ET ACCESSEURS
    // ==========================================

    /**
     * @return true si le mot est structurellement valide pour cette racine.
     */
    public boolean isValid() {
        return valid;
    }

    /**
     * @return La racine arabe d'origine.
     */
    public String getRoot() {
        return root;
    }

    /**
     * @return Le schème utilisé pour la construction du mot.
     */
    public String getScheme() {
        return scheme;
    }
}