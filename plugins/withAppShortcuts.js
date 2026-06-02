const { withAndroidManifest, withDangerousMod, withStringsXml, AndroidConfig } = require('expo/config-plugins');
const path = require('path');
const fs = require('fs');

const ICONS = {
  flash: `<vector xmlns:android="http://schemas.android.com/apk/res/android" android:width="48dp" android:height="48dp" android:viewportWidth="24" android:viewportHeight="24">
    <path android:fillColor="#00F5D4" android:pathData="M13,2L4,14h6v8l9-13h-6z"/>
  </vector>`,
  scan: `<vector xmlns:android="http://schemas.android.com/apk/res/android" android:width="48dp" android:height="48dp" android:viewportWidth="24" android:viewportHeight="24">
    <path android:fillColor="#00F5D4" android:pathData="M12,9a3,3 0,1 0,0 6a3,3 0,1 0,0 -6z"/>
    <path android:fillColor="#00F5D4" android:pathData="M9,2L7,4H4a2,2 0,0 0,-2 2v12a2,2 0,0 0,2 2h16a2,2 0,0 0,2 -2V6a2,2 0,0 0,-2 -2h-3l-2,-2H9zM12,17a5,5 0,1 1,0 -10a5,5 0,0 1,0 10z"/>
  </vector>`,
  camp: `<vector xmlns:android="http://schemas.android.com/apk/res/android" android:width="48dp" android:height="48dp" android:viewportWidth="24" android:viewportHeight="24">
    <path android:fillColor="#00F5D4" android:pathData="M12,3L1,21h22L12,3zM12,7.5L18.5,19H5.5L12,7.5z"/>
    <path android:fillColor="#00F5D4" android:pathData="M12,12m-2,0a2,2 0,1 1,4 0a2,2 0,1 1,-4 0"/>
  </vector>`,
};

function withAppShortcuts(config, props = {}) {
  const shortcuts = props.shortcuts || [];
  if (shortcuts.length === 0) return config;

  config = withShortcutsIcons(config, shortcuts);
  config = withShortcutsXml(config, shortcuts);
  config = withShortcutsManifest(config);
  config = withShortcutsStrings(config, shortcuts);
  return config;
}

function withShortcutsIcons(config, shortcuts) {
  return withDangerousMod(config, [
    'android',
    async (modConfig) => {
      const resDir = path.join(modConfig.modRequest.platformProjectRoot, 'app', 'src', 'main', 'res');
      const drawableDir = path.join(resDir, 'drawable');
      if (!fs.existsSync(drawableDir)) fs.mkdirSync(drawableDir, { recursive: true });

      for (const s of shortcuts) {
        const iconKey = s.icon || Object.keys(ICONS)[0];
        const iconSvg = ICONS[iconKey];
        if (iconSvg) {
          fs.writeFileSync(path.join(drawableDir, `ic_shortcut_${s.id}.xml`), iconSvg);
        }
      }
      return modConfig;
    },
  ]);
}

function withShortcutsXml(config, shortcuts) {
  return withDangerousMod(config, [
    'android',
    async (modConfig) => {
      const resDir = path.join(modConfig.modRequest.platformProjectRoot, 'app', 'src', 'main', 'res');
      const xmlDir = path.join(resDir, 'xml');
      if (!fs.existsSync(xmlDir)) fs.mkdirSync(xmlDir, { recursive: true });

      let xml = `<?xml version="1.0" encoding="utf-8"?>\n<shortcuts xmlns:android="http://schemas.android.com/apk/res/android">\n`;
      for (const s of shortcuts) {
        xml += `  <shortcut\n`;
        xml += `    android:shortcutId="${s.id}"\n`;
        xml += `    android:enabled="true"\n`;
        xml += `    android:icon="@drawable/ic_shortcut_${s.id}"\n`;
        xml += `    android:shortcutShortLabel="@string/shortcut_${s.id}_short"\n`;
        xml += `    android:shortcutLongLabel="@string/shortcut_${s.id}_long">\n`;
        xml += `    <intent\n`;
        xml += `      android:action="android.intent.action.VIEW"\n`;
        xml += `      android:data="${s.deepLink}" />\n`;
        xml += `  </shortcut>\n`;
      }
      xml += `</shortcuts>\n`;

      fs.writeFileSync(path.join(xmlDir, 'shortcuts.xml'), xml);
      return modConfig;
    },
  ]);
}

function withShortcutsManifest(config) {
  return withAndroidManifest(config, async (modConfig) => {
    const manifest = modConfig.modResults;
    const mainActivity = AndroidConfig.Manifest.getMainActivityOrThrow(manifest);
    if (!mainActivity['meta-data']) mainActivity['meta-data'] = [];
    mainActivity['meta-data'].push({
      $: { 'android:name': 'android.app.shortcuts', 'android:resource': '@xml/shortcuts' },
    });
    return modConfig;
  });
}

function withShortcutsStrings(config, shortcuts) {
  return withStringsXml(config, (strings) => {
    for (const s of shortcuts) {
      strings[`shortcut_${s.id}_short`] = s.shortLabel;
      strings[`shortcut_${s.id}_long`] = s.longLabel;
    }
    return strings;
  });
}

module.exports = withAppShortcuts;
