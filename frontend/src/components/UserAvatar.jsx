import React from 'react';

// Deterministic helper to get a beautiful and vibrant HSL color based on string hash
export const getAvatarColor = (str) => {
  const text = str || 'User';
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = text.charCodeAt(i) + ((hash << 5) - hash);
  }
  // Hue: 0-360
  const h = Math.abs(hash) % 360;
  // Saturation: 65% - 80% for vibrancy
  const s = 65 + (Math.abs(hash) % 15);
  // Lightness: 40% - 50% for good readability against white text
  const l = 40 + (Math.abs(hash) % 10);
  return `hsl(${h}, ${s}%, ${l}%)`;
};

export const isDefaultAvatar = (avatarUrl) => {
  if (!avatarUrl) return true;
  return (
    avatarUrl === 'https://res.cloudinary.com/demo/image/upload/v1/sample.jpg' ||
    avatarUrl.includes('placehold.co') ||
    avatarUrl.includes('placeholder')
  );
};

const UserAvatar = ({ user, sizeClass = 'w-9 h-9', textClass = 'text-sm font-semibold', className = '', customAvatarUrl, children }) => {
  const avatarUrl = customAvatarUrl !== undefined ? customAvatarUrl : user?.avatar;
  const showImage = !isDefaultAvatar(avatarUrl);

  const initial = (user?.email || user?.name || 'U').charAt(0).toUpperCase();
  const bgColor = getAvatarColor(user?.email || user?.name || 'U');

  if (showImage) {
    return (
      <div className={`relative ${sizeClass} rounded-full overflow-hidden border border-gray-200/80 flex-shrink-0 ${className}`}>
        <img src={avatarUrl} alt={user?.name || 'User'} className="w-full h-full object-cover" />
        {children}
      </div>
    );
  }

  return (
    <div
      className={`relative ${sizeClass} rounded-full flex items-center justify-center text-white font-heading font-bold select-none border border-gray-200/30 flex-shrink-0 ${className}`}
      style={{ backgroundColor: bgColor }}
    >
      <span className={textClass}>{initial}</span>
      {children}
    </div>
  );
};

export default UserAvatar;
