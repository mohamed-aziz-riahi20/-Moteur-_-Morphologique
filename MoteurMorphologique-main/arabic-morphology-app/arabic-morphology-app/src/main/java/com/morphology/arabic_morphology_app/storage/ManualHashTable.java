package com.morphology.arabic_morphology_app.storage;

import java.util.ArrayList;
import java.util.List;

/**
 * Implémentation manuelle d'une table de hachage (Hash Table).
 * Cette structure est utilisée pour stocker les schèmes morphologiques et leurs règles.
 * Elle gère les collisions par la méthode du chaînage (Linked List).
 */
public class ManualHashTable {

    /**
     * Représente une entrée (paire clé-valeur) dans la table de hachage.
     */
    public static class Entry {
        public String key;
        public String value;
        public Entry next;

        /**
         * Constructeur d'entrée.
         * @param k Nom du schème (clé).
         * @param v Règle associée (valeur).
         */
        Entry(String k, String v) {
            this.key = k;
            this.value = v;
        }
    }

    private Entry[] table;
    private final int capacity = 16;

    /**
     * Initialise la table avec une capacité fixe.
     */
    public ManualHashTable() {
        table = new Entry[capacity];
    }

    // ==========================================
    //           LOGIQUE DE HACHAGE
    // ==========================================

    /**
     * Calcule l'indice du compartiment (bucket) pour une clé donnée.
     *
     * @param key La chaîne de caractères à hacher.
     * @return L'indice calculé (entre 0 et capacity-1).
     */
    private int hash(String key) {
        return Math.abs(key.hashCode() % capacity);
    }

    // ==========================================
    //            OPÉRATIONS DE BASE
    // ==========================================

    /**
     * Ajoute ou met à jour une règle dans la table.
     * Si la clé existe déjà, sa valeur est mise à jour.
     *
     * @param key Le nom du schème.
     * @param value La règle de construction.
     */
    public void put(String key, String value) {
        int h = hash(key);
        Entry current = table[h];

        // Recherche si la clé existe déjà pour mise à jour
        while (current != null) {
            if (current.key.equals(key)) {
                current.value = value;
                return;
            }
            current = current.next;
        }

        // Gestion de la collision : ajout en tête de liste
        Entry newEntry = new Entry(key, value);
        newEntry.next = table[h];
        table[h] = newEntry;
    }

    /**
     * Récupère la règle associée à un schème.
     *
     * @param key Le nom du schème à rechercher.
     * @return La règle correspondante ou null si absente.
     */
    public String get(String key) {
        int h = hash(key);
        Entry current = table[h];

        while (current != null) {
            if (current.key.equals(key)) {
                return current.value;
            }
            current = current.next;
        }
        return null;
    }

    // ==========================================
    //       RÉCUPÉRATION ET ÉTAT INTERNE
    // ==========================================

    /**
     * Retourne l'intégralité des entrées de la table sous forme de liste.
     * Utile pour itérer sur tous les schèmes disponibles.
     *
     * @return Liste de tableaux de chaînes [clé, valeur].
     */
    public List<String[]> getAll() {
        List<String[]> list = new ArrayList<>();
        for (Entry entry : table) {
            Entry curr = entry;
            while (curr != null) {
                list.add(new String[]{curr.key, curr.value});
                curr = curr.next;
            }
        }
        return list;
    }

    /**
     * Accesseur à la structure de données interne.
     * Utilisé pour la visualisation des collisions dans l'interface de débogage.
     *
     * @return Le tableau brut d'entrées.
     */
    public Entry[] getInternalTable() {
        return table;
    }













    /**
     * Supprime l'entrée correspondant à la clé donnée.
     * @param key la clé à supprimer
     * @return la valeur qui était associée (ou null si absent)
     */
    public String remove(String key) {
        if (key == null) return null;

        int index = hash(key);
        Entry current = table[index];
        Entry previous = null;

        while (current != null) {
            if (current.key.equals(key)) {
                if (previous == null) {
                    // Suppression en tête de liste
                    table[index] = current.next;
                } else {
                    // Suppression au milieu ou en fin
                    previous.next = current.next;
                }
                return current.value;
            }
            previous = current;
            current = current.next;
        }

        return null; // non trouvé
    }
}