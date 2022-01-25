import path from "path"
import fs from "fs"
import yaml from 'js-yaml';

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
                let doc = {}

                if (fs.existsSync(file)) {
                    doc = yaml.load(fs.readFileSync(file, 'utf8'));
                }

                if (client) {
                    clientFiles.push(filename)
                    doc["client-type"] = type;
                    doc["client-main"] = filename; 
                }
    
                if (server) {
                    doc["type"] = type;
                    doc["main"] = type == 'csharp' ? dll : filename; 
                }
    
                if (clientFiles.length > 0) {
                    doc["client-files"] = clientFiles;
                }

                if (requiredPermissions.length > 0) {
                    doc["required-permissions"] = requiredPermissions;
                }

                if (optionalPermissions.length > 0) {
                    doc["optional-permissions"] = optionalPermissions;
                }

                if (deps.length > 0) {
                    doc["deps"] = deps;
                }
    
                fs.writeFile(file, yaml.dump(doc, {flowLevel: 1}), (err) => {
                    if (err) throw err;
                    log(`${file} created`);
                })

                return true;
            })
        }
    }
}