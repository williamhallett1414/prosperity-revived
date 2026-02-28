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
import BibleBooks from './pages/BibleBooks';
import Bookmarks from './pages/Bookmarks';
import DiscoverRecipes from './pages/DiscoverRecipes';
import EmotionalCheckInPage from './pages/EmotionalCheckInPage';
import Friends from './pages/Friends';
import GratitudeJournalPage from './pages/GratitudeJournalPage';
import GroupPlanDetail from './pages/GroupPlanDetail';
import Groups from './pages/Groups';
import GrowthPathwaysPage from './pages/GrowthPathwaysPage';
import HabitBuilderPage from './pages/HabitBuilderPage';
import HealthWellnessWaiver from './pages/HealthWellnessWaiver';
import IdentityInChristPage from './pages/IdentityInChristPage';
import Messages from './pages/Messages';
import MindsetResetPage from './pages/MindsetResetPage';
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
import PrivacyPolicy from './pages/PrivacyPolicy';
import Profile from './pages/Profile';
import Search from './pages/Search';
import SelfCareChallengesPage from './pages/SelfCareChallengesPage';
import Settings from './pages/Settings';
import SpiritualGrowth from './pages/SpiritualGrowth';
import SubscriptionTerms from './pages/SubscriptionTerms';
import TermsAndConditions from './pages/TermsAndConditions';
import WeeklyReflectionPage from './pages/WeeklyReflectionPage';
import Wellness from './pages/Wellness';
import WorkoutProgress from './pages/WorkoutProgress';
import Workouts from './pages/Workouts';
import Bible from './pages/Bible';
import ChallengeDetailPage from './pages/ChallengeDetailPage';
import Community from './pages/Community';
import FoodLogHistory from './pages/FoodLogHistory';
import GroupDetail from './pages/GroupDetail';
import Home from './pages/Home';
import MealDetailView from './pages/MealDetailView';
import MyJournalEntries from './pages/MyJournalEntries';
import ProgressDashboard from './pages/ProgressDashboard';
import SpiritualInsights from './pages/SpiritualInsights';
import UserProfile from './pages/UserProfile';
import WorkoutCategoryPage from './pages/WorkoutCategoryPage';
import WorkoutTrends from './pages/WorkoutTrends';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Achievements": Achievements,
    "AffirmationsPage": AffirmationsPage,
    "BibleBooks": BibleBooks,
    "Bookmarks": Bookmarks,
    "DiscoverRecipes": DiscoverRecipes,
    "EmotionalCheckInPage": EmotionalCheckInPage,
    "Friends": Friends,
    "GratitudeJournalPage": GratitudeJournalPage,
    "GroupPlanDetail": GroupPlanDetail,
    "Groups": Groups,
    "GrowthPathwaysPage": GrowthPathwaysPage,
    "HabitBuilderPage": HabitBuilderPage,
    "HealthWellnessWaiver": HealthWellnessWaiver,
    "IdentityInChristPage": IdentityInChristPage,
    "Messages": Messages,
    "MindsetResetPage": MindsetResetPage,
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
    "PrivacyPolicy": PrivacyPolicy,
    "Profile": Profile,
    "Search": Search,
    "SelfCareChallengesPage": SelfCareChallengesPage,
    "Settings": Settings,
    "SpiritualGrowth": SpiritualGrowth,
    "SubscriptionTerms": SubscriptionTerms,
    "TermsAndConditions": TermsAndConditions,
    "WeeklyReflectionPage": WeeklyReflectionPage,
    "Wellness": Wellness,
    "WorkoutProgress": WorkoutProgress,
    "Workouts": Workouts,
    "Bible": Bible,
    "ChallengeDetailPage": ChallengeDetailPage,
    "Community": Community,
    "FoodLogHistory": FoodLogHistory,
    "GroupDetail": GroupDetail,
    "Home": Home,
    "MealDetailView": MealDetailView,
    "MyJournalEntries": MyJournalEntries,
    "ProgressDashboard": ProgressDashboard,
    "SpiritualInsights": SpiritualInsights,
    "UserProfile": UserProfile,
    "WorkoutCategoryPage": WorkoutCategoryPage,
    "WorkoutTrends": WorkoutTrends,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};