package com.morphology.arabic_morphology_app.model;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

/**
 * Représente un ensemble cohérent de règles de transformation morphologique.
 * Un groupe est identifié par une clé unique (ex: mithal_افتعل) et contient
 * une liste ordonnée de règles à appliquer ainsi que des métadonnées (commentaires).
 */
public class TransformationGroup {

    /** Clé unique identifiant le contexte de transformation (type_schème) */
    private String key;

    /** Liste ordonnée des règles de transformation (opérations de remplacement) */
    private List<TransformationRule> rules = new ArrayList<>();

    /** Commentaire descriptif ou note linguistique sur le groupe */
    private String comment;

    // ==========================================
    //              CONSTRUCTEURS
    // ==========================================

    /**
     * Constructeur par défaut requis pour la désérialisation JSON.
     */
    public TransformationGroup() {
    }

    /**
     * Constructeur avec initialisation de la clé.
     * @param key Identifiant du groupe.
     */
    public TransformationGroup(String key) {
        this.key = key;
    }

    // ==========================================
    //            GETTERS ET SETTERS
    // ==========================================

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public List<TransformationRule> getRules() {
        return rules;
    }

    /**
     * Définit la liste des règles. Garantit que la liste n'est jamais nulle.
     * @param rules Liste de règles TransformationRule.
     */
    public void setRules(List<TransformationRule> rules) {
        this.rules = rules != null ? rules : new ArrayList<>();
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    // ==========================================
    //           MÉTHODES UTILITAIRES
    // ==========================================

    /**
     * Ajoute une règle à la fin de la liste existante.
     * Définit automatiquement l'ordre de la règle en fonction de sa position.
     *
     * @param rule La règle à ajouter.
     */
    public void addRule(TransformationRule rule) {
        if (rule != null) {
            rule.setOrder(rules.size());
            rules.add(rule);
        }
    }

    // ==========================================
    //         MÉTHODES DE COMPARAISON
    // ==========================================

    /**
     * Deux groupes sont considérés égaux si leurs clés sont identiques.
     */
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        TransformationGroup that = (TransformationGroup) o;
        return Objects.equals(key, that.key);
    }

    @Override
    public int hashCode() {
        return Objects.hash(key);
    }

    @Override
    public String toString() {
        return "TransformationGroup{" +
                "key='" + key + '\'' +
                ", rulesCount=" + rules.size() +
                ", comment='" + comment + '\'' +
                '}';
    }
}