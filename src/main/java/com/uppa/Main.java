package com.uppa;

import com.google.gson.Gson;
import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {

        org.glassfish.tyrus.server.Server server = new org.glassfish.tyrus.server.Server("localhost", 8080, "/server", null , Websockets.My_ServerEndpoint.class);

        try {
            server.start();

            // The Web page is launched from Java:
            java.awt.Desktop.getDesktop().browse(java.nio.file.FileSystems.getDefault().getPath("src" + java.io.File.separatorChar + "web" + java.io.File.separatorChar + "index.html").toUri());

            //Waiting for input.
            java.io.BufferedReader reader = new java.io.BufferedReader(new java.io.InputStreamReader(System.in));
            System.out.println("Please press any key to stop the server...");
            reader.readLine();

        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            server.stop();
        }
    }

    public static ArrayList<?> parseJson(String json){
        Gson gson = new Gson();
        return gson.fromJson(json, ArrayList.class);
    }

    public static String createJson(Object o){
        Gson gson = new Gson();
        return  gson.toJson(o);
    }
}
