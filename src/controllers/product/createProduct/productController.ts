import { FastifyRequest, FastifyReply } from "fastify";
import { ProductService } from "../../../services/product";
import { TenantService } from "../../../services/tenant";
import { UserService } from "../../../services/auth";
import { FileService } from "./fileService";
import { ValidationService } from "./validationService";
import { BadRequestsException } from "../../../utils/request/requestBad";
import { ErrorCode } from "../../../utils/request/requestError";
import { CreateProductReply } from "../../../interfaces/product";
import { ValidCode } from "../../../utils/reply/replySend";
import { handleError } from "../../../utils/error/error";

export class ProductController {
  private productService: ProductService;
  private tenantService: TenantService;
  private userService: UserService;
  private fileService: FileService;
  private validationService: ValidationService;

  constructor(
    productService: ProductService,
    tenantService: TenantService,
    userService: UserService,
    fileService: FileService,
    validationService: ValidationService
  ) {
    this.productService = productService;
    this.tenantService = tenantService;
    this.userService = userService;
    this.fileService = fileService;
    this.validationService = validationService;
  }

  async createProduct(request: FastifyRequest, reply: FastifyReply) {
    let filePath: string = "";

    try {
      const userId = request.user?.id;
      const { tenant } = request;

      if (!request.isMultipart()) {
        throw new BadRequestsException(
          "Not a multipart request!",
          ErrorCode.BODY_IS_REQUIRED
        );
      }

      const data = await request.file();
      if (!data) {
        throw new BadRequestsException(
          "No data found in request!",
          ErrorCode.DATA_NOT_FOUND_IN_THIS_REQUEST
        );
      }

      const fields = data.fields as Record<string, any>;
      const parsedFields = this.validationService.validateProductFields(
        fields,
        tenant.id
      );

      const tenantRequest = await this.tenantService.findTenantById(
        parsedFields.tenantId
      );
      if (!tenantRequest) {
        throw new BadRequestsException(
          "Tenant not found!",
          ErrorCode.TENANT_NOT_FOUND
        );
      }

      if (tenantRequest.userId !== userId) {
        throw new BadRequestsException(
          "User is not authorized for this tenant!",
          ErrorCode.UNAUTHORIZED
        );
      }

      filePath = await this.fileService.saveFile(data.file, data.filename);

      const imagePaths = [filePath];
      const product = await this.productService.createProduct(
        parsedFields.name,
        parsedFields.type,
        parsedFields.reference,
        parsedFields.description || null,
        parsedFields.price,
        parsedFields.category,
        imagePaths,
        userId,
        parsedFields.tenantId
      );

      const newProduct = await this.productService.getProductById(product.id);
      if (!newProduct) {
        throw new BadRequestsException(
          "Failed to retrieve product!",
          ErrorCode.PRODUCT_NOT_FOUND
        );
      }

      await this.userService.updateUserProduct(userId, newProduct.id);
      await this.tenantService.updateProductIdInTenant(
        tenant.id,
        newProduct.id
      );
      await this.tenantService.updateFirstConnectionInTenant(tenant.id, true);

      const newProductReply: CreateProductReply = {
        id: newProduct.id,
        name: newProduct.name,
        type: newProduct.type,
        reference: newProduct.reference,
        description: newProduct.description,
        price: newProduct.price,
        category: newProduct.category,
        createdAt: newProduct.createdAt,
        updatedAt: newProduct.updatedAt,
        tenantId: tenant.id,
        userId,
        images: imagePaths,
      };

      return reply.code(200).send({
        message: "Product successfully created",
        code: ValidCode.PRODUCT_CREATED,
        data: newProductReply,
      });
    } catch (error) {
      handleError(error, reply, filePath);
    }
  }
}
