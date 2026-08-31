# BakeSmart2D

BakeSmart2D is a Phaser 3.90 and TypeScript educational bakery game. Vite produces the shared web game, Electron packages that output for Windows, and Capacitor packages it for Android.

## Development

Prerequisites:

- Node.js 22.12 or newer
- npm

Install dependencies and start the browser development server:

```powershell
npm install
npm run dev
```

Run the strict TypeScript and Vite production build:

```powershell
npm run build
```

The web production output is written to `dist/` and uses relative asset paths.

## Windows client installation

1. Double-click `BakeSmart2D Setup.exe`.
2. Complete the installation.
3. Double-click the BakeSmart2D Desktop shortcut.
4. Play.

The installer also creates a Start Menu shortcut and a normal Windows uninstall entry. The installed game includes Electron and all required web files; clients do not need Node.js, npm, VS Code, Chrome, a development server, or an internet connection for core gameplay.

The current installer is not code-signed. Windows may display a SmartScreen warning until a trusted Windows code-signing certificate is configured.

## Windows developer commands

Launch the production web build in Electron:

```powershell
npm run desktop:dev
```

Create an unpacked Windows application for QA:

```powershell
npm run desktop:dir
```

Create the client installer:

```powershell
npm run desktop:package
```

Windows outputs are written to:

```text
release/windows/
├── BakeSmart2D Setup.exe
└── win-unpacked/
    └── BakeSmart2D.exe
```

Do not manually rename packaging outputs, because generated metadata may refer to their configured names.

## Android client installation

The current Android deliverable is a debug-signed APK intended for client testing. It is not a production Play Store release.

1. Transfer `app-debug.apk` to the Android phone.
2. Open the APK on the phone.
3. If Android prompts for it, allow the file-transfer or browser application to install unknown apps.
4. Install BakeSmart2D.
5. Open BakeSmart2D from the application launcher.
6. Rotate the phone to landscape if necessary.
7. Play.

The Android application bundles the same Vite production game used by the web and Windows versions. Core gameplay does not require Chrome, Node.js, npm, a development server, localhost, or an internet connection.

## Android developer workflow

Prerequisites:

- Node.js 22.12 or newer and npm
- Android SDK Platform 36, Build Tools 36, and Platform Tools
- JDK 17 through 24; JDK 21 is recommended for the included Gradle 8.14.3 wrapper
- A physical Android device with USB debugging enabled for device testing

The build helper checks `BAKESMART_JAVA_HOME` first, then a project-local JDK under `.tools/jdk-21/`, then `JAVA_HOME`. It detects the conventional Windows Android SDK location when `ANDROID_HOME` and `ANDROID_SDK_ROOT` are not set. This avoids changing global Java settings on machines that use an older system Java.

Build the web game and synchronize it into the native Android wrapper:

```powershell
npm run android:sync
```

Build a debug APK, including a fresh web build and Capacitor sync:

```powershell
npm run android:build:debug
```

The generated client-testing APK is written to:

```text
android/app/build/outputs/apk/debug/app-debug.apk
```

To test on a connected physical device:

```powershell
adb devices
adb install -r android/app/build/outputs/apk/debug/app-debug.apk
adb shell am start -n com.bakesmart2d.app/.MainActivity
```

Test launch, landscape layout, touch interaction, all three learning outcomes, results, navigation, and background/resume on the physical device. A production release requires a private release signing key and a separately configured signed release build; the debug APK must not be represented as production-signed.
