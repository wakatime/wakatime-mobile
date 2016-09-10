#!/bin/bash
FINAL_BINARY_FILEPATH="platforms/android/build/outputs/apk/wakatime-android-release-signed.apk"
echo "*** Build Ionic release for Android ***"
rm $FINAL_BINARY_FILEPATH
ionic build --release android
echo "Signing APK..."
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore ~/Dropbox/WakaTime/Build/Android/wakatime.keystore -storepass $WAKATIME_STOREPASS platforms/android/build/outputs/apk/android-release-unsigned.apk android
echo "Optimizing APK (zipalign)..."
~/Library/Android/sdk/build-tools/23.0.3/zipalign -v -f 4 platforms/android/build/outputs/apk/android-release-unsigned.apk $FINAL_BINARY_FILEPATH
# echo "Opening APK (in HockeyApp)..."
# open platforms/MyApp.apk
echo "Build complete"
echo "App binary ready for upload at \`"$FINAL_BINARY_FILEPATH"\`"
