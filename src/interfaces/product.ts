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
  id: string;
  name: string;
  type: string;
  reference: string;
  description: string | null;
  price: number;
  category: string;
  createdAt: Date;
  updatedAt: Date;
  tenantId: string;
  userId: string;
  images: string[];
}
