import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export class FileService {
  private uploadDir: string;

  constructor() {
    this.uploadDir = path.join(__dirname, "..", "..", "..", "..", "uploads");
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async saveFile(
    fileStream: NodeJS.ReadableStream,
    originalFilename: string
  ): Promise<string> {
    const fileName = `${uuidv4()}-${originalFilename}`;
    const filePath = path.join(this.uploadDir, fileName);

    await new Promise<void>((resolve, reject) => {
      fileStream
        .pipe(fs.createWriteStream(filePath))
        .on("finish", resolve)
        .on("error", reject);
    });

    return filePath;
  }
}
