package io.quarkus.service.proxy;

import org.jboss.logging.Logger;

import io.fabric8.kubernetes.client.KubernetesClient;
import io.vertx.core.Vertx;
import io.vertx.ext.web.client.WebClient;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.Produces;
 
@Path("/produi")
public class ServiceProxyResource {

  private Logger log = Logger.getLogger(ServiceProxyResource.class);
  private static final String PATH = "/q/dev-ui";

  @Inject
  KubernetesClient kubernetesClient;

  @Inject
  Vertx vertx;

  @GET
  @Path("/{namespace}/{name}/")
  @Produces(MediaType.TEXT_HTML)
  public Response proxy(String namespace, String name) {
    return proxy(namespace, name, PATH);
  }

  @GET
  @Path("/{namespace}/{name}/{path}")
  @Produces(MediaType.TEXT_HTML)
  public Response proxy(String namespace, String name, String path) {
       WebClient client = WebClient.create(vertx);
       StringBuilder pathBuilder = new StringBuilder();
       pathBuilder.append(PATH);
       if (path != null && !path.equals(PATH)) {
         pathBuilder.append("/");
         pathBuilder.append(path);
       }
       String fullPath = pathBuilder.toString();

       log.info("Proxying: http://" + name + "." + namespace + fullPath);
       return client
            .get(80, name + "." + namespace, fullPath)
            .send()
            .toCompletionStage()
            .thenApply(response -> Response.status(response.statusCode())
            .entity(response.body())
            .build())
            .toCompletableFuture()
            .join();
  }
}
