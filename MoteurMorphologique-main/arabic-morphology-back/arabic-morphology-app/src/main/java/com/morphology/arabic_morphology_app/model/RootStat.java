package com.morphology.arabic_morphology_app.model;

import java.util.List;

public class RootStat {
    private String text;
    private List<String> derivatives;

    public RootStat(String text, List<String> derivatives) {
        this.text = text;
        this.derivatives = derivatives;
    }

    public String getText() { return text; }
    public List<String> getDerivatives() { return derivatives; }
}
