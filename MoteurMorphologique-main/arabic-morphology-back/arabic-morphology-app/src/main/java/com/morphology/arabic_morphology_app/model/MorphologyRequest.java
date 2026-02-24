package com.morphology.arabic_morphology_app.model;

/**
 * Objet de transfert de données (DTO) pour les requêtes morphologiques.
 * Cette classe encapsule les informations nécessaires pour la génération,
 * la validation et la récupération des dérivés.
 */
public class MorphologyRequest {

    /**
     * La racine trilitère arabe (ex: كتب).
     * Utilisé pour : generate, generate-all, validate, derivatives.
     */
    private String root;

    /**
     * Le nom du schème à appliquer (ex: فاعل).
     * Utilisé pour : generate.
     */
    private String scheme;

    /**
     * Le mot complet à vérifier.
     * Utilisé pour : validate.
     */
    private String word;

    // ==========================================
    //            GETTERS ET SETTERS
    // ==========================================

    public String getRoot() {
        return root;
    }

    public void setRoot(String root) {
        this.root = root;
    }

    public String getScheme() {
        return scheme;
    }

    public void setScheme(String scheme) {
        this.scheme = scheme;
    }

    public String getWord() {
        return word;
    }

    public void setWord(String word) {
        this.word = word;
    }
}