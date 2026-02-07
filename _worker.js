export default {
    async fetch(request, env, ctx) {
        try {
            let url = new URL(request.url);

            // 后端域名，nethely.hu的免费二级域名，不带 http 和 /，例如：site.yourname.nhely.hu
            let backend_host = "site.yourname.nhely.hu";

            // 替换前端域名
            let frontend_host = url.host;
            url.host = backend_host;

            // nethely.hu的免费主机只支持http://，不支持添加SSL证书
            url.protocol = "http:";

            // 添加目录路径，可以设置目录名称与前端域名相同，组合后变成：/yourdomain.com/pathname
            url.pathname = "/" + frontend_host + url.pathname;

            // 创建新的请求对象，URL已修改，其他属性与原请求相同
            let newRequest = new Request(url.href, request.clone());

            // 手动修正核心 Header，确保请求能正确到达后端服务器
            newRequest.headers.set("Host", url.host); // Host 头必须是后端服务器的域名
            newRequest.headers.set('origin', url.origin); // Origin 头必须是后端服务器的域名和协议
            newRequest.headers.set("Referer", url.href); // 修正 Referer 头，确保后端服务器能正确处理请求和 Referer 防盗链

            // 开始请求
            let newResponse = await fetch(newRequest);

            if (newResponse.status >= 300 && newResponse.status < 400) { // 后端服务器返回3xx状态码
                let loc = newResponse.headers.get('Location') || "";

                loc = replaceString(loc, backend_host, frontend_host);

                // 重定向响应通常没有body，所以第一个参数是null
                newResponse = new Response(null, newResponse);
                newResponse.headers.set("Location", loc);

            } else if (newResponse.status >= 200 && newResponse.status < 300) { // 后端服务器返回2xx状态码
                let type = newResponse.headers.get("Content-Type") || "";

                // 如果响应内容是文本类型（HTML/CSS/JS/JSON/XML/...）
                if (
                    type.includes("text/")
                    || type.includes("application/javascript") || type.includes("application/x-javascript")
                    || type.includes("application/json")
                    || type.includes("application/xml")
                ) {
                    let text = await newResponse.clone().text();

                    text = replaceString(text, backend_host, frontend_host);

                    newResponse = new Response(text, newResponse);
                }
            }

            return newResponse;
        } catch (e) {
        }

        // 返回404
        return new Response("", {
            status: 404
        });
    },
};

function replaceString(str, backendHost, frontendHost) {
    let replace_str = str;

    // 删除目录路径，替换规则已验证有效
    replace_str = replace_str.replaceAll('//' + frontendHost, '//' + backendHost);
    replace_str = replace_str.replaceAll('http://' + backendHost + '/' + frontendHost, 'https://' + backendHost);
    replace_str = replace_str.replaceAll('/' + frontendHost, '//' + backendHost);

    // 替换所有后端域名为前端域名
    replace_str = replace_str.replaceAll(backendHost, frontendHost);

    return replace_str;
}
