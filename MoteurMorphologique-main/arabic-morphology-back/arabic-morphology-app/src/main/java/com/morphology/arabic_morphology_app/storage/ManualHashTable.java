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
    private int size = 0;
    private final double loadFactor = 0.75;
    private int capacity;

    /**
     * Initialise la table avec une capacité initiale.
     */
    public ManualHashTable() {
        this.capacity = 16;
        table = new Entry[capacity];
    }

    /**
     * Initialise la table avec une capacité initiale personnalisée.
     * @param initialCapacity La capacité initiale.
     */
    public ManualHashTable(int initialCapacity) {
        this.capacity = initialCapacity;
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
        if (key == null) return;

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
        size++;

        // Vérification si on doit redimensionner
        if (size > capacity * loadFactor) {
            resize(capacity * 2);
        }
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
                size--;
                return current.value;
            }
            previous = current;
            current = current.next;
        }

        return null; // non trouvé
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
     * Redimensionne la table de hachage à une nouvelle capacité.
     * @param newCapacity La nouvelle capacité.
     */
    private void resize(int newCapacity) {
        Entry[] oldTable = table;
        capacity = newCapacity;
        table = new Entry[capacity];
        size = 0;  // on va recompter pendant le rehash

        // Re-hachage de tous les éléments
        for (Entry entry : oldTable) {
            Entry current = entry;
            while (current != null) {
                put(current.key, current.value);   // ← on réutilise put()
                current = current.next;
            }
        }
    }

    /**
     * Retourne le nombre d'entrées dans la table.
     * @return Le nombre d'entrées.
     */
    public int size() {
        return size;
    }

    /**
     * Retourne la capacité actuelle de la table.
     * @return La capacité.
     */
    public int capacity() {
        return capacity;
    }

    /**
     * Calcule et retourne le facteur de charge actuel.
     * @return Le facteur de charge.
     */
    public double getLoadFactor() {
        return (double) size / capacity;
    }

    /**
     * Retourne la longueur de la chaîne la plus longue (pour débogage des collisions).
     * @return La longueur maximale d'une chaîne.
     */
    public int getLongestChain() {
        int max = 0;
        for (Entry e : table) {
            int len = 0;
            Entry current = e;
            while (current != null) {
                len++;
                current = current.next;
            }
            max = Math.max(max, len);
        }
        return max;
    }
}