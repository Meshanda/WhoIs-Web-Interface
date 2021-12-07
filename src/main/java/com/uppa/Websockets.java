package com.uppa;

import javax.websocket.*;
import javax.websocket.server.ServerEndpoint;
import java.io.IOException;
import java.util.ArrayList;

@SuppressWarnings("ALL")
public class Websockets {

    @ServerEndpoint("/websocket")
    public static class My_ServerEndpoint {

        @OnClose
        public void onClose() {
            System.out.println("Client disconnected.");
        }

        @OnError
        public void onError(Throwable throwable) {
            System.err.println("Error: " + throwable.getMessage());
        }

        @OnMessage
        public void onMessage(Session session, String data) {
            System.out.println("\nReceived: " + data + "\n");
            ArrayList arrayList = Main.parseJson(data);
            arrayList.set(0, (String) arrayList.get(0));

            JNDI_DNS res = new JNDI_DNS((String) arrayList.get(0), (ArrayList) arrayList.get(1));

            RemoteEndpoint.Basic remote = session.getBasicRemote();
            try {
                remote.sendText(res.getRes());
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

        @OnOpen
        public void onOpen() throws java.io.IOException {
            System.out.println("Client connected.");
        }
    }
}
