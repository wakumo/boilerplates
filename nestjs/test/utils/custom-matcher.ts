function isSubset(
  subset: Record<string, unknown>,
  superset: Record<string, unknown>,
) {
  try {
    expect(superset).toMatchObject(subset);
    return true;
  } catch {
    return false;
  }
}

export const CustomMatchers = {
  toContainMatchingObject(
    received: unknown[],
    expected: Record<string, unknown>,
  ) {
    const pass = received.some((item) => {
      if (typeof item === 'object' && item !== null) {
        return isSubset(expected, item as Record<string, unknown>);
      }
      return false;
    });

    if (pass) {
      return {
        message: () =>
          `expected ${JSON.stringify(
            received,
          )} not to contain a partial object matching ${JSON.stringify(
            expected,
          )}`,
        pass: true,
      };
    } else {
      return {
        message: () =>
          `expected ${JSON.stringify(
            received,
          )} to contain a partial object matching ${JSON.stringify(expected)}`,
        pass: false,
      };
    }
  },
};
