import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { writeFile } from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const UPLOAD_DIR = path.join(__dirname, '../../public/uploads');
const DOCUMENTS_DIR = path.join(UPLOAD_DIR, 'documents');
const PHOTOS_DIR = path.join(UPLOAD_DIR, 'photos');

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

export class FileService {
  static async saveProfilePicture(file: File): Promise<string> {
    return this.saveFile(file, PHOTOS_DIR);
  }

  static async saveDocument(file: File, type: 'CV' | 'ID'): Promise<string> {
    return this.saveFile(file, DOCUMENTS_DIR, type.toLowerCase());
  }

  private static async saveFile(file: File, directory: string, prefix = ''): Promise<string> {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const timestamp = Date.now();
    const extension = file.name.split('.').pop();
    const filename = `${prefix ? prefix + '_' : ''}${timestamp}.${extension}`;
    
    await fs.promises.mkdir(directory, { recursive: true });
    
    const filepath = path.join(directory, filename);
    await writeFile(filepath, buffer);
    
    const relativePath = filepath.split('public')[1].replace(/\\/g, '/');
    return relativePath;
  }
}