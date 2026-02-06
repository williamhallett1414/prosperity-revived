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
import BibleBooks from './pages/BibleBooks';
import Bookmarks from './pages/Bookmarks';
import ChallengeDetail from './pages/ChallengeDetail';
import Community from './pages/Community';
import Discover from './pages/Discover';
import DiscoverMeditations from './pages/DiscoverMeditations';
import DiscoverRecipes from './pages/DiscoverRecipes';
import DiscoverWorkouts from './pages/DiscoverWorkouts';
import Friends from './pages/Friends';
import GroupDetail from './pages/GroupDetail';
import Groups from './pages/Groups';
import Home from './pages/Home';
import Messages from './pages/Messages';
import NotificationSettings from './pages/NotificationSettings';
import Notifications from './pages/Notifications';
import NutritionGuidance from './pages/NutritionGuidance';
import PlanDetail from './pages/PlanDetail';
import Plans from './pages/Plans';
import Profile from './pages/Profile';
import Search from './pages/Search';
import Settings from './pages/Settings';
import SpiritualGrowth from './pages/SpiritualGrowth';
import UserProfile from './pages/UserProfile';
import WellnessJourney from './pages/WellnessJourney';
import WorkoutProgress from './pages/WorkoutProgress';
import WorkoutTrends from './pages/WorkoutTrends';
import Wellness from './pages/Wellness';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Achievements": Achievements,
    "Bible": Bible,
    "BibleBooks": BibleBooks,
    "Bookmarks": Bookmarks,
    "ChallengeDetail": ChallengeDetail,
    "Community": Community,
    "Discover": Discover,
    "DiscoverMeditations": DiscoverMeditations,
    "DiscoverRecipes": DiscoverRecipes,
    "DiscoverWorkouts": DiscoverWorkouts,
    "Friends": Friends,
    "GroupDetail": GroupDetail,
    "Groups": Groups,
    "Home": Home,
    "Messages": Messages,
    "NotificationSettings": NotificationSettings,
    "Notifications": Notifications,
    "NutritionGuidance": NutritionGuidance,
    "PlanDetail": PlanDetail,
    "Plans": Plans,
    "Profile": Profile,
    "Search": Search,
    "Settings": Settings,
    "SpiritualGrowth": SpiritualGrowth,
    "UserProfile": UserProfile,
    "WellnessJourney": WellnessJourney,
    "WorkoutProgress": WorkoutProgress,
    "WorkoutTrends": WorkoutTrends,
    "Wellness": Wellness,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};