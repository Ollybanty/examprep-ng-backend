import { RULES } from './constants.js';

// Page 2 with limit 20 skips the first 20 results
export function getPagination({ page = 1, limit = RULES.PAGE_LIMIT_DEFAULT }) {
  return { page, limit, skip: (page - 1) * limit };
}

// The pagination object every list returns, as in the README
export function paginationMeta({ page, limit }, total) {
  return { page, limit, total, pages: Math.ceil(total / limit) };
}
