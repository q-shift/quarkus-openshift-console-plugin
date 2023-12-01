package io.quarkus.service.proxy;

import io.fabric8.kubernetes.client.KubernetesClient;
import io.vertx.core.Vertx;
import io.vertx.ext.web.client.WebClient;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.core.Response;
 

@Path("/service/proxy")
public class ServiceProxyResource {

  @Inject
  KubernetesClient kubernetesClient;

  @Inject
  Vertx vertx;

  @GET
  @Path("/{namespace}/{name}")
  public Response proxy(String namespace, String name, String path) {
       WebClient client = WebClient.create(vertx);
       return client
            .get(80, name + "." + namespace, "/q/dev")
            .send()
            .toCompletionStage()
            .thenApply(response -> Response.status(response.statusCode()).entity(response.bodyAsString()).build())
            .toCompletableFuture()
            .join();
  }
}
