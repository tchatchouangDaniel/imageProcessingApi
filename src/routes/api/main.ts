import express, { Request, Response } from 'express';

const mainRoute = express.Router();

mainRoute.get('/', (_req: Request, res: Response) => {
  res.json({
    message:
      'Enter your image name with width and height as params the image must be in /assets/full folder',
  });
});

export default mainRoute;
