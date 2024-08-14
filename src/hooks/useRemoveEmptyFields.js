export const useRemoveEmptyFields = (obj) => {
  return Object.fromEntries(
    Object.entries(obj).filter(([key, value]) => {
      return value !== '' && value !== null && value !== undefined && 
          !(Array.isArray(value) && value.length === 0) &&
          !(typeof value === 'object' && value !== null && Object.keys(value).length === 0);
    })
  );
}