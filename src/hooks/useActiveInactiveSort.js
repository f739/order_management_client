import { useMemo } from 'react';

export const useActiveInactiveSort = data => {
  return useMemo(() => {
    return data.reduce((result, item) => {
      if (item.active) {
        result[0].push(item);
      } else {
        result[1].push(item);
      }
      return result;
    }, [[], []]);
  }, [data]);
};