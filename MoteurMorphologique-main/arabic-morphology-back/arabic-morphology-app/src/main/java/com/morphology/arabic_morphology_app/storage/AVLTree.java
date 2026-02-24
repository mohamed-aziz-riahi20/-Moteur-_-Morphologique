package com.morphology.arabic_morphology_app.storage;

import java.util.ArrayList;
import java.util.List;

/**
 * Implémentation d'un arbre binaire de recherche auto-équilibré (Arbre AVL).
 * Utilisé pour stocker les racines arabes de manière optimisée avec une complexité
 * de recherche, d'insertion et de suppression en O(log n).
 */
public class AVLTree {

    /**
     * Représente un nœud à l'intérieur de l'arbre AVL.
     */
    public static class Node {
        public String root;
        public int height;
        public Node left, right;

        /** Liste des mots dérivés validés associés à cette racine */
        public List<Derivative> validatedDerivatives;

        /**
         * Constructeur de nœud.
         * @param d La racine arabe (ex: كتب).
         */
        Node(String d) {
            this.root = d;
            this.height = 1;
            this.validatedDerivatives = new ArrayList<>();
        }
    }

    /**
     * Représente un mot dérivé généré et validé.
     */
    public static class Derivative {
        public String word;
        public int frequency;

        /**
         * Constructeur de dérivé.
         * @param word Le mot généré.
         */
        public Derivative(String word) {
            this.word = word;
            this.frequency = 1;
        }
    }

    private Node rootNode;

    // ==========================================
    //            API PUBLIQUE
    // ==========================================

    /**
     * Insère une nouvelle racine dans l'arbre.
     * @param root La chaîne de caractères représentant la racine.
     */
    public void insert(String root) {
        rootNode = insert(rootNode, root);
    }

    /**
     * Vérifie si une racine existe dans l'arbre.
     * @param root La racine à rechercher.
     * @return Vrai si la racine est présente.
     */
    public boolean contains(String root) {
        return find(rootNode, root) != null;
    }

    /**
     * Recherche et retourne le nœud correspondant à une racine.
     * @param root La racine cible.
     * @return Le nœud complet ou null s'il n'est pas trouvé.
     */
    public Node find(String root) {
        return find(rootNode, root);
    }

    /**
     * Accesseur pour le nœud racine de l'arbre (utile pour le débogage).
     * @return Le nœud racine actuel.
     */
    public Node getRootNode() {
        return rootNode;
    }

    public List<Node> getAllNodes() {
        List<Node> nodes = new ArrayList<>();
        inorderTraversal(rootNode, nodes);   //
        return nodes;
    }

    private void inorderTraversal(Node current, List<Node> nodes) {
        if (current == null) return;

        inorderTraversal(current.left, nodes);
        nodes.add(current);
        inorderTraversal(current.right, nodes);
    }

    // ==========================================
    //       LOGIQUE DE RECHERCHE ET INSERTION
    // ==========================================

    /**
     * Méthode récursive pour rechercher un nœud.
     */
    private Node find(Node node, String target) {
        if (node == null) return null;
        if (target.equals(node.root)) return node;

        return target.compareTo(node.root) < 0
                ? find(node.left, target)
                : find(node.right, target);
    }

    /**
     * Méthode récursive pour insérer une clé et rééquilibrer l'arbre.
     */
    private Node insert(Node node, String key) {
        // 1. Insertion standard BST
        if (node == null) return new Node(key);

        if (key.compareTo(node.root) < 0) {
            node.left = insert(node.left, key);
        } else if (key.compareTo(node.root) > 0) {
            node.right = insert(node.right, key);
        } else {
            return node; // Doublons non autorisés
        }

        // 2. Mise à jour de la hauteur du nœud ancêtre
        node.height = 1 + Math.max(height(node.left), height(node.right));

        // 3. Calcul du facteur d'équilibre
        int balance = getBalance(node);

        // 4. Cas de déséquilibre (Rotations)

        // Cas Gauche-Gauche
        if (balance > 1 && key.compareTo(node.left.root) < 0) {
            return rightRotate(node);
        }

        // Cas Droite-Droite
        if (balance < -1 && key.compareTo(node.right.root) > 0) {
            return leftRotate(node);
        }

        // Cas Gauche-Droite
        if (balance > 1 && key.compareTo(node.left.root) > 0) {
            node.left = leftRotate(node.left);
            return rightRotate(node);
        }

        // Cas Droite-Gauche
        if (balance < -1 && key.compareTo(node.right.root) < 0) {
            node.right = rightRotate(node.right);
            return leftRotate(node);
        }

        return node;
    }

    // ==========================================
    //        UTILITAIRES ET ROTATIONS AVL
    // ==========================================

    private int height(Node n) {
        return n == null ? 0 : n.height;
    }

    private int getBalance(Node n) {
        return n == null ? 0 : height(n.left) - height(n.right);
    }

    /**
     * Rotation à droite pour rééquilibrer un sous-arbre penché à gauche.
     */
    private Node rightRotate(Node y) {
        Node x = y.left;
        Node T2 = x.right;

        // Rotation
        x.right = y;
        y.left = T2;

        // Mise à jour des hauteurs
        y.height = Math.max(height(y.left), height(y.right)) + 1;
        x.height = Math.max(height(x.left), height(x.right)) + 1;

        return x;
    }

    /**
     * Rotation à gauche pour rééquilibrer un sous-arbre penché à droite.
     */
    private Node leftRotate(Node x) {
        Node y = x.right;
        Node T2 = y.left;

        // Rotation
        y.left = x;
        x.right = T2;

        // Mise à jour des hauteurs
        x.height = Math.max(height(x.left), height(x.right)) + 1;
        y.height = Math.max(height(y.left), height(y.right)) + 1;

        return y;
    }
}