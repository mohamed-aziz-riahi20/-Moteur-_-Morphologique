package com.morphology.arabic_morphology_app.model;

/**
 * Énumération définissant les types structurels des racines arabes.
 * Cette classification est basée sur la présence et la position des lettres faibles
 * (و, ي, ا) au sein de la racine trilitère.
 */
public enum RootType {

    /**
     * Racine saine (Salim - الصحيح السالم).
     * Aucune lettre faible dans la racine (ex: كتب).
     */
    REGULAR,

    /**
     * Racine assimilée (Mithal - المثال).
     * La première lettre de la racine est faible (ex: وعد).
     */
    MITHAL,

    /**
     * Racine creuse (Ajwaf - الأجوف).
     * La deuxième lettre de la racine est faible (ex: قول).
     */
    AJWAF,

    /**
     * Racine défectueuse (Naqis - الناقص).
     * La troisième lettre de la racine est faible (ex: رمي).
     */
    NAQIS,

    /**
     * Racine doublement faible (Lafif - اللفيف).
     * Comporte deux lettres faibles, consécutives ou séparées (ex: وقي, روي).
     */
    LAFIF
}