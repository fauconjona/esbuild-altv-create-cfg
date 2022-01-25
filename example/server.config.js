import { fileURLToPath } from 'url'
import path from 'path'
import { build } from 'esbuild'
import {createCfg} from '../src/index'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

build({
    minify: true,
    watch: false,
    bundle: true,
    target: 'esnext',
    logLevel: 'info',
    format: 'esm',
    entryPoints: [path.resolve(__dirname, 'src', 'server.js')],
    outfile: path.resolve(__dirname, 'myresource', 'server.js'),
    plugins: [
        createCfg(path.resolve(__dirname, 'myresource', 'resource.cfg'), {server: true})
    ],
    external: ['alt-server'],
})
