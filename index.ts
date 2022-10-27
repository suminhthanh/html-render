import {serve} from "https://deno.land/std@0.140.0/http/server.ts";

async function handleRequest(request: Request): Promise<Response> {
  const url = new URL(request.url);
  if (url.toString().includes("/static/img/favicon.ico")) {
    const file = await Deno.readFile("./static/img/favicon.ico");
    return new Response(file, {
      headers: {
        "content-type": "image/icon",
      },
    });
  } else if (url.toString().includes("?url=")) {
    const htmlParam = url.searchParams.get('url');
    let html;

    try {
      const response = await fetch(htmlParam);
      const blob = new Blob([await response.arrayBuffer()], {type: 'text/html; charset=utf-8'});
      html = await blob.text();
    } catch (e: Error) {
      console.error(e);
      return new Response(
        `<html>
      <head>
        <title>Not Found</title>
      </head>
      <body>
        <h1>Not Found</h1>
      </body>
    </html>`,
        {
          headers: {
            "content-type": "text/html; charset=utf-8",
          },
        },
      );
    }

    return new Response(
      html,
      {
        headers: {
          "content-type": "text/html; charset=utf-8",
        },
      },
    );
  }

  return new Response("OK");
}

serve(handleRequest);