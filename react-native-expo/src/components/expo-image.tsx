import { Image, type ImageProps } from 'expo-image';

const ExpoImage = ({ style, className, placeholder, ...rest }: ImageProps) => {
  return (
    <Image
      style={style}
      className={className}
      placeholder={placeholder}
      placeholderContentFit="cover"
      {...rest}
    />
  );
};

export default ExpoImage;
