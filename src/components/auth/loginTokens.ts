export const LOGIN_COLORS = {
  gradientStart: '#1E88E5',
  gradientEnd: '#0D47A1',
  white: '#FFFFFF',
  whiteSubtle: '#FFFFFF99',
  label: '#334155',
  placeholder: 'rgba(10,10,10,0.50)',
  rememberMe: '#64748B',
  forgotPassword: '#1E88E5',
  card: '#FFFFFF',
  inputBorder: '#E2E8F0',
  inputBg: '#F8FAFC',
} as const;

export const BG_GRADIENT_STOPS: string[] = [
  '#1E88E5', '#1C83E0', '#1B7FDB', '#197AD6', '#1875D1',
  '#1670CC', '#156CC7', '#1467C3', '#1362BE', '#115EB9',
  '#1059B4', '#0F55AF', '#0F50AB', '#0E4CA6', '#0D47A1',
];

export const BTN_GRADIENT_STOPS: string[] = [...BG_GRADIENT_STOPS];
