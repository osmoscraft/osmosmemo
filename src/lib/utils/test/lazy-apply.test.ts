import { describe, expect, it } from "@osmoscraft/typescript-testing-library";
import { lazyApply } from "../lazy-apply";

describe("lazyApply", () => {
  it("return undefined for empty input", async () => {
    await expect(lazyApply([], [])).toEqual(undefined);
  });

  it("return undefined if function return undefined", async () => {
    await expect(lazyApply([() => undefined], [])).toEqual(undefined);
  });

  it("return undefined if multiple functions return falsy value", async () => {
    await expect(lazyApply([() => undefined, () => false, () => "", () => null, () => 0], [])).toEqual(undefined);
  });

  it("return calls function with args", async () => {
    await expect(lazyApply([(...args) => args], ["hello", "world"])).toEqual(["hello", "world"]);
  });

  it("returns first defined value", async () => {
    await expect(lazyApply([() => undefined, () => "hello", () => "world"], [])).toEqual("hello");
  });

  it("does not call subsequent function after defined value is returned", async () => {
    let isTargetFnCalled = false;
    let isSubsequentFnCalled = false;
    lazyApply(
      [
        () => {
          isTargetFnCalled = true;
          return "hello";
        },
        () => {
          isSubsequentFnCalled = true;
          return "world";
        },
      ],
      []
    );

    await expect(isTargetFnCalled).toEqual(true);
    await expect(isSubsequentFnCalled).toEqual(false);
  });
});
