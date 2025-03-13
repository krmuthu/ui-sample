/**
 * Version information for the clipper-ui library
 * This will be updated during the build process
 */

/**
 * Interface for version information
 */
export interface VersionInfo {
  version: string;
  name: string;
  buildDate: string;
  buildTimestamp: number;
  commitHash: string;
}

/**
 * Default version information
 * This will be replaced during build by the rollup plugin
 */
const versionInfo: VersionInfo = {
  version: '0.0.0',
  name: 'clipper-ui',
  buildDate: 'development',
  buildTimestamp: 0,
  commitHash: 'development'
};

/**
 * Get the current version of the library
 */
export function getVersion(): string {
  return versionInfo.version;
}

/**
 * Get detailed version information
 */
export function getVersionInfo(): VersionInfo {
  return { ...versionInfo };
}

/**
 * Get a formatted version string
 */
export function getFormattedVersion(): string {
  return `${versionInfo.name} v${versionInfo.version} (${versionInfo.buildDate})`;
}

export default versionInfo; 