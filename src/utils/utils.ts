export const isEmpty = (value: any) =>
  value === undefined ||
  value === null ||
  value === '' ||
  (Array.isArray(value) && value.length === 0);

const SIZE_MAPPINGS = {
  sm: '256x144',
  md: '640x360',
  lg: '1024x576',
};
export const getImageSource = (
  imageSource: string,
  size: 'sm' | 'md' | 'lg' | 'og' = 'og',
) => {
  let path = 'http://daebit.com/images/';
  if (size !== 'og') {
    const imageSourceParts = imageSource.split('.');
    if (imageSourceParts.length > 0) {
      path += `sizes/${imageSourceParts[0]}-${SIZE_MAPPINGS[size]}.${imageSourceParts[1]}`;
    } else {
      throw new Error(`Invalid image source ${imageSource}`);
    }
  } else {
    return (path += imageSource);
  }
  return path;
};
