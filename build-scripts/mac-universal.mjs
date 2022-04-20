import { makeUniversalApp } from '@electron/universal'
import path from 'path'
import {fileURLToPath} from 'url'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootPath = path.dirname(__dirname) + '/';

await makeUniversalApp({
  x64AppPath: rootPath + 'out/remote-logger/RemoteLogger-darwin-x64/RemoteLogger.app',
  arm64AppPath: rootPath + 'out/remote-logger/RemoteLogger-darwin-arm64/RemoteLogger.app',
  outAppPath: rootPath + 'out/remote-logger/RemoteLogger-darwin-universal/RemoteLogger.app',
});