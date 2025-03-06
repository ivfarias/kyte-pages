/** @type {import('tailwindcss').Config} */
const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
    content: [
        "./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}",
        "*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#2DD1AC",
                textColor: "#363F4D",
                green01: "#2FAE94",
                green02: "#25BF97",
                green03: "#2FC79F",
                green04: "#2DD1AC",
                green05: "#5BD7BB",
                green06: "#8CD7C6",
                green07: "#DDF7F2",
                green08: "#E3F6F1",
                gray01: "#2A323F",
                gray02: "#363F4D",
                gray03: "#444E5E",
                gray04: "#535D6E",
                gray05: "#808C9E",
                gray06: "#A9B1BE",
                gray07: "#D9DCE2",
                gray08: "#E8E9EA",
                gray09: "#EFF1F3",
            },
            fontFamily: {
                graphik: ['Graphik', 'sans-serif'],
            },
        },
    },
    plugins: [],
});