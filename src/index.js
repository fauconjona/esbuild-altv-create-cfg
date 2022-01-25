import path from "path"
import fs from "fs"
import {Config} from 'cfg-reader';

function log(msg) {
    console.log('\x1b[36m%s\x1b[0m', msg)
}


/**
 * esbuild plugin to create a resource.cfg file for altv
 * @param {string} file 
 * @param {} options 
 * options:
 * - client: true/false (default: false)
 * - server: true/false (default: false)
 * - type: resource type (default: 'js')
 * - clientFiles: client files
 * - requiredPermissions: required permissions
 * - optionalPermissions: optional permissions
 * - deps: dependencies
 * - dll: dll file when type == 'csharp' (default: 'server.dll')
 * 
 * more infos: https://docs.altv.mp/articles/configs/resource.html
 * @returns esbuild-plugin
 */
export function createCfg(file, 
    {
        client = false, 
        server = false, 
        type = 'js', 
        clientFiles = [],
        requiredPermissions = [],
        optionalPermissions = [],
        deps = [], 
        dll = 'server.dll'
    }) {
    return {
        name: 'create-cfg',
        setup(build) {
            build.onEnd(result => {
                log(`creating cfg: ${file}`)
    
                let folders = file.split(path.sep);
                folders.pop();
                let folder = folders.join(path.sep);
    
                if (!fs.existsSync(folder)) {
                    fs.mkdirSync(folder, { recursive: true });
                }
    
                let filename = path.basename(build.initialOptions.outfile);
                let doc = new Config(file);

                if (client) {
                    clientFiles.push(filename)
                    doc.set("client-type", type);
                    doc.set("client-main", filename); 
                }
    
                if (server) {
                    doc.set("type", type);
                    doc.set("main", type == 'csharp' ? dll : filename); 
                }
    
                if (clientFiles.length > 0) {
                    doc.set("client-files", clientFiles);
                }

                if (requiredPermissions.length > 0) {
                    doc.set("required-permissions", requiredPermissions);
                }

                if (optionalPermissions.length > 0) {
                    doc.set("optional-permissions", optionalPermissions);
                }

                if (deps.length > 0) {
                    doc.set("deps", deps);
                }
    
                doc.save();
                log(`${file} created`);

                return true;
            })
        }
    }
}