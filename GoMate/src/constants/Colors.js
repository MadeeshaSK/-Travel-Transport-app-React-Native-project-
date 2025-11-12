export const Colors = {
    light: {
      primary: '#007AFF',
      background: '#F2F2F7',
      card: '#FFFFFF',
      text: '#000000',
      textSecondary: '#8E8E93',
      border: '#E5E5EA',
      danger: '#FF3B30',
      success: '#34C759',
      warning: '#FF9500',
      tint: '#007AFF',
      tabIconDefault: '#8E8E93',
      tabIconSelected: '#007AFF',
    },
    dark: {
      primary: '#0A84FF',
      background: '#000000',
      card: '#1C1C1E',
      text: '#FFFFFF',
      textSecondary: '#8E8E93',
      border: '#38383A',
      danger: '#FF453A',
      success: '#32D74B',
      warning: '#FF9F0A',
      tint: '#0A84FF',
      tabIconDefault: '#8E8E93',
      tabIconSelected: '#0A84FF',
    },
  };
  
  export const getColors = (isDark) => (isDark ? Colors.dark : Colors.light);