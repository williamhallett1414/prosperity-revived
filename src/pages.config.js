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
import { lazy } from 'react';
const Achievements = lazy(() => import('./pages/Achievements'));
const AffirmationsPage = lazy(() => import('./pages/AffirmationsPage'));
const Bible = lazy(() => import('./pages/Bible'));
const BibleBooks = lazy(() => import('./pages/BibleBooks'));
const Bookmarks = lazy(() => import('./pages/Bookmarks'));
const ChallengeDetailPage = lazy(() => import('./pages/ChallengeDetailPage'));
const CoachingPlanDetail = lazy(() => import('./pages/CoachingPlanDetail'));
const CoachingPlanPage = lazy(() => import('./pages/CoachingPlanPage'));
const CouplesMode = lazy(() => import('./pages/CouplesMode'));
const CoachingPlans = lazy(() => import('./pages/CoachingPlans'));
const Community = lazy(() => import('./pages/Community'));
const DiscoverRecipes = lazy(() => import('./pages/DiscoverRecipes'));
const EmotionalCheckInPage = lazy(() => import('./pages/EmotionalCheckInPage'));
const FoodLogHistory = lazy(() => import('./pages/FoodLogHistory'));
const Friends = lazy(() => import('./pages/Friends'));
const GratitudeJournalPage = lazy(() => import('./pages/GratitudeJournalPage'));
const GroupDetail = lazy(() => import('./pages/GroupDetail'));
const GroupPlanDetail = lazy(() => import('./pages/GroupPlanDetail'));
const Groups = lazy(() => import('./pages/Groups'));
const GrowthPathwaysPage = lazy(() => import('./pages/GrowthPathwaysPage'));
const GuidedMeditationsPage = lazy(() => import('./pages/GuidedMeditationsPage'));
const HabitBuilderPage = lazy(() => import('./pages/HabitBuilderPage'));
const HealthWellnessWaiver = lazy(() => import('./pages/HealthWellnessWaiver'));
const Home = lazy(() => import('./pages/Home'));
const IdentityInChristPage = lazy(() => import('./pages/IdentityInChristPage'));
const MealDetailView = lazy(() => import('./pages/MealDetailView'));
const Messages = lazy(() => import('./pages/Messages'));
const MindsetResetPage = lazy(() => import('./pages/MindsetResetPage'));
const MyJournalEntries = lazy(() => import('./pages/MyJournalEntries'));
const NotificationSettings = lazy(() => import('./pages/NotificationSettings'));
const Notifications = lazy(() => import('./pages/Notifications'));
const Nutrition = lazy(() => import('./pages/Nutrition'));
const NutritionArticle = lazy(() => import('./pages/NutritionArticle'));
const NutritionGuidance = lazy(() => import('./pages/NutritionGuidance'));
const Paywall = lazy(() => import('./pages/Paywall'));
const PersonalGrowth = lazy(() => import('./pages/PersonalGrowth'));
const PhotoGallery = lazy(() => import('./pages/PhotoGallery'));
const PlanDetail = lazy(() => import('./pages/PlanDetail'));
const Plans = lazy(() => import('./pages/Plans'));
const Prayer = lazy(() => import('./pages/Prayer'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const Profile = lazy(() => import('./pages/Profile'));
const ProgressDashboard = lazy(() => import('./pages/ProgressDashboard'));
const Search = lazy(() => import('./pages/Search'));
const Settings = lazy(() => import('./pages/Settings'));
const SpiritualGrowth = lazy(() => import('./pages/SpiritualGrowth'));
const SpiritualInsights = lazy(() => import('./pages/SpiritualInsights'));
const SubscriptionTerms = lazy(() => import('./pages/SubscriptionTerms'));
const TermsAndConditions = lazy(() => import('./pages/TermsAndConditions'));
const UserProfile = lazy(() => import('./pages/UserProfile'));
const WeeklyReflectionPage = lazy(() => import('./pages/WeeklyReflectionPage'));
const Wellness = lazy(() => import('./pages/Wellness'));
const WorkoutCategoryPage = lazy(() => import('./pages/WorkoutCategoryPage'));
const WorkoutPlanner = lazy(() => import('./pages/WorkoutPlanner'));
const WorkoutProgress = lazy(() => import('./pages/WorkoutProgress'));
const WorkoutTrends = lazy(() => import('./pages/WorkoutTrends'));
const Workouts = lazy(() => import('./pages/Workouts'));
const FitnessGoalsPage = lazy(() => import('./pages/FitnessGoalsPage'));
const NutritionGoalsPage = lazy(() => import('./pages/NutritionGoalsPage'));
const BibleGoalsPage = lazy(() => import('./pages/BibleGoalsPage'));
const PersonalGrowthGoalsPage = lazy(() => import('./pages/PersonalGrowthGoalsPage'));
const ChatScreen = lazy(() => import('./pages/ChatScreen'));
const DarkNightDevotionals = lazy(() => import('./pages/DarkNightDevotionals'));
const FastingTracker = lazy(() => import('./pages/FastingTracker'));
const PrayerPartners = lazy(() => import('./pages/PrayerPartners'));
const SpiritualAssessment = lazy(() => import('./pages/SpiritualAssessment'));
const RepentanceJournal = lazy(() => import('./pages/RepentanceJournal'));
const Awakening = lazy(() => import('./pages/Awakening'));
const FirstWeek = lazy(() => import('./pages/FirstWeek'));
import __Layout from './Layout.jsx';


export const PAGES = {
    "Achievements": Achievements,
    "AffirmationsPage": AffirmationsPage,
    "Bible": Bible,
    "BibleBooks": BibleBooks,
    "Bookmarks": Bookmarks,
    "ChallengeDetailPage": ChallengeDetailPage,
    "CoachingPlanDetail": CoachingPlanDetail,
    "CoachingPlanPage": CoachingPlanPage,
    "CouplesMode": CouplesMode,
    "CoachingPlans": CoachingPlans,
    "Community": Community,
    "DiscoverRecipes": DiscoverRecipes,
    "EmotionalCheckInPage": EmotionalCheckInPage,
    "FoodLogHistory": FoodLogHistory,
    "Friends": Friends,
    "GratitudeJournalPage": GratitudeJournalPage,
    "GroupDetail": GroupDetail,
    "GroupPlanDetail": GroupPlanDetail,
    "Groups": Groups,
    "GrowthPathwaysPage": GrowthPathwaysPage,
    "GuidedMeditationsPage": GuidedMeditationsPage,
    "HabitBuilderPage": HabitBuilderPage,
    "HealthWellnessWaiver": HealthWellnessWaiver,
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
    "PrivacyPolicy": PrivacyPolicy,
    "Profile": Profile,
    "ProgressDashboard": ProgressDashboard,
    "Search": Search,
    "Settings": Settings,
    "SpiritualGrowth": SpiritualGrowth,
    "SpiritualInsights": SpiritualInsights,
    "SubscriptionTerms": SubscriptionTerms,
    "TermsAndConditions": TermsAndConditions,
    "UserProfile": UserProfile,
    "WeeklyReflectionPage": WeeklyReflectionPage,
    "Wellness": Wellness,
    "WorkoutCategoryPage": WorkoutCategoryPage,
    "WorkoutPlanner": WorkoutPlanner,
    "WorkoutProgress": WorkoutProgress,
    "WorkoutTrends": WorkoutTrends,
    "FitnessGoalsPage": FitnessGoalsPage,
    "NutritionGoalsPage": NutritionGoalsPage,
    "BibleGoalsPage": BibleGoalsPage,
    "PersonalGrowthGoalsPage": PersonalGrowthGoalsPage,
    "Workouts": Workouts,
    "ChatScreen": ChatScreen,
    "DarkNightDevotionals": DarkNightDevotionals,
    "FastingTracker": FastingTracker,
    "PrayerPartners": PrayerPartners,
    "SpiritualAssessment": SpiritualAssessment,
    "RepentanceJournal": RepentanceJournal,
    "Awakening": Awakening,
    "FirstWeek": FirstWeek,
    "Paywall": Paywall,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};