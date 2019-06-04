/**
 * Checks if a configuration is defined in package.json
 *
 * @param name      Key of the configuration
 * @return whether the configuration exists
 */
export const hasPackageConfig = (name: string): boolean => {
  try {
    return !!getPackageConfig()[name]
  } catch (_) {
    return false
  }
}
