# AI Sort Extension

This Chrome and Firefox extension lets you search through content on any webpage using AI embeddings. 
1. You provide a description of what you are looking for
2. Select the content you want to analyze
3. The extension sorts the content by embedding similarity.
4. You can edit your description and iterate
### Firefox

To install in Firefox:

1. Switch to the `firefox` branch: `git checkout firefox` 
2. Run `npm run build`
3. Open Firefox's [debugging page](about:debugging#/runtime/this-firefox) (`about:debugging#/runtime/this-firefox`)
4. Add the extension


### Chrome

1. Switch to the `main` branch: `git checkout main` 
2. Run `npm run build`
3. Open Chrome's [extensions page](chrome://extensions/) (`chrome://extensions/`)
4. Load this unpackaged extension.


### Safari

I have not tried this, but this extension was forked from an extension Template that had the following instructions

Do the following steps in Xcode.

Note: “Open the project config” means double-click the app name at the top of the file view in Xcode.

- [Change the Safari app name to your app’s name](https://stackoverflow.com/a/20418989)
- Open `Shared (App)/Models.swift` and update `APP_NAME` with your app's name
- Create a new bundle identifier in the format `com.domain.App-Name` 
	- Open the project config and go to `AppName (iOS)` > Signing & Capabilities and update the bundle id
	- Repeat for the macOS app
- Create a new bundle identifier. It should be your app bundle identifier with `.Extension` added onto the end. So if your app bundle ID is `com.domain.App-Name`, this should be `com.domain.App-Name.Extension`
	- Open the project config and go to `AppName Extension (iOS)` > Signing & Capabilities and update the bundle id with the extension bundle id
	- Repeat for the macOS extension
	- Update `MAC_EXTENSION_BUNDLE_ID` in `Shared (App)/Models.swift` with the extension bundle ID as well
- Update `macOS (App)/AppDelegate.swift` with a help documentation link
- Under project config > Signing & Capabilities, set the team for both apps and both extensions
- Under project config > General, update the display name for iOS and macOS
- Rename both files named `REPLACEME.entitlements` to be `Your App Name.entitlements` 
	- Open the project config and to go to App Name (macOS) > Build Settings and find the setting for “Code Signing Entitlements.” Replace `REPLACEME.entitlements` with the name of your new entitlements file
	- Repeat for App Name Extension (macOS) > Build Settings > Code Signing Entitlements
- Open the project config and go to App Name Extension (macOS) > Build Settings and find the setting for “Bundle Display Name.” Update its value with your app’s name
	- Repeat for App Name Extension (iOS)
- Go to Product > Schemes > Manage Schemes… and update the iOS and macOS schemes with your app’s name
- iOS app icon:
	- Add the app icon to  `iOS (App)/iOS Assets` as `AppIcon` with all the required sizes
	- Add a copy of the app icon named `Icon.png` in `Shared (App)/Resources` 
- macOS app icon
	- Reduce the size of the app icon by 20% while keeping the canvas the same size
	- Add the app icon to `macOS (App)/macOS Assets` as `AppIcon` with all the required sizes
