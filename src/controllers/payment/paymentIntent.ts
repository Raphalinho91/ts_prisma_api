import { FastifyReply, FastifyRequest } from "fastify";
import { handleError } from "../../utils/error/error";
import { BASE_URL } from "../../secrets";
import { CreateCheckoutSessionRequest } from "../../interfaces/payment";
import { TenantService } from "../../services/tenant";
import { ProductService } from "../../services/product";
import { UserService } from "../../services/auth";
import { CommandeService } from "../../services/commande";
import logger from "../../logger";

const stripe = require("stripe")(
  "sk_test_51Pty82KRoLIxD8a3YFGdyXjzJHDvOefPjWjKrEhozJHtIiU7UMBGdiTAg8gQAYn2XkMSpIxboZX13uqseLWBbSbS00BQ0DNuEp"
);

export const paymentIntent = async (
  request: FastifyRequest<{ Body: CreateCheckoutSessionRequest }>,
  reply: FastifyReply
) => {
  try {
    const { tenantId, productId, userId } = request.body;

    logger.fatal({ tenantId, productId, userId });
    if (!tenantId || !productId || !userId) {
      throw new Error("Missing required parameters");
    }

    // const commandeService = new CommandeService(request.server.prisma);
    // const userService = new UserService(request.server.prisma);
    const tenantService = new TenantService(request.server.prisma);
    const productService = new ProductService(request.server.prisma);

    const tenantIdExist = await tenantService.findTenantById(tenantId);
    const productIdExist = await productService.getProductById(productId);
    const imageExist = await productService.getImagesByProductId(productId);
    // const userExist = await userService.findUserById(user.id);

    logger.fatal({ tenantIdExist, productIdExist, imageExist });

    if (!tenantIdExist || !productIdExist || !imageExist) {
      throw new Error("Tenant, product and image not found");
    }

    if (
      productIdExist.id !== tenantIdExist.productId ||
      tenantIdExist.id !== productIdExist.tenantId
    ) {
      throw new Error("Product and tenant do not match");
    }

    logger.fatal("Product and tenant match");

    // const userId = userExist ? userExist.id : user.id;
    // const userEmail = userExist ? userExist.email : user.email;
    // const userName = userExist ? userExist.name : user.name;

    // if (!userExist) {
    //   await userService.createUser(
    //     user.email,
    //     "passwordTemporaryForUser123*",
    //     user.name
    //   );
    // }

    // await commandeService.createCommande(
    //   userId,
    //   productId,
    //   tenantId,
    //   userEmail,
    //   userName,
    //   user.address,
    //   user.country,
    //   user.city,
    //   user.zipCode,
    //   user.status,
    //   user.totalPrice,
    //   user.quantity
    // );

    const imageUrls = imageExist.map((image) => image.url);

    logger.fatal({ imageUrls });
    const priceString = productIdExist.price.toString();
    logger.fatal({ priceString });
    const priceParce = parseInt(priceString.replace(".", ""), 10);
    logger.fatal({ priceParce });
    const product = await stripe.products.create({
      name: productIdExist.name,
      images: [
        "https://assets-fr.imgfoot.com/media/cache/800x800/maillot-equipe-de-france-exterieur-authentique-2024.jpg",
      ],
      description: productIdExist?.description,
      url: tenantIdExist.url,
    });

    logger.fatal({ product });

    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "paypal"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product: product.id,
            unit_amount: priceParce,
          },
          quantity: 1,
        },
      ],
      success_url: `${BASE_URL}/payment-success?product_id=${productId}`,
      cancel_url: `${BASE_URL}/payment-cancelled?product_id=${productId}`,
      metadata: {
        userId: userId,
        productId: productId,
        tenantId: tenantId,
      },
      mode: "payment",
      shipping_address_collection: {
        allowed_countries: ["FR"],
      },
    });

    reply.send({ url: stripeSession.url });
  } catch (error) {
    handleError(error, reply);
  }
};
