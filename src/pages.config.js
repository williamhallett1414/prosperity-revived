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
import Community from './pages/Community';
import DiscoverRecipes from './pages/DiscoverRecipes';
import GroupDetail from './pages/GroupDetail';
import GroupPlanDetail from './pages/GroupPlanDetail';
import Home from './pages/Home';
import Messages from './pages/Messages';
import NotificationSettings from './pages/NotificationSettings';
import Nutrition from './pages/Nutrition';
import PhotoGallery from './pages/PhotoGallery';
import PlanDetail from './pages/PlanDetail';
import Prayer from './pages/Prayer';
import ProgressDashboard from './pages/ProgressDashboard';
import Settings from './pages/Settings';
import UserProfile from './pages/UserProfile';
import Wellness from './pages/Wellness';
import WorkoutCategoryPage from './pages/WorkoutCategoryPage';
import WorkoutProgress from './pages/WorkoutProgress';
import Workouts from './pages/Workouts';
import Profile from './pages/Profile';
import AffirmationsPage from './pages/AffirmationsPage';
import EmotionalCheckInPage from './pages/EmotionalCheckInPage';
import GratitudeJournalPage from './pages/GratitudeJournalPage';
import GrowthPathwaysPage from './pages/GrowthPathwaysPage';
import GuidedMeditationsPage from './pages/GuidedMeditationsPage';
import HabitBuilderPage from './pages/HabitBuilderPage';
import IdentityInChristPage from './pages/IdentityInChristPage';
import MindsetResetPage from './pages/MindsetResetPage';
import PersonalGrowth from './pages/PersonalGrowth';
import WeeklyReflectionPage from './pages/WeeklyReflectionPage';
import Bible from './pages/Bible';
import BibleBooks from './pages/BibleBooks';
import Bookmarks from './pages/Bookmarks';
import ChallengeDetailPage from './pages/ChallengeDetailPage';
import FoodLogHistory from './pages/FoodLogHistory';
import Friends from './pages/Friends';
import Groups from './pages/Groups';
import HealthWellnessWaiver from './pages/HealthWellnessWaiver';
import MealDetailView from './pages/MealDetailView';
import MyJournalEntries from './pages/MyJournalEntries';
import Notifications from './pages/Notifications';
import NutritionArticle from './pages/NutritionArticle';
import NutritionGuidance from './pages/NutritionGuidance';
import Plans from './pages/Plans';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Search from './pages/Search';
import SelfCareChallengesPage from './pages/SelfCareChallengesPage';
import SpiritualGrowth from './pages/SpiritualGrowth';
import SpiritualInsights from './pages/SpiritualInsights';
import SubscriptionTerms from './pages/SubscriptionTerms';
import TermsAndConditions from './pages/TermsAndConditions';
import WorkoutTrends from './pages/WorkoutTrends';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Achievements": Achievements,
    "Community": Community,
    "DiscoverRecipes": DiscoverRecipes,
    "GroupDetail": GroupDetail,
    "GroupPlanDetail": GroupPlanDetail,
    "Home": Home,
    "Messages": Messages,
    "NotificationSettings": NotificationSettings,
    "Nutrition": Nutrition,
    "PhotoGallery": PhotoGallery,
    "PlanDetail": PlanDetail,
    "Prayer": Prayer,
    "ProgressDashboard": ProgressDashboard,
    "Settings": Settings,
    "UserProfile": UserProfile,
    "Wellness": Wellness,
    "WorkoutCategoryPage": WorkoutCategoryPage,
    "WorkoutProgress": WorkoutProgress,
    "Workouts": Workouts,
    "Profile": Profile,
    "AffirmationsPage": AffirmationsPage,
    "EmotionalCheckInPage": EmotionalCheckInPage,
    "GratitudeJournalPage": GratitudeJournalPage,
    "GrowthPathwaysPage": GrowthPathwaysPage,
    "GuidedMeditationsPage": GuidedMeditationsPage,
    "HabitBuilderPage": HabitBuilderPage,
    "IdentityInChristPage": IdentityInChristPage,
    "MindsetResetPage": MindsetResetPage,
    "PersonalGrowth": PersonalGrowth,
    "WeeklyReflectionPage": WeeklyReflectionPage,
    "Bible": Bible,
    "BibleBooks": BibleBooks,
    "Bookmarks": Bookmarks,
    "ChallengeDetailPage": ChallengeDetailPage,
    "FoodLogHistory": FoodLogHistory,
    "Friends": Friends,
    "Groups": Groups,
    "HealthWellnessWaiver": HealthWellnessWaiver,
    "MealDetailView": MealDetailView,
    "MyJournalEntries": MyJournalEntries,
    "Notifications": Notifications,
    "NutritionArticle": NutritionArticle,
    "NutritionGuidance": NutritionGuidance,
    "Plans": Plans,
    "PrivacyPolicy": PrivacyPolicy,
    "Search": Search,
    "SelfCareChallengesPage": SelfCareChallengesPage,
    "SpiritualGrowth": SpiritualGrowth,
    "SpiritualInsights": SpiritualInsights,
    "SubscriptionTerms": SubscriptionTerms,
    "TermsAndConditions": TermsAndConditions,
    "WorkoutTrends": WorkoutTrends,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};