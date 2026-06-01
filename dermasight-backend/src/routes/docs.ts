import { Router, Request, Response } from "express";
import fs from "fs";
import path from "path";

const docsRouter = Router();

const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Dermasight API — Swagger UI</title>
    <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css" />
</head>
<body>
    <div id="swagger-ui"></div>
    <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
    <script>
        SwaggerUIBundle({
            url: "/api/docs/openapi.json",
            dom_id: "#swagger-ui",
        });
    </script>
</body>
</html>`;

docsRouter.get("/", (_req: Request, res: Response) => {
    res.type("html").send(html);
});

docsRouter.get("/openapi.json", (_req: Request, res: Response) => {
    const spec = JSON.parse(fs.readFileSync(path.resolve("docs/openapi.json"), "utf-8"));
    res.json(spec);
});

export default docsRouter;
