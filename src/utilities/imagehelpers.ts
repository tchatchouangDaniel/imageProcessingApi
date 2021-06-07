/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
import { readdir } from 'fs/promises';
import { inputFolder, outputFolder } from './config';

const { promisify } = require('util');
const Jimp = require('jimp');
const sizeOf = promisify(require('image-size'));

/**
 * Return filename with the extension matching an image format.
 *
 * @param {string} filename The file name with no extension.
 * @param {string} src The source folder to look the filename in.
 * @returns {string} Filename with an extension.
 */
export const fetchImage = async (
  filename: string,
  src: string,
): Promise<string> => {
  const files = await readdir(src, { withFileTypes: true });
  const file = files.find(
    (el) => el.name.includes(filename) && el.name.match(/\.(jpe?g|png|gif)$/),
  );
  if (!file) throw new Error('No such file');
  return file.name;
};

/**
 * Return filename from cache with the extension matching an image format.
 *
 * @param {string} filename The file name with no extension.
 * @param {string} src The source folder to look the filename in.
 * @returns {string} Filename with an extension.
 */
export const fetchImageCache = async (
  filename: string,
  src: string,
): Promise<boolean | string> => {
  const files = await readdir(src, { withFileTypes: true });
  const file = files.find(
    (el) => el.name.includes(filename) && el.name.match(/\.(jpe?g|png|gif)$/),
  );
  if (!file) return false;
  return file.name;
};

/**
 * Return the name of the resized file if the operation succeed.
 * Throw an error if not.
 * if the file was already resized it return that image name
 *
 * @param {string} filename The file name with no extension.
 * @param {number} width The width we want the final image to have.
 * @param {number} height The height we want the final image to have.
 * @param {number} quality The quality we want the final file to have default at 100.
 * @returns {string} The name of the final file.
 */
export const resize = async (
  filename: string,
  width: number,
  height: number,
  quality = 100,
): Promise<string | void | boolean> => {
  const filenameThumb = await fetchImageCache(
    `${filename}-${width}-${height}`,
    outputFolder,
  );
  if (filenameThumb) {
    return filenameThumb;
  }
  const fileName = await fetchImage(filename, inputFolder);
  // Here we add resized to the name of resized file.
  let fileNameResize: string | string[] = fileName.split('.');
  fileNameResize = fileNameResize.map((el, idx) => {
    if (idx === fileNameResize.length - 2) {
      return `${el}-${width}-${height}.`;
    }
    return el;
  });
  fileNameResize = fileNameResize.join('');
  // ---//

  const image = await Jimp.read(`${inputFolder}/${fileName}`);
  await image.resize(width, height);
  await image.quality(quality);
  await image.writeAsync(`${outputFolder}/${fileNameResize}`);
  return fileNameResize;
};

/**
 * Return a boolean that indicate wether or not the operation was successful.
 *
 * @param {string} filename The file name with no extension.
 * @param {number} width The width we want the final image to have.
 * @param {number} height The height we want the final image to have.
 * @returns {boolean} true if the file meet the dimensions at the end; false if not.
 */
export const checkResizedFileDimension = async (
  filename: string,
  width: number,
  height: number,
): Promise<boolean> => {
  const fileName = await fetchImage(filename, outputFolder);
  try {
    const dimensions = await sizeOf(`${outputFolder}/${fileName}`);
    if (dimensions?.width === width && dimensions?.height === height) {
      return true;
    }
    throw new Error('Not expected dimensions');
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
  }
  return true;
};
