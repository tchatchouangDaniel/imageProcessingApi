/* eslint-disable no-console */
/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import express, { Request, Response } from 'express';
import {
  resize,
  checkResizedFileDimension,
} from '../../utilities/imagehelpers';
import { outputFolder } from '../../utilities/config';

const images = express.Router();

images.get('/', async (req: Request, res: Response) => {
  const { filename, width, height } = req.query;
  try {
    if (Object.keys(req.query).length === 0) {
      res
        .status(200)
        .send(
          'Enter filename, width and height as query parameters to resize your image',
        );
      return;
    }
    // Here we check if the query parameter are valid
    const numWidth = Number(width);
    const numHeight = Number(height);
    const strfilename = String(filename);

    const fileNameExt = await resize(strfilename, numWidth, numHeight);

    const resized = await checkResizedFileDimension(
      `${filename}-${width}-${height}`,
      numWidth,
      numHeight,
    );

    if (resized) {
      res.status(201).sendFile(`${outputFolder}/${fileNameExt}`);
    }
  } catch (error) {
    res.status(400).json({
      message: 'bad request',
    });
  }
});

export default images;
