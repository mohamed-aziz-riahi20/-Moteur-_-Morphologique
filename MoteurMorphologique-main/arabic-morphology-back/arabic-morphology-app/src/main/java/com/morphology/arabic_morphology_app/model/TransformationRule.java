package com.morphology.arabic_morphology_app.model;

import java.util.Objects;

/**
 * Représente une règle de transformation élémentaire.
 * Une règle définit une opération atomique de remplacement (standard ou en fin de mot)
 * appliquée lors de la génération morphologique pour gérer les irrégularités.
 */
public class TransformationRule {

    /** Type d'opération : "replace" (remplacement global) ou "replace_final" (dernier caractère) */
    private String type;

    /** Le motif source à rechercher (peut être nul si le type est "replace_final") */
    private String from;

    /** Le motif de remplacement à appliquer */
    private String to;

    /** L'ordre d'exécution de la règle au sein de son groupe (index 0-n) */
    private int order;

    /** Commentaire explicatif sur la raison linguistique de cette règle */
    private String comment;

    // ==========================================
    //              CONSTRUCTEURS
    // ==========================================

    /**
     * Constructeur par défaut requis pour les frameworks de sérialisation (Jackson).
     */
    public TransformationRule() {
    }

    /**
     * Constructeur paramétré pour une instanciation rapide.
     *
     * @param type  Type de transformation ("replace" | "replace_final").
     * @param from  Chaîne source.
     * @param to    Chaîne de destination.
     * @param order Position dans la séquence d'exécution.
     */
    public TransformationRule(String type, String from, String to, int order) {
        this.type = type;
        this.from = from;
        this.to = to;
        this.order = order;
    }

    // ==========================================
    //            GETTERS ET SETTERS
    // ==========================================

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getFrom() {
        return from;
    }

    public void setFrom(String from) {
        this.from = from;
    }

    public String getTo() {
        return to;
    }

    public void setTo(String to) {
        this.to = to;
    }

    public int getOrder() {
        return order;
    }

    public void setOrder(int order) {
        this.order = order;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    // ==========================================
    //         MÉTHODES DE COMPARAISON
    // ==========================================

    /**
     * Compare l'égalité basée sur la structure technique de la règle et son ordre.
     */
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        TransformationRule that = (TransformationRule) o;
        return order == that.order &&
                Objects.equals(type, that.type) &&
                Objects.equals(from, that.from) &&
                Objects.equals(to, that.to);
    }

    @Override
    public int hashCode() {
        return Objects.hash(type, from, to, order);
    }

    @Override
    public String toString() {
        return "TransformationRule{" +
                "type='" + type + '\'' +
                ", from='" + from + '\'' +
                ", to='" + to + '\'' +
                ", order=" + order +
                '}';
    }
}