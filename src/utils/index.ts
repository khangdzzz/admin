import { sortByName } from "./collection.helper";
import { timeout } from "./promise.helper";
import { calculateSortQuery } from "./rest-client.helper";
import { sortDropdown } from "./sortable.helper";
import { makeUniqueName } from "./string.helper";

const utils = {
  collection: {
    sortByName
  },
  string: {
    makeUniqueName
  },
  restClient: {
    calculateSortQuery
  },
  promise: {
    timeout
  },
  sortable: {
    sortDropdown
  }
};

export default utils;
