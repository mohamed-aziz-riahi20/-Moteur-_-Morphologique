package com.morphology.arabic_morphology_app.Controller;

import com.morphology.arabic_morphology_app.IService.MorphologyService;
import com.morphology.arabic_morphology_app.model.TransformationGroup;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Contrôleur d'administration pour la gestion des transformations morphologiques.
 * Permet de manipuler les règles complexes (Idgham, Ibdal, etc.) via une interface dédiée.
 */
@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/morphology/admin")
public class AdminMorphologyController {

    private final MorphologyService service;

    /**
     * Injection de dépendance via constructeur.
     *
     * @param service Le service gérant la logique morphologique.
     */
    public AdminMorphologyController(MorphologyService service) {
        this.service = service;
    }

    // ==========================================
    //        GESTION DES TRANSFORMATIONS
    // ==========================================

    /**
     * Récupère la liste complète des groupes de transformations chargés.
     *
     * @return Liste d'objets TransformationGroup.
     */
    @GetMapping("/transformations")
    public List<TransformationGroup> getAll() {
        return service.getAllTransformationGroups();
    }

    /**
     * Récupère un groupe de transformation spécifique par sa clé unique.
     *
     * @param key La clé identifiant le groupe (ex: mithal_افتعل).
     * @return Le groupe trouvé encapsulé dans une ResponseEntity, ou une erreur 404.
     */
    @GetMapping("/transformations/{key}")
    public ResponseEntity<TransformationGroup> getOne(@PathVariable String key) {
        TransformationGroup g = service.getTransformationGroup(key);
        return g != null ? ResponseEntity.ok(g) : ResponseEntity.notFound().build();
    }

    /**
     * Enregistre ou met à jour un groupe de transformations.
     * Cette opération déclenche généralement une mise à jour physique du fichier .txt.
     *
     * @param group L'objet TransformationGroup contenant les règles et la clé.
     * @return Le groupe de transformation sauvegardé.
     */
    @PostMapping("/transformations")
    public TransformationGroup save(@RequestBody TransformationGroup group) {
        return service.saveTransformationGroup(group);
    }

    /**
     * Supprime un groupe de transformations par sa clé.
     *
     * @param key La clé identifiant le groupe à supprimer.
     * @return Un statut 200 (OK) si supprimé, ou 404 (Not Found) si la clé n'existe pas.
     */
    @DeleteMapping("/transformations/{key}")
    public ResponseEntity<Void> delete(@PathVariable String key) {
        return service.deleteTransformationGroup(key) ?
                ResponseEntity.ok().build() :
                ResponseEntity.notFound().build();
    }
}