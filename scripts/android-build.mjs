import { spawnSync } from 'node:child_process';
import { existsSync, readdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const localJdkRoot = join(projectRoot, '.tools', 'jdk-21');

function hasJavac(directory) {
  return Boolean(directory) && existsSync(join(directory, 'bin', process.platform === 'win32' ? 'javac.exe' : 'javac'));
}

function findLocalJdk() {
  if (!existsSync(localJdkRoot)) return undefined;
  return readdirSync(localJdkRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => join(localJdkRoot, entry.name))
    .find(hasJavac);
}

const javaHome = process.env.BAKESMART_JAVA_HOME || findLocalJdk() || process.env.JAVA_HOME;
if (!hasJavac(javaHome)) {
  throw new Error('A JDK 17–24 is required. Set BAKESMART_JAVA_HOME or provide the project-local .tools/jdk-21 installation.');
}

const defaultAndroidSdk =
  process.platform === 'win32'
    ? join(homedir(), 'AppData', 'Local', 'Android', 'Sdk')
    : join(homedir(), 'Android', 'Sdk');
const androidSdk = process.env.ANDROID_HOME || process.env.ANDROID_SDK_ROOT || defaultAndroidSdk;
if (!existsSync(androidSdk)) throw new Error(`Android SDK not found at ${androidSdk}`);

const androidRoot = join(projectRoot, 'android');
const gradleWrapper = join(androidRoot, process.platform === 'win32' ? 'gradlew.bat' : 'gradlew');
if (!existsSync(gradleWrapper)) throw new Error('Android platform is missing. Run npx cap add android first.');

console.log(`Using JAVA_HOME=${javaHome}`);
console.log(`Using ANDROID_HOME=${androidSdk}`);

const command = process.platform === 'win32' ? process.env.ComSpec || 'cmd.exe' : gradleWrapper;
const commandArguments = process.platform === 'win32' ? ['/d', '/s', '/c', 'gradlew.bat assembleDebug'] : ['assembleDebug'];
const result = spawnSync(command, commandArguments, {
  cwd: androidRoot,
  env: {
    ...process.env,
    JAVA_HOME: javaHome,
    ANDROID_HOME: androidSdk,
    ANDROID_SDK_ROOT: androidSdk
  },
  stdio: 'inherit',
  shell: false
});

if (result.error) throw result.error;
process.exit(result.status ?? 1);
