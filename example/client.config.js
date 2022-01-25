import { fileURLToPath } from 'url'
import path from 'path'
import { build } from 'esbuild'
import {createCfg} from '../src/index'
import {copy} from 'esbuild-plugin-copy';

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

build({
    minify: true,
    watch: false,
    bundle: true,
    target: 'esnext',
    logLevel: 'info',
    format: 'esm',
    entryPoints: [path.resolve(__dirname, 'src', 'client.js')],
    outfile: path.resolve(__dirname, 'myresource', 'client.js'),
    plugins: [
        copy({assets: {from: path.resolve(__dirname, 'src', 'html', '*'), to: path.resolve(__dirname, 'myresource', 'html')}}),
        createCfg(path.resolve(__dirname, 'myresource', 'resource.cfg'), {
            type: 'js',
            client: true, 
            clientFiles: ['html/*'],
            requiredPermissions: ['Screen Capture'],
            optionalPermissions: ['WebRTC'],
            deps: ['chat']
        })
    ],
    external: ['alt-client', 'natives'],
})
