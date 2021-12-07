package com.uppa;

import javax.naming.*;
import javax.naming.directory.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Properties;

public class JNDI_DNS {

    public List<ArrayList<String>> resultat = new ArrayList<>();

    public  JNDI_DNS(String domainName, ArrayList<String> records) {

        try {
            Properties _p = new Properties();
            _p.setProperty(Context.INITIAL_CONTEXT_FACTORY, "com.sun.jndi.dns.DnsContextFactory");

            DirContext dc = new InitialDirContext(_p);

            records.forEach(e -> {
                try {
                    NamingEnumeration ne = dc.getAttributes(domainName, new String[]{e}).getAll();
                    ArrayList<String> attrList = new ArrayList<>();
                    attrList.add(e);

                    while (ne.hasMore()) {
                        BasicAttribute ba = (BasicAttribute) ne.next();
                        NamingEnumeration nee = ba.getAll();
                        while (nee.hasMore()) {
                            attrList.add((String) nee.next());
                        }
                    }

                    resultat.add(attrList);
                } catch (NamingException namingException) {
                    namingException.printStackTrace();
                }
            });
            System.out.println("Sent: " + Main.createJson(resultat));
            System.out.println("Research done.");

        } catch (NamingException ne) {
            System.err.println(ne.getMessage() + ": " + ne.getExplanation());
        }
    }
    public String getRes() {
        return Main.createJson(resultat);
    }
}
