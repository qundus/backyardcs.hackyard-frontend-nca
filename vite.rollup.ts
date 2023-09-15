import type { UserConfig } from "vite";
import path from "node:path";
import fs from "node:fs";
// import glob from "glob";
const assets_dir = "assets";
const deps_dir = "__deps__";
const vendors_dir = "__vendors__";
export const rollup_base_options = (public_dir: string = "public") => {
  return {
    // input: glob.sync(path.resolve(__dirname, "src", "*.html")), // dynamic mpa entry points
    // external: (id, s, v) => {
    //    console.log("id :: ", v);
    //    return id.startsWith('/gallery/');
    // },
    output: {
      // format: 'es',
      // entryFileNames: '[name]-[hash].js', // specify the filename pattern for entry files
      // chunkFileNames: '[name]-[hash].js', // specify the filename pattern for non-entry files
      assetFileNames: `${assets_dir}/[ext]/[name][extname]`,
      chunkFileNames: "[name]-[hash].js",
      entryFileNames: "[name]-[hash].js",
      manualChunks(id) {
        if (id.includes(process.cwd())) {
          // exclude node_modules
          const match = id.match(/^(?:(?!.*node_modules))(.*)$/g);
          if (match) {
            let name = id.replace(process.cwd() + path.sep, "");
            name = name.replace(/\//g, path.sep); // Use path.sep instead of / for Windows compatibility
            name = name.replace(/\?(.*)?\./g, "."); // remove queries
            name = name.replace(/\./g, "_");
            // name = name.replace(/\.(?=[^.]*\.)/g, "_");
            return name;
          } else if (id.includes("node_modules")) {
            const split = id.split("node_modules");
            const mod_id = split[split.length - 1].split(path.sep)[1];
            // console.log("id :: ", mod_id);
            return deps_dir + path.sep + mod_id; // group all dependencies into a vendor chunk
          }
        } else {
          // if (fs.existsSync(public_dir + id)) {
          //    console.log("public :: ", id);
          //    return path.join(assets_dir, id);
          // }
        }
        return vendors_dir + path.sep + id;
      },
    },
  };
};
