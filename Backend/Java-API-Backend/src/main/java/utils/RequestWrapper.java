package utils;

import org.apache.hc.client5.http.classic.methods.HttpPost;
import org.apache.hc.client5.http.impl.classic.CloseableHttpClient;
import org.apache.hc.client5.http.impl.classic.HttpClients;
import org.apache.hc.core5.http.HttpEntity;
import org.apache.hc.core5.http.io.entity.EntityUtils;
import org.apache.hc.core5.http.io.entity.StringEntity;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;

public class RequestWrapper {

    public static JSONObject getResponse(String content, String sessionId) {
        try (CloseableHttpClient client = HttpClients.createDefault()) {
            HttpPost httpPost = new HttpPost("https://nessa.webuntis.com/WebUntis/jsonrpc.do?school=BS-Bad+Hersfeld");
            StringEntity entity = new StringEntity(content);

            httpPost.setEntity(entity);
            httpPost.setHeader("Accept", "application/json");
            httpPost.setHeader("Content-type", "application/json");
            httpPost.setHeader("Cookie", "JSESSIONID=" + sessionId);

            String responseBody = client.execute(httpPost, response -> {
                int status = response.getCode();
                if (status >= 200 && status < 300) {
                    HttpEntity entity1 = response.getEntity();
                    return entity1 != null ? EntityUtils.toString(entity1) : null;
                } else {
                    throw new RuntimeException("Unexpected response status: " + status);
                }
            });

            JSONParser parser = new JSONParser();
            return (JSONObject) parser.parse(responseBody);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new JSONObject();
    }
}