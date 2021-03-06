# esbuild-altv-create-cfg

A esbuild plugin to create a resource.cfg for altv.

Useful when you want to generate your resource folder from your soucre

## how to use

`npm i -D esbuild-altv-create-cfg`

```js
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
```