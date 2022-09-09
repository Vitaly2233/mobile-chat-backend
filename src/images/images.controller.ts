import { Controller, Get, Param, ParseIntPipe, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { ImagesService } from './images.service';

@Controller('images')
@ApiTags('Images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Get('download/:imageId')
  async downloadImage(
    @Param('imageId', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    const { contentType, stream } = await this.imagesService.downloadImage(id);
    res.set({ 'Content-Type': contentType });
    stream.pipe(res);
  }
}
