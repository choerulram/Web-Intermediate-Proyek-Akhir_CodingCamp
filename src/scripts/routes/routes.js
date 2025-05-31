import RegisterPage from '../pages/auth/register/register-page';
import LoginPage from '../pages/auth/login/login-page';
import HomePage from '../pages/home/home-page';
import AboutPage from '../pages/about/about-page';
import NewPage from '../pages/new/new-page';
import BookmarkPage from '../pages/bookmark/bookmark-page';
import { checkAuthenticatedRoute, checkUnauthenticatedRouteOnly } from '../utils/auth';
import NotFoundPage from '../pages/not-found/not-found-page';

export const routes = {
  '/login': () => checkUnauthenticatedRouteOnly(new LoginPage()),
  '/register': () => checkUnauthenticatedRouteOnly(new RegisterPage()),
  '/': () => checkAuthenticatedRoute(new HomePage()),
  '/about': () => checkUnauthenticatedRouteOnly(new AboutPage()),
  '/new': () => checkAuthenticatedRoute(new NewPage()),
  '/bookmark': () => checkAuthenticatedRoute(new BookmarkPage()),
  '/404': () => new NotFoundPage(),
  '*': () => {
    // Redirect semua route yang tidak dikenal ke halaman 404
    location.hash = '/404';
    return new NotFoundPage();
  },
};
