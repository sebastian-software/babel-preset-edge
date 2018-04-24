async function executeTasks(tasks) {
  for (const taskName of tasks) {
    try {
      await executeCommands()
    } catch (error) {
      console.error("Error")
    }
  }
}
