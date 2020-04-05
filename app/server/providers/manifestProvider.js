import fs from "fs";
import path from "path";

let manifest;

const manifestProvider = () => {

    if (!manifest) {
        manifest = JSON.parse(
            fs.readFileSync(
                path.resolve(__dirname, "../client/manifest.json")
            )
        );
    }

    return manifest;
}

export default manifestProvider;