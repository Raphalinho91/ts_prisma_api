export interface MultipartFile {
  filename: string;
  file: NodeJS.ReadableStream;
}

export interface MultipartFields {
  name: string;
  type: string;
  reference: string;
  description: string | null;
  price: number;
  category: string;
  tenantId: string;
}

export interface CreateProductReply {
  name: string;
  type: string;
  reference: string;
  description: string | null;
  price: number;
  category: string;
  images: string[];
  tenantId: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}
