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
import AffirmationsPage from './pages/AffirmationsPage';
import Bible from './pages/Bible';
import BibleBooks from './pages/BibleBooks';
import Bookmarks from './pages/Bookmarks';
import ChallengeDetail from './pages/ChallengeDetail';
import ChallengeDetailPage from './pages/ChallengeDetailPage';
import Community from './pages/Community';
import DiscoverRecipes from './pages/DiscoverRecipes';
import EmotionalCheckInPage from './pages/EmotionalCheckInPage';
import FoodLogHistory from './pages/FoodLogHistory';
import Friends from './pages/Friends';
import GratitudeJournalPage from './pages/GratitudeJournalPage';
import GroupDetail from './pages/GroupDetail';
import Groups from './pages/Groups';
import GrowthPathwaysPage from './pages/GrowthPathwaysPage';
import HabitBuilderPage from './pages/HabitBuilderPage';
import Home from './pages/Home';
import IdentityInChristPage from './pages/IdentityInChristPage';
import MealDetailView from './pages/MealDetailView';
import Messages from './pages/Messages';
import MindsetResetPage from './pages/MindsetResetPage';
import MyJournalEntries from './pages/MyJournalEntries';
import NotificationSettings from './pages/NotificationSettings';
import Notifications from './pages/Notifications';
import Nutrition from './pages/Nutrition';
import NutritionArticle from './pages/NutritionArticle';
import NutritionGuidance from './pages/NutritionGuidance';
import PersonalGrowth from './pages/PersonalGrowth';
import PhotoGallery from './pages/PhotoGallery';
import PlanDetail from './pages/PlanDetail';
import Plans from './pages/Plans';
import Prayer from './pages/Prayer';
import Profile from './pages/Profile';
import Search from './pages/Search';
import SelfCareChallengesPage from './pages/SelfCareChallengesPage';
import Settings from './pages/Settings';
import SpiritualGrowth from './pages/SpiritualGrowth';
import UserProfile from './pages/UserProfile';
import WeeklyReflectionPage from './pages/WeeklyReflectionPage';
import Wellness from './pages/Wellness';
import WorkoutCategoryPage from './pages/WorkoutCategoryPage';
import WorkoutProgress from './pages/WorkoutProgress';
import WorkoutTrends from './pages/WorkoutTrends';
import Workouts from './pages/Workouts';
import TermsAndConditions from './pages/TermsAndConditions';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Achievements": Achievements,
    "AffirmationsPage": AffirmationsPage,
    "Bible": Bible,
    "BibleBooks": BibleBooks,
    "Bookmarks": Bookmarks,
    "ChallengeDetail": ChallengeDetail,
    "ChallengeDetailPage": ChallengeDetailPage,
    "Community": Community,
    "DiscoverRecipes": DiscoverRecipes,
    "EmotionalCheckInPage": EmotionalCheckInPage,
    "FoodLogHistory": FoodLogHistory,
    "Friends": Friends,
    "GratitudeJournalPage": GratitudeJournalPage,
    "GroupDetail": GroupDetail,
    "Groups": Groups,
    "GrowthPathwaysPage": GrowthPathwaysPage,
    "HabitBuilderPage": HabitBuilderPage,
    "Home": Home,
    "IdentityInChristPage": IdentityInChristPage,
    "MealDetailView": MealDetailView,
    "Messages": Messages,
    "MindsetResetPage": MindsetResetPage,
    "MyJournalEntries": MyJournalEntries,
    "NotificationSettings": NotificationSettings,
    "Notifications": Notifications,
    "Nutrition": Nutrition,
    "NutritionArticle": NutritionArticle,
    "NutritionGuidance": NutritionGuidance,
    "PersonalGrowth": PersonalGrowth,
    "PhotoGallery": PhotoGallery,
    "PlanDetail": PlanDetail,
    "Plans": Plans,
    "Prayer": Prayer,
    "Profile": Profile,
    "Search": Search,
    "SelfCareChallengesPage": SelfCareChallengesPage,
    "Settings": Settings,
    "SpiritualGrowth": SpiritualGrowth,
    "UserProfile": UserProfile,
    "WeeklyReflectionPage": WeeklyReflectionPage,
    "Wellness": Wellness,
    "WorkoutCategoryPage": WorkoutCategoryPage,
    "WorkoutProgress": WorkoutProgress,
    "WorkoutTrends": WorkoutTrends,
    "Workouts": Workouts,
    "TermsAndConditions": TermsAndConditions,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};