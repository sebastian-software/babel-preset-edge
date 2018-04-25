function test() {
  for (const taskName of tasks) {
    try {
      executeCommands()
    } catch (error) {
      console.error("Error")
    }
  }
}
