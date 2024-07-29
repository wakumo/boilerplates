declare namespace jest {
  interface Matchers<R> {
    toContainMatchingObject(partialObject: object): CustomMatcherResult;
  }
}