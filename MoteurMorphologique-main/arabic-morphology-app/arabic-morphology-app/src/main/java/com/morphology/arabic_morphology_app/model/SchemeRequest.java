package com.morphology.arabic_morphology_app.model;

/**
 * Objet de transfert de données (DTO) pour la gestion des schèmes.
 * Utilisé pour encapsuler les informations lors de l'ajout d'un nouveau schème
 * ou de la modification d'une règle de construction existante.
 */
public class SchemeRequest {

    /**
     * Le nom du schème morphologique (ex: فاعل, مفعول).
     */
    private String scheme;

    /**
     * La règle de construction associée utilisant des placeholders (ex: {1}ا{2}{3}).
     */
    private String rule;

    // ==========================================
    //            GETTERS ET SETTERS
    // ==========================================

    /**
     * @return Le nom du schème.
     */
    public String getScheme() {
        return scheme;
    }

    /**
     * @param scheme Le nom du schème à définir.
     */
    public void setScheme(String scheme) {
        this.scheme = scheme;
    }

    /**
     * @return La formule de construction du schème.
     */
    public String getRule() {
        return rule;
    }

    /**
     * @param rule La règle de construction à définir.
     */
    public void setRule(String rule) {
        this.rule = rule;
    }
}