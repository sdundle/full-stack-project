<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class Cors
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $domain = $request->getHost();
        $response = $next($request);
        $response->headers->set('Access-Control-Allow-Origin', $domain);
        $response->headers->set('Access-Control-Allow-Headers', 'Content-Type, Authorization, Origin, Application, Accept');
        $response->headers->set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH');
        $response->headers->set("Access-Control-Allow-Credentials", "true");

        return $response;
    }
}
