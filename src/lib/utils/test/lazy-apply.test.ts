import { deepStrictEqual, strictEqual } from "node:assert";
import { describe, it } from "node:test";
import { lazyApply } from "../lazy-apply";

describe("lazyApply", () => {
  it("return undefined for empty input", async () => {
    await strictEqual(lazyApply([], []), undefined);
  });

  it("return undefined if function return undefined", async () => {
    await strictEqual(lazyApply([() => undefined], []), undefined);
  });

  it("return undefined if multiple functions return falsy value", async () => {
    await strictEqual(lazyApply([() => undefined, () => false, () => "", () => null, () => 0], []), undefined);
  });

  it("return calls function with args", async () => {
    await deepStrictEqual(lazyApply([(...args) => args], ["hello", "world"]), ["hello", "world"]);
  });

  it("returns first defined value", async () => {
    await strictEqual(lazyApply([() => undefined, () => "hello", () => "world"], []), "hello");
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

    await strictEqual(isTargetFnCalled, true);
    await strictEqual(isSubsequentFnCalled, false);
  });
});
