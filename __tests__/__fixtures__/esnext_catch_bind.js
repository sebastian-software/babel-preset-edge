try {
  throw 0;
} catch {
  doSomethingWhichDoesntCareAboutTheValueThrown();
} finally {
  doSomeCleanup();
}
