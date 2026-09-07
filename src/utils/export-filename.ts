const padZero = (value: number): string => `${value}`.padStart(2, '0');

export const buildExportFilename = (suffix: string, extension: 'xlsx' | 'pdf'): string => {
  const date = new Date();
  const year = date.getFullYear();
  const day = padZero(date.getDate());
  const month = padZero(date.getMonth() + 1);

  return `financeiro-${suffix}-${year}${month}${day}.${extension}`;
};
