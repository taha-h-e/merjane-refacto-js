import { eq } from "drizzle-orm";
import fastifyPlugin from "fastify-plugin";
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from "fastify-type-provider-zod";
import { z } from "zod";

import { orders } from "@/db/schema.js";
import { ProductProcessorService } from "@/services/product-processor.service.js";

export const myController = fastifyPlugin(async (server) => {
  // Configure schema validation
  server.setValidatorCompiler(validatorCompiler);
  server.setSerializerCompiler(serializerCompiler);

  server.withTypeProvider<ZodTypeProvider>().post(
    "/orders/:orderId/processOrder",
    {
      schema: {
        params: z.object({
          orderId: z.coerce.number(),
        }),
      },
    },
    async (request, reply) => {
      const db = server.diContainer.resolve("db");
      const productService = server.diContainer.resolve("ps");
      const processor = new ProductProcessorService(productService);

      const order = await db.query.orders.findFirst({
        where: eq(orders.id, request.params.orderId),
        with: {
          products: {
            columns: {},
            with: {
              product: true,
            },
          },
        },
      });

      if (!order) {
        return reply.status(404).send({ error: "Order not found" });
      }

      const { products: orderProducts } = order;

      for (const { product } of orderProducts) {
        await processor.process(product);
      }

      await reply.send({ orderId: order.id });
    }
  );
});
