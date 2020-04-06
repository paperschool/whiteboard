import express from "express";
import markupProvider from "./providers/markupProvider";
import manifestProvider from "./providers/manifestProvider";
import { clearWhiteboard } from "./whiteboard";


const router = express.Router();
const homepageMarkup = markupProvider({
    scripts: [
        `/${manifestProvider()["defaultVendors~main.js"]}`,
        `/${manifestProvider()["main.js"]}`
    ]
})

router.get("/", (req, res) => {
    res.send(homepageMarkup)
});

router.get("/reset", (req, res) => {
    clearWhiteboard()
    res.redirect("/")
});

export default router;