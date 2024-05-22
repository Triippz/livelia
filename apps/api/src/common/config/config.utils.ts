export const int = (val: string | undefined, num: number): number =>
  val ? (isNaN(parseInt(val)) ? num : parseInt(val)) : num;
export const bool = (val: string | undefined, bool: boolean): boolean =>
  val == null ? bool : val == 'true';

export const isDev = (): boolean => process.env.NODE_ENV === 'development';
export const isTest = (): boolean => process.env.NODE_ENV === 'test';

export const parseBool = (val: string | undefined): boolean =>
  val == null ? false : val === 'true';
