import {
  ConflictException,
  Injectable,
  NotFoundException,
  OnModuleInit,
  UnsupportedMediaTypeException,
} from '@nestjs/common';
import { createReadStream, existsSync } from 'fs';
import * as mime from 'mime-types';
import { mkdir, writeFile } from 'fs/promises';
import { CONFIG } from '../common/config';
import { EImageType } from './enum/image-type.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { Image } from './entity/image.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ImagesService implements OnModuleInit {
  constructor(
    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,
  ) {}

  async onModuleInit() {
    const res = existsSync(CONFIG.UPLOADS.BASE_DIR);
    if (!res) await mkdir(CONFIG.UPLOADS.BASE_DIR);
  }

  async createImage(
    entityId: number,
    type: EImageType,
    file: Express.Multer.File,
  ) {
    const contentType = this.ValidateImageMimetype(file.mimetype);

    const image = await this.findImageByType(entityId, type);
    if (image) throw new ConflictException('image for entity already exists');

    const created = await this.imageRepository.save({
      message: entityId,
      type: EImageType.Message,
      contentType,
    });
    const path = this.createImagePath(created.id);
    await writeFile(path, file.buffer);

    return created;
  }

  async findImageByType(entityId: number, type: EImageType) {
    let image;
    switch (type) {
      case EImageType.Message:
        image = await this.imageRepository.findOne({
          where: { message: entityId, type },
        });
        break;
    }

    return image;
  }

  async downloadImage(id: number) {
    const image = await this.imageRepository.findOne({ where: { id } });
    if (!image) throw new NotFoundException('image not found');

    const path = this.createImagePath(image.id);

    const found = existsSync(path);
    if (!found) throw new NotFoundException('image not found');

    const stream = createReadStream(path);

    return { stream, contentType: image.contentType };
  }

  ValidateImageMimetype(mimetype: string) {
    const contentType = mime.contentType(mimetype);
    if (!contentType)
      throw new UnsupportedMediaTypeException('unknown content type');

    const supportedMimeTypes = [
      mime.lookup('WEBP'),
      mime.lookup('SVG'),
      mime.lookup('PNG'),
      mime.lookup('JPEG'),
      mime.lookup('GIF'),
      mime.lookup('AVIF'),
      mime.lookup('APNG'),
    ];
    if (!supportedMimeTypes.some((supported) => supported === mimetype))
      throw new UnsupportedMediaTypeException();

    return contentType;
  }

  createImagePath(imageId: string | number) {
    return `${CONFIG.UPLOADS.BASE_DIR}/${imageId}`;
  }

  createImageUrl(imageId: string | number) {
    return `${CONFIG.SERVER.BASE_URL}/images/download/${imageId}`;
  }
}
