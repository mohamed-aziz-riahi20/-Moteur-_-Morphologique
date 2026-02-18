package com.morphology.arabic_morphology_app.Service;

import com.morphology.arabic_morphology_app.IService.MorphologyService;
import com.morphology.arabic_morphology_app.model.*;
import com.morphology.arabic_morphology_app.storage.AVLTree;
import com.morphology.arabic_morphology_app.storage.ManualHashTable;
import com.morphology.arabic_morphology_app.util.RootAnalyzer;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Implémentation principale du service de morphologie arabe.
 * Gère le stockage des racines (AVL), des schèmes (Hashtable) et l'application
 * des règles de transformation complexes (Idgham, Ibdal).
 */
@Service
public class MorphologyServiceImpl implements MorphologyService {

    // Structures de stockage internes
    private final AVLTree rootAVL = new AVLTree();
    private final ManualHashTable patternTable = new ManualHashTable();

    // Cache des transformations (clé: type_schème, valeur: liste d'opérations)
    private Map<String, List<Map<String, String>>> transformations = new HashMap<>();

    // Liste structurée des groupes de transformations pour l'administration
    private List<TransformationGroup> transformationGroups = new ArrayList<>();

    // ==========================================
    //       INITIALISATION ET CYCLE DE VIE
    // ==========================================

    /**
     * Initialise le service en chargeant les données depuis les fichiers ressources
     * au démarrage de l'application.
     */
    @PostConstruct
    public void init() {
        loadRoots("racines.txt");
        loadSchemes("schemes.txt");
        loadAndParseTransformations();
    }

    // ==========================================
    //      CHARGEMENT ET PERSISTENCE (I/O)
    // ==========================================

    @Override
    public void loadRoots(String fileName) {
        InputStream is = getClass().getClassLoader().getResourceAsStream(fileName);
        if (is == null) {
            System.err.println("Fichier de racines introuvable : " + fileName);
            return;
        }
        try (BufferedReader br = new BufferedReader(new InputStreamReader(is, StandardCharsets.UTF_8))) {
            String line;
            while ((line = br.readLine()) != null) {
                line = line.trim();
                if (line.isEmpty() || line.startsWith("#")) continue;
                rootAVL.insert(line);
            }
            System.out.println("✅ Racines chargées dans l'arbre AVL.");
        } catch (Exception e) {
            System.err.println("Erreur chargement racines: " + e.getMessage());
        }
    }

    @Override
    public void loadSchemes(String fileName) {
        InputStream is = getClass().getClassLoader().getResourceAsStream(fileName);
        if (is == null) return;
        try (BufferedReader br = new BufferedReader(new InputStreamReader(is, StandardCharsets.UTF_8))) {
            String line;
            while ((line = br.readLine()) != null) {
                line = line.trim();
                if (line.isEmpty()) continue;
                String[] p = line.split("=");
                if (p.length == 2) {
                    patternTable.put(p[0].trim(), p[1].trim());
                }
            }
        } catch (Exception e) {
            System.err.println("Erreur chargement schèmes: " + e.getMessage());
        }
    }

    @Override
    public void addScheme(String scheme, String rule) {
        patternTable.put(scheme, rule);
        saveSchemeToFile(scheme, rule);
    }


    /**
     * Sauvegarde physiquement un nouveau schème dans le fichier texte.
     */
    private void saveSchemeToFile(String scheme, String rule) {
        String filePath = "src/main/resources/schemes.txt";
        try (BufferedWriter writer = new BufferedWriter(
                new OutputStreamWriter(new FileOutputStream(filePath, true), StandardCharsets.UTF_8))) {
            writer.newLine();
            writer.write(scheme + "=" + rule);
            System.out.println("✅ Fichier schemes.txt mis à jour.");
        } catch (IOException e) {
            System.err.println("❌ Erreur écriture schemes.txt: " + e.getMessage());
        }
    }

    // ==========================================
    //        CŒUR DE LA LOGIQUE (GÉNÉRATION)
    // ==========================================

    @Override
    public String generate(String root, String schemeName) {
        if (!rootAVL.contains(root)) throw new RuntimeException("Racine inconnue");
        String rule = patternTable.get(schemeName);
        if (rule == null) throw new RuntimeException("Schème inconnu");

        String word = applyRule(root, rule, schemeName);
        updateDerivativeList(root, word);
        return word;
    }

    @Override
    public List<String> generateAll(String root) {
        if (!rootAVL.contains(root)) return Collections.emptyList();
        List<String> results = new ArrayList<>();
        for (String[] entry : patternTable.getAll()) {
            String word = applyRule(root, entry[1], entry[0]);
            updateDerivativeList(root, word);
            results.add(word);
        }
        return results;
    }

    @Override
    public ValidationResult validate(String root, String word) {
        if (!rootAVL.contains(root)) return new ValidationResult(false, null, null);
        for (String[] entry : patternTable.getAll()) {
            if (applyRule(root, entry[1], entry[0]).equals(word)) {
                updateDerivativeList(root, word);
                return new ValidationResult(true, root, entry[0]);
            }
        }
        return new ValidationResult(false, root, null);
    }

    // ==========================================
    //       MOTEUR DE TRANSFORMATION (INTERNE)
    // ==========================================

    /**
     * Applique les règles de construction et de transformation morphologique.
     */
    private String applyRule(String root, String rule, String schemeName) {
        char[] letters = RootAnalyzer.extractOriginalLetters(root);

        // 1. Insertion des lettres de la racine dans le schème
        String word = rule.replace("{1}", String.valueOf(letters[0]))
                .replace("{2}", String.valueOf(letters[1]))
                .replace("{3}", String.valueOf(letters[2]));

        RootType type = RootAnalyzer.detectRootType(root);

        // 2. Application séquentielle des transformations selon le type de racine
        if (type == RootType.LAFIF) {
            word = applyTransformations(word, "mithal_" + schemeName);
            word = applyTransformations(word, "lafif_" + schemeName);
            if (!transformations.containsKey("lafif_" + schemeName)) {
                word = applyTransformations(word, "naqis_" + schemeName);
            }
        } else if (type == RootType.AJWAF) {
            word = applyTransformations(word, "ajwaf_" + schemeName);
        } else if (type == RootType.NAQIS) {
            word = applyTransformations(word, "naqis_" + schemeName);
        } else if (type == RootType.MITHAL) {
            word = applyTransformations(word, "mithal_" + schemeName);
        } else {
            word = applyTransformations(word, type.name().toLowerCase() + "_" + schemeName);
        }

        // 3. Gestion des exceptions spécifiques
        word = applyTransformations(word, "exception_" + root + "_" + schemeName);

        // 4. Post-traitement phonétique (Tanwin sur Ism Fa'il faible)
        if ("فاعل".equals(schemeName) && (type == RootType.NAQIS || type == RootType.LAFIF || type == RootType.AJWAF)) {
            if (word.endsWith("ي")) {
                word = word.substring(0, word.length() - 1) + "ٍ";
            }
        }
        return word;
    }

    /**
     * Exécute les opérations de remplacement (standard ou final) définies dans les règles.
     */
    private String applyTransformations(String word, String key) {
        List<Map<String, String>> ops = transformations.get(key);
        if (ops == null) return word;

        for (Map<String, String> op : ops) {
            String type = op.get("type");
            String to = op.get("to");
            if ("replace_final".equals(type)) {
                if (word.length() > 0) {
                    word = word.substring(0, word.length() - 1) + to;
                }
            } else {
                String from = op.get("from");
                word = word.replace(from, to);
            }
        }
        return word;
    }

    // ==========================================
    //      GESTION DES GROUPES DE TRANSFORMATIONS
    // ==========================================

    /**
     * Charge et parse le fichier transformations.txt pour alimenter le cache mémoire.
     */
    private void loadAndParseTransformations() {
        transformationGroups.clear();
        transformations.clear();
        InputStream is = getClass().getClassLoader().getResourceAsStream("transformations.txt");
        if (is == null) return;

        try (BufferedReader br = new BufferedReader(new InputStreamReader(is, StandardCharsets.UTF_8))) {
            String line;
            TransformationGroup current = null;
            while ((line = br.readLine()) != null) {
                line = line.trim();
                if (line.isEmpty()) continue;
                if (line.startsWith("#")) {
                    if (current != null) {
                        String existing = current.getComment();
                        current.setComment(existing == null ? line.substring(1).trim() : existing + "\n" + line.substring(1).trim());
                    }
                    continue;
                }
                if (line.contains(":")) {
                    String[] parts = line.split(":", 2);
                    current = new TransformationGroup();
                    current.setKey(parts[0].trim());
                    transformationGroups.add(current);
                    if (parts.length > 1) parseRules(current, parts[1].trim());
                }
            }
            rebuildTransformationsMapFromGroups();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /**
     * Analyse une chaîne de règles séparées par des points-virgules.
     */
    private void parseRules(TransformationGroup group, String rulesText) {
        if (rulesText.isEmpty()) return;
        String[] ops = rulesText.split(";");
        int order = 0;
        for (String op : ops) {
            op = op.trim();
            TransformationRule rule = new TransformationRule();
            rule.setOrder(order++);
            if (op.startsWith("replace_final=")) {
                rule.setType("replace_final");
                rule.setTo(op.substring("replace_final=".length()).trim());
            } else if (op.startsWith("replace=")) {
                rule.setType("replace");
                String[] fromTo = op.substring("replace=".length()).split(">", 2);
                if (fromTo.length == 2) {
                    rule.setFrom(fromTo[0].trim());
                    rule.setTo(fromTo[1].trim());
                }
            }
            group.getRules().add(rule);
        }
    }

    /**
     * Convertit la liste des groupes en Map optimisée pour l'application des règles.
     */
    private void rebuildTransformationsMapFromGroups() {
        for (TransformationGroup group : transformationGroups) {
            List<Map<String, String>> opsList = new ArrayList<>();
            for (TransformationRule rule : group.getRules()) {
                Map<String, String> op = new HashMap<>();
                op.put("type", rule.getType());
                op.put("to", rule.getTo());
                if ("replace".equals(rule.getType())) op.put("from", rule.getFrom());
                opsList.add(op);
            }
            transformations.put(group.getKey(), opsList);
        }
    }

    /**
     * Enregistre les modifications des transformations dans le fichier physique.
     */
    private void saveTransformationsToFile() {
        String path = "src/main/resources/transformations.txt";
        try (BufferedWriter writer = new BufferedWriter(
                new OutputStreamWriter(new FileOutputStream(path), StandardCharsets.UTF_8))) {
            for (TransformationGroup group : transformationGroups) {
                if (group.getComment() != null) {
                    for (String line : group.getComment().split("\n")) {
                        writer.write("# " + line.trim());
                        writer.newLine();
                    }
                }
                writer.write(group.getKey() + ":");
                boolean first = true;
                for (TransformationRule rule : group.getRules()) {
                    if (!first) writer.write(";");
                    first = false;
                    if ("replace_final".equals(rule.getType())) writer.write("replace_final=" + rule.getTo());
                    else writer.write("replace=" + rule.getFrom() + ">" + rule.getTo());
                }
                writer.newLine();
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }




    // ==========================================
    //        SERVICES D'ADMINISTRATION
    // ==========================================

    @Override
    public List<TransformationGroup> getAllTransformationGroups() {
        return new ArrayList<>(transformationGroups);
    }

    @Override
    public TransformationGroup getTransformationGroup(String key) {
        return transformationGroups.stream()
                .filter(g -> g.getKey().equalsIgnoreCase(key))
                .findFirst().orElse(null);
    }

    @Override
    public TransformationGroup saveTransformationGroup(TransformationGroup group) {
        transformationGroups.removeIf(g -> g.getKey().equalsIgnoreCase(group.getKey()));
        transformationGroups.add(group);
        saveTransformationsToFile();
        loadAndParseTransformations();
        return group;
    }

    @Override
    public boolean deleteTransformationGroup(String key) {
        boolean removed = transformationGroups.removeIf(g -> g.getKey().equalsIgnoreCase(key));
        if (removed) {
            saveTransformationsToFile();
            loadAndParseTransformations();
        }
        return removed;
    }

    // ==========================================
    //       LISTAGE ET RÉCUPÉRATION DE DONNÉES
    // ==========================================

    @Override
    public List<String> getRootsList() {
        List<String> roots = new ArrayList<>();
        collectRoots(rootAVL.getRootNode(), roots);
        return roots;
    }

    private void collectRoots(AVLTree.Node node, List<String> list) {
        if (node == null) return;
        collectRoots(node.left, list);
        list.add(node.root);
        collectRoots(node.right, list);
    }

    @Override
    public List<String> getSchemesList() {
        return patternTable.getAll().stream()
                .map(entry -> entry[0])
                .sorted().collect(Collectors.toList());
    }

    @Override
    public Set<String> getDerivatives(String root) {
        AVLTree.Node node = rootAVL.find(root);
        if (node == null) return Collections.emptySet();
        return node.validatedDerivatives.stream()
                .map(d -> d.word + " (f=" + d.frequency + ")")
                .collect(Collectors.toSet());
    }

    private void updateDerivativeList(String root, String word) {
        AVLTree.Node node = rootAVL.find(root);
        if (node != null) {
            for (AVLTree.Derivative d : node.validatedDerivatives) {
                if (d.word.equals(word)) {
                    d.frequency++;
                    return;
                }
            }
            node.validatedDerivatives.add(new AVLTree.Derivative(word));
        }
    }

    // ===================== STATISTIQUES (AJOUT MAJEUR) =====================
    @Override
    public StatisticsResponse computeStatistics() {
        StatisticsResponse stats = new StatisticsResponse();
        Map<String, RootStat> roots = new LinkedHashMap<>();

        List<AVLTree.Node> nodes = rootAVL.getAllNodes();
        int totalDerivatives = 0;

        for (AVLTree.Node node : nodes) {
            // transforme validatedDerivatives en simple liste de String
            List<String> derivatives = node.validatedDerivatives.stream()
                    .map(d -> d.word)  // récupère juste le mot
                    .toList();

            totalDerivatives += derivatives.size();
            roots.put(node.root, new RootStat(node.root, derivatives)); // ✅ Utilise node.root
        }

        stats.setRoots(roots);
        stats.setTotalRoots(roots.size());
        stats.setTotalDerivatives(totalDerivatives);
        stats.setTotalPatterns(patternTable.getAll().size());
        // ou patternTable.size() selon ton implémentation
        stats.setDensity(
                roots.isEmpty() ? 0 :
                        (double) totalDerivatives / roots.size()
        );

        return stats;
    }


    // ==========================================
    //       VISUALISATION ET DÉBOGAGE
    // ==========================================

    @Override
    public Object getTreeStructure() {
        return rootAVL.getRootNode();
    }

    @Override
    public List<List<Map<String, String>>> getHashStructure() {
        List<List<Map<String, String>>> structure = new ArrayList<>();
        ManualHashTable.Entry[] table = patternTable.getInternalTable();
        for (ManualHashTable.Entry entry : table) {
            List<Map<String, String>> bucket = new ArrayList<>();
            ManualHashTable.Entry current = entry;
            while (current != null) {
                Map<String, String> item = new HashMap<>();
                item.put("key", current.key);
                item.put("value", current.value);
                bucket.add(item);
                current = current.next;
            }
            structure.add(bucket);
        }
        return structure;
    }









    @Override
    public void updateScheme(String scheme, String newRule) {
        // Vérifier existence
        if (patternTable.get(scheme) == null) {
            throw new IllegalArgumentException("Schème non trouvé : " + scheme);
        }

        // Mise à jour en mémoire
        patternTable.put(scheme, newRule);

        // Persistance complète (on réécrit tout le fichier)
        rewriteAllSchemes();
    }

    @Override
    public void deleteScheme(String scheme) {
        // Vérifier existence
        if (patternTable.get(scheme) == null) {
            throw new IllegalArgumentException("Schème non trouvé : " + scheme);
        }

        // Suppression en mémoire
        patternTable.remove(scheme);

        // Persistance complète
        rewriteAllSchemes();
    }

    /**
     * Réécrit TOUT le fichier schemes.txt à partir de l'état actuel de la table.
     * Nécessaire pour update et delete (append ne suffit plus).
     */
    private void rewriteAllSchemes() {
        String filePath = "src/main/resources/schemes.txt";
        try (BufferedWriter writer = new BufferedWriter(
                new OutputStreamWriter(new FileOutputStream(filePath, false), StandardCharsets.UTF_8))) {

            // On écrit d'abord les commentaires si tu en avais (optionnel)
            writer.write("# schemes.txt - généré le " + new java.util.Date());
            writer.newLine();
            writer.newLine();

            // Écriture de toutes les entrées
            for (String[] entry : patternTable.getAll()) {
                writer.write(entry[0] + "=" + entry[1]);
                writer.newLine();
            }

            System.out.println("Fichier schemes.txt réécrit avec succès (" + patternTable.getAll().size() + " schèmes).");

        } catch (IOException e) {
            System.err.println("Erreur réécriture schemes.txt : " + e.getMessage());
            throw new RuntimeException("Échec persistance des schèmes", e);
        }
    }






    @Override
    public Map<String, String> getSchemesWithRules() {
        Map<String, String> result = new LinkedHashMap<>(); // pour garder un ordre prévisible
        for (String[] entry : patternTable.getAll()) {
            result.put(entry[0], entry[1]);
        }
        return result;
    }


}