/* eslint-disable no-undef */
/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import fs from 'fs';
import {
  resize,
  checkResizedFileDimension,
  fetchImage,
  fetchImageCache,
} from '../../utilities/imagehelpers';
import { inputFolder, outputFolder } from '../../utilities/config';

afterAll(() => {
  // After the tests the resized image is deleted
  fs.unlink(`${outputFolder}/gunTest-200-200.jpg`, (err) => {
    if (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    }
  });
});

describe('image helpers function results', () => {
  const fileName = 'gunTest';
  const width = 200;
  const height = 200;

  describe('fetch Image function before resizing', () => {
    it('should return false', async () => {
      const fileNameExt = await fetchImageCache(fileName, outputFolder);
      expect(fileNameExt).toBeFalse();
    });
  });

  describe('resize function', () => {
    it(`should return gunTest-${width}-${height}.jpg`, async () => {
      const fileNameExt = await resize(fileName, width, height);
      expect(fileNameExt).toBe(`gunTest-${width}-${height}.jpg`);
    });
  });

  describe('fetch Image function', () => {
    it('should return gunTest.jpg from full folder', async () => {
      const fileNameExt = await fetchImage(fileName, inputFolder);
      expect(fileNameExt).toEqual('gunTest.jpg');
    });

    it(`should return gunTest-${width}-${height}.jpg from thumb folder`, async () => {
      const fileNameExt = await fetchImage(fileName, outputFolder);
      expect(fileNameExt).toEqual(`gunTest-${width}-${height}.jpg`);
    });
  });

  describe('fetch Image function after resizing', () => {
    it(`should return gunTest-${width}-${height}.jpg from thumb folder`, async () => {
      const fileNameExt = await fetchImageCache(fileName, outputFolder);
      expect(fileNameExt).toEqual(`gunTest-${width}-${height}.jpg`);
    });
  });

  describe('check resized function', () => {
    it('should return true', async () => {
      const resized = await checkResizedFileDimension(fileName, width, height);
      expect(resized).toBeTrue();
    });
  });
});
