function isSubset(subset: any, superset: any) {
  try {
    expect(superset).toMatchObject(subset);
    return true;
  }
  catch (ex) {
    return false;
  }
}

export const CustomMatchers = {
  toContainMatchingObject(received: any[], expected: any) {
    const pass = received.some(item => isSubset(expected, item));

    if (pass) {
      return {
        message: () =>
          `expected ${received} not to contain a partial object matching ${expected}`,
        pass: true,
      };
    } else {
      return {
        message: () =>
          `expected ${received} to contain a partial object matching ${expected}`,
        pass: false,
      };
    }
  }
}