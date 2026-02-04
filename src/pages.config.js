/**
 * pages.config.js - Page routing configuration
 * 
 * This file is AUTO-GENERATED. Do not add imports or modify PAGES manually.
 * Pages are auto-registered when you create files in the ./pages/ folder.
 * 
 * THE ONLY EDITABLE VALUE: mainPage
 * This controls which page is the landing page (shown when users visit the app).
 * 
 * Example file structure:
 * 
 *   import HomePage from './pages/HomePage';
 *   import Dashboard from './pages/Dashboard';
 *   import Settings from './pages/Settings';
 *   
 *   export const PAGES = {
 *       "HomePage": HomePage,
 *       "Dashboard": Dashboard,
 *       "Settings": Settings,
 *   }
 *   
 *   export const pagesConfig = {
 *       mainPage: "HomePage",
 *       Pages: PAGES,
 *   };
 * 
 * Example with Layout (wraps all pages):
 *
 *   import Home from './pages/Home';
 *   import Settings from './pages/Settings';
 *   import __Layout from './Layout.jsx';
 *
 *   export const PAGES = {
 *       "Home": Home,
 *       "Settings": Settings,
 *   }
 *
 *   export const pagesConfig = {
 *       mainPage: "Home",
 *       Pages: PAGES,
 *       Layout: __Layout,
 *   };
 *
 * To change the main page from HomePage to Dashboard, use find_replace:
 *   Old: mainPage: "HomePage",
 *   New: mainPage: "Dashboard",
 *
 * The mainPage value must match a key in the PAGES object exactly.
 */
import Achievements from './pages/Achievements';
import Bible from './pages/Bible';
import Bookmarks from './pages/Bookmarks';
import Community from './pages/Community';
import Friends from './pages/Friends';
import GroupDetail from './pages/GroupDetail';
import Groups from './pages/Groups';
import Home from './pages/Home';
import Messages from './pages/Messages';
import PlanDetail from './pages/PlanDetail';
import Plans from './pages/Plans';
import Profile from './pages/Profile';
import Search from './pages/Search';
import Settings from './pages/Settings';
import SpiritualGrowth from './pages/SpiritualGrowth';
import UserProfile from './pages/UserProfile';
import Wellness from './pages/Wellness';
import BibleBooks from './pages/BibleBooks';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Achievements": Achievements,
    "Bible": Bible,
    "Bookmarks": Bookmarks,
    "Community": Community,
    "Friends": Friends,
    "GroupDetail": GroupDetail,
    "Groups": Groups,
    "Home": Home,
    "Messages": Messages,
    "PlanDetail": PlanDetail,
    "Plans": Plans,
    "Profile": Profile,
    "Search": Search,
    "Settings": Settings,
    "SpiritualGrowth": SpiritualGrowth,
    "UserProfile": UserProfile,
    "Wellness": Wellness,
    "BibleBooks": BibleBooks,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};