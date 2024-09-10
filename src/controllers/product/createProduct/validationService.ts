import { productSchema } from "../../../schemas/product";
import { BadRequestsException } from "../../../utils/request/requestBad";
import { ErrorCode } from "../../../utils/request/requestError";

export class ValidationService {
  validateProductFields(fields: Record<string, any>, tenantId: string) {
    const parsedFields = productSchema.parse({
      name: fields.name?.value,
      type: fields.type?.value,
      reference: fields.reference?.value,
      description: fields.description?.value,
      price: Number(fields.price?.value),
      category: fields.category?.value,
      tenantId: fields.tenantId?.value,
    });

    if (fields.tenantId.value !== tenantId) {
      throw new BadRequestsException(
        "Tenant ID mismatch!",
        ErrorCode.TENANT_ID_NOT_MATCH
      );
    }

    return parsedFields;
  }
}
