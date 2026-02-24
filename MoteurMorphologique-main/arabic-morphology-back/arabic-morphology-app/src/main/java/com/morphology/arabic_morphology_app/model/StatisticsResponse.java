package com.morphology.arabic_morphology_app.model;

import java.util.List;
import java.util.Map;

public class StatisticsResponse {

    private int totalRoots;
    private int totalPatterns;
    private int totalDerivatives;
    private double density;

    // clé = id ou texte de la racine
    private Map<String, RootStat> roots;

    // getters & setters
    public int getTotalRoots() { return totalRoots; }
    public void setTotalRoots(int totalRoots) { this.totalRoots = totalRoots; }

    public int getTotalPatterns() { return totalPatterns; }
    public void setTotalPatterns(int totalPatterns) { this.totalPatterns = totalPatterns; }

    public int getTotalDerivatives() { return totalDerivatives; }
    public void setTotalDerivatives(int totalDerivatives) { this.totalDerivatives = totalDerivatives; }

    public double getDensity() { return density; }
    public void setDensity(double density) { this.density = density; }

    public Map<String, RootStat> getRoots() { return roots; }
    public void setRoots(Map<String, RootStat> roots) { this.roots = roots; }
}
