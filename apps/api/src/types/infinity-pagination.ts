import { IPaginationOptions } from "./pagination-options";
import { InfinityPaginationResultType } from "./infinity-pagination-result.type";

export const infinityPagination = <T>(
  data: T[],
  options: IPaginationOptions,
): InfinityPaginationResultType<T> => {
  return {
    data,
    hasNextPage: data.length === options.limit,
    hasPreviousPage: options.page > 1,
    totalCount: data.length,
  };
};
