// src/images/lifeLog/emotionIcons.js

const importAll = (requireContext) => {
  const images = {};
  requireContext.keys().forEach((key) => {
    const fileName = key.replace('./', '').replace(/\..+$/, ''); // 확장자 제거
    images[fileName] = requireContext(key);
  });
  return images;
};

// .png, .jpg, .jpeg 모두 포함하고 싶다면 정규식 수정 가능
const emotionIcons = importAll(require.context('./', false, /\.(png|jpe?g)$/));

export default emotionIcons;
