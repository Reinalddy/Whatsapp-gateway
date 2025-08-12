// import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server';
// import { verifyToken } from './lib/jwt/jwt';

// export function middleware (request: NextRequest) {
//     const token = request.cookies.get('token')?.value;

//     const isAuthPage = request.nextUrl.pathname.startsWith('/login');

//     if (!token && !isAuthPage) {
//         return NextResponse.redirect(new URL('/login', request.url));
//     }

//     const decodedToken = token ? verifyToken(token) : null;
    
//     // CHECK ROLE USERS JIKA ADMIN MAKA REDIRECT KE DASHBOARD ADMIN 
//     // JIKA USER MAKA REDIRECT KE DASHBOARD USER
//     if(decodedToken) {
//         if (decodedToken.role == 'admin') {
//             // JIKA ROLE USERS ADALAH ADMIN MAKA ADMIN HANYA BISA MENGAKSES ROUTE PREFIX /ADMIN/
//             if (!request.nextUrl.pathname.startsWith('/admin')) {
//                 return NextResponse.redirect(new URL('/admin/dashboard', request.url));
//             }

//             if(isAuthPage) {
//                 return NextResponse.redirect(new URL('/admin/dashboard', request.url));
//             }

//         } else {
//             // JIKA ROLE USERS ADALAH USER MAKA USER HANYA BISA MENGAKSES ROUTE PREFIX /USER/
//             if (!request.nextUrl.pathname.startsWith('/user')) {
//                 return NextResponse.redirect(new URL('/user/dashboard', request.url));
//             }

//             if(isAuthPage) {
//                 return NextResponse.redirect(new URL('/user/dashboard', request.url));
//             }
//         }

//     }

//     return NextResponse.next();
// }

// export const config = {
//     matcher: [
//         '/user/:path*', // middleware akan jalan hanya di /dashboard dan subpath-nya
//     ],
//   };