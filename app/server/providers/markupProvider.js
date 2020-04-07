import environmentProvider from "../../environmentProvider";

const { whiteBoardId } = environmentProvider()

const scriptTemplate = path => `<script src="${path}"></script>`;

const markupProvider = ({ scripts }) => `
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Whiteboard | DJ</title>
</head>

<body>
    <style>
        * {
            margin: 0;
            padding: 0;
        }

        .whiteboard {
            display: relative;
            width: 100%;
            height: 100%
        }
    </style>
    <canvas class="whiteboard" id="${whiteBoardId}"></canvas>
    ${
    scripts.reduce((scripts, scriptPath) => `${scripts}\n${scriptTemplate(scriptPath)}`, "")
    }
</body>

</html>
`;

export default markupProvider;