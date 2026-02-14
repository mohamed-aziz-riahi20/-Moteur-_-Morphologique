package com.morphology.arabic_morphology_app.Controller;

import com.morphology.arabic_morphology_app.IService.MorphologyService;
import com.morphology.arabic_morphology_app.model.MorphologyRequest;
import com.morphology.arabic_morphology_app.model.SchemeRequest;
import com.morphology.arabic_morphology_app.model.StatisticsResponse;
import com.morphology.arabic_morphology_app.model.ValidationResult;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * Contrôleur principal pour les opérations de morphologie arabe.
 * Fournit des services de génération, de validation et d'exploration des structures de données.
 */
@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/morphology")
public class MorphologyController {

    private final MorphologyService service;

    /**
     * Constructeur avec injection du service de morphologie.
     *
     * @param service Le service contenant la logique métier.
     */
    public MorphologyController(MorphologyService service) {
        this.service = service;
    }

    // ==========================================
    //       GÉNÉRATION ET GESTION DES SCHÈMES
    // ==========================================

    /**
     * Ajoute un nouveau schème morphologique au système.
     *
     * @param request Contient le nom du schème et la règle associée (ex: فاعل, {1}ا{2}{3}).
     * @return Message de confirmation.
     */
    @PostMapping("/scheme")
    public String addScheme(@RequestBody SchemeRequest request) {
        service.addScheme(request.getScheme(), request.getRule());
        return "Schème ajouté avec succès : " + request.getScheme();
    }

    /**
     * Génère un mot unique à partir d'une racine et d'un schème spécifique.
     *
     * @param request Contient la racine (root) et le nom du schème (scheme).
     * @return Le mot arabe généré après application des transformations.
     */
    @PostMapping("/generate")
    public String generate(@RequestBody MorphologyRequest request) {
        return service.generate(request.getRoot(), request.getScheme());
    }

    /**
     * Génère tous les mots dérivés possibles pour une racine donnée à partir de tous les schèmes disponibles.
     *
     * @param request Contient la racine cible.
     * @return Liste de tous les dérivés générés.
     */
    @PostMapping("/generate-all")
    public List<String> generateAll(@RequestBody MorphologyRequest request) {
        return service.generateAll(request.getRoot());
    }

    // ==========================================
    //        VALIDATION ET HISTORIQUE
    // ==========================================

    /**
     * Valide si un mot donné est structurellement lié à une racine spécifique.
     *
     * @param request Contient la racine (root) et le mot (word) à vérifier.
     * @return ValidationResult indiquant si le mot est valide et quel schème a été utilisé.
     */
    @PostMapping("/validate")
    public ValidationResult validate(@RequestBody MorphologyRequest request) {
        return service.validate(request.getRoot(), request.getWord());
    }

    /**
     * Récupère l'ensemble des dérivés déjà validés et stockés pour une racine.
     *
     * @param request Contient la racine cible.
     * @return Un ensemble (Set) de chaînes de caractères représentant les dérivés.
     */
    @PostMapping("/derivatives")
    public Set<String> getDerivatives(@RequestBody MorphologyRequest request) {
        return service.getDerivatives(request.getRoot());
    }

    // ==========================================
    //       LISTAGE DES DONNÉES (FRONTEND)
    // ==========================================

    /**
     * Récupère la liste exhaustive des racines chargées dans le système (AVL Tree).
     *
     * @return Liste de chaînes de caractères (racines).
     */
    @GetMapping("/roots")
    public List<String> getRoots() {
        return service.getRootsList();
    }

    /**
     * Récupère la liste exhaustive des noms de schèmes disponibles (Hash Table).
     *
     * @return Liste de chaînes de caractères (noms des schèmes).
     */
    @GetMapping("/schemes")
    public List<String> getSchemes() {
        return service.getSchemesList();
    }

    // ==========================================
    //       DEBUG ET STRUCTURES INTERNES
    // ==========================================

    /**
     * Expose la structure interne de l'arbre AVL pour le débogage ou la visualisation.
     *
     * @return Objet représentant le nœud racine et sa descendance.
     */
    @GetMapping("/debug/tree")
    public Object getTree() {
        return service.getTreeStructure();
    }

    /**
     * Expose la structure interne de la table de hachage manuelle.
     *
     * @return Représentation des compartiments (buckets) et des collisions.
     */
    @GetMapping("/debug/hash")
    public List<List<Map<String, String>>> getHash() {
        return service.getHashStructure();
    }


    @GetMapping("/statistics")
    public StatisticsResponse getStatistics() {
        return service.computeStatistics();
    }
}