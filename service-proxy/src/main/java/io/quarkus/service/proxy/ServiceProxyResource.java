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
  private static final String PATH = "/q/dev";

  @Inject
  KubernetesClient kubernetesClient;

  @Inject
  Vertx vertx;

  @GET
  @Path("/{namespace}/{name}/")
  @Produces(MediaType.TEXT_HTML)
  public Response proxy(String namespace, String name, String path) {
       WebClient client = WebClient.create(vertx);
       log.info("Proxying: http://" + name + "." + namespace +  PATH);
       return client
            .get(80, name + "." + namespace, PATH)
            .send()
            .toCompletionStage()
            .thenApply(response -> Response.status(response.statusCode())
            .entity(response.body())
            .build())
            .toCompletableFuture()
            .join();
  }
}
