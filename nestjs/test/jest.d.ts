declare namespace jest {
  interface Matchers {
    toContainMatchingObject(partialObject: object): CustomMatcherResult;
  }
}
