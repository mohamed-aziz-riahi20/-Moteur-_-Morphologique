package com.morphology.arabic_morphology_app.util;

import com.morphology.arabic_morphology_app.model.RootType;

/**
 * Utilitaire d'analyse structurelle des racines arabes.
 * Cette classe permet de classifier les racines selon la présence et la position
 * des lettres faibles (Waw, Ya, Alif) afin d'appliquer les règles de conjugaison appropriées.
 */
public class RootAnalyzer {

    /**
     * Détermine le type morphologique d'une racine trilitère.
     * La classification suit les priorités de la grammaire arabe :
     * 1. Lafif (Doublement faible) : Au moins deux lettres faibles.
     * 2. Mithal (Assimilé) : Première lettre faible.
     * 3. Ajwaf (Creux) : Deuxième lettre faible.
     * 4. Naqis (Défectueux) : Troisième lettre faible.
     * 5. Regular (Sain/Salim) : Aucune lettre faible.
     *
     * @param root La chaîne de 3 caractères représentant la racine.
     * @return Le RootType correspondant à la structure de la racine.
     * @throws IllegalArgumentException Si la racine n'est pas composée de 3 lettres.
     */
    public static RootType detectRootType(String root) {
        if (root == null || root.length() != 3) {
            throw new IllegalArgumentException("Racine invalide : une racine arabe doit comporter exactement 3 lettres.");
        }

        char f = root.charAt(0); // Fa' (1ère lettre)
        char m = root.charAt(1); // 'Ayn (2ème lettre)
        char l = root.charAt(2); // Lam (3ème lettre)

        // Identification des lettres faibles aux différentes positions
        boolean weakF = (f == 'و' || f == 'ي');
        boolean weakM = (m == 'و' || m == 'ي' || m == 'ا');
        boolean weakL = (l == 'و' || l == 'ي' || l == 'ا' || l == 'ى');

        // Calcul du nombre de lettres faibles pour détecter le type LAFIF
        int weakCount = (weakF ? 1 : 0) + (weakM ? 1 : 0) + (weakL ? 1 : 0);

        if (weakCount >= 2) {
            return RootType.LAFIF;
        }

        // Classification selon la position de l'unique lettre faible
        if (weakF) return RootType.MITHAL;
        if (weakM) return RootType.AJWAF;
        if (weakL) return RootType.NAQIS;

        return RootType.REGULAR;
    }

    /**
     * Extrait les lettres de la racine sous forme de tableau de caractères
     * en appliquant des correctifs heuristiques pour les lettres de transformation.
     *
     * Note : L'Alif médian ('ا') est converti par défaut en Waw ('و') car l'Alif
     * n'est jamais une lettre de racine originelle mais une transformation.
     *
     * @param root La racine à traiter.
     * @return Un tableau de caractères contenant les lettres originales supposées.
     */
    public static char[] extractOriginalLetters(String root) {
        char[] letters = root.toCharArray();

        // Heuristique : Un Alif en position médiane provient généralement d'un Waw
        // (Exemple : قال provient de قول)
        if (letters[1] == 'ا') {
            letters[1] = 'و';
        }

        return letters;
    }
}