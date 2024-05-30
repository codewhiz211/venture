import { imagesList } from '../config/spec-config/images';

const images = imagesList();

// When a an image picker or colour picker is changed, we receive the key, not the value
export function getValue(currentValue, fieldType) {
  if (fieldType === 'image-picker') {
    const definedImage = images.find((image) => image.id === currentValue);
    return definedImage ? definedImage.display : currentValue;
  }
  return currentValue;
}
