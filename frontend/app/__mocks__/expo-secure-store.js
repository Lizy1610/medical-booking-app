export const setItemAsync = jest.fn().mockResolvedValue(undefined);
export const getItemAsync = jest.fn().mockResolvedValue('mocked_token');
export const deleteItemAsync = jest.fn().mockResolvedValue(undefined);

export const AFTER_FIRST_UNLOCK = 'AFTER_FIRST_UNLOCK';

export default {
  setItemAsync,
  getItemAsync,
  deleteItemAsync,
  AFTER_FIRST_UNLOCK,
};
