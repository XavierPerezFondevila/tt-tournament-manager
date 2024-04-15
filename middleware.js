export function middleware(request) {
    const currentUser = request.cookies.get('currentUser')?.value
}