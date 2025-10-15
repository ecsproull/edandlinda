import {
  Home,
  Article,
  Map,
  School,
  Create,
  Edit,
  PersonAdd,
  ManageAccounts,
  LocationOn,
  List as ListIcon,
  AdminPanelSettings,
  EditNote,
  EditSquare,
} from '@mui/icons-material';
import CollectionsBookmarkIcon from '@mui/icons-material/CollectionsBookmark';

const ALL_ROLES = ['Admin', 'Creator', 'Commentor', 'Manuals', 'User'];
const CONTENT_ROLES = ['Admin', 'Creator'];
const ADMIN_ONLY = ['Admin'];

const sidebarListItems = [
  {
    id: 1,
    label: 'Home',
    icon: Home,
    path: '/home',
    allowedRoles: ALL_ROLES,
  },
  {
    id: 2,
    label: 'Blog',
    icon: Article,
    path: '/blog',
    allowedRoles: ALL_ROLES,
  },
  {
    id: 3,
    label: 'Map',
    icon: Map,
    path: '/map',
    allowedRoles: ALL_ROLES,
  },
  {
    id: 4,
    label: 'Trip List',
    icon: ListIcon,
    path: '/triplist',
    allowedRoles: ALL_ROLES,
  },
  {
    id: 5,
    label: 'Education',
    icon: School,
    path: '/education',
    allowedRoles: ALL_ROLES, 
  },
  {
    id: 6,
    label: 'Discovery Manuals',
    icon: CollectionsBookmarkIcon,
    path: '/manuals',
    allowedRoles: ALL_ROLES, 
  },
  {
    id: 7,
    label: 'Content Management',
    icon: EditNote,
    allowedRoles: CONTENT_ROLES,
    subItems: [
      {
        id: 71,
        label: 'Create Blog',
        icon: Create,
        path: '/create-blog',
        allowedRoles: CONTENT_ROLES,
      },
      {
        id: 72,
        label: 'Edit Blogs',
        icon: EditSquare,
        path: '/edit-blogs',
        allowedRoles: CONTENT_ROLES,
      },
    ],
  },
  {
    id: 8,
    label: 'Administration',
    icon: AdminPanelSettings,
    allowedRoles: ADMIN_ONLY,
    subItems: [
      {
        id: 81,
        label: 'Manage Users',
        icon: ManageAccounts,
        path: '/edit-users',
        allowedRoles: ADMIN_ONLY, 
      },
      {
        id: 82,
        label: 'Add User',
        icon: PersonAdd,
        path: '/signup',
        allowedRoles: ADMIN_ONLY, 
      },
      {
        id: 83,
        label: 'Manage Places',
        icon: LocationOn,
        path: '/edit-places',
        allowedRoles: ADMIN_ONLY, 
      },
      {
        id: 84,
        label: 'Add Place',
        icon: LocationOn,
        path: '/add-place',
        allowedRoles: ADMIN_ONLY, 
      },
    ],
  },
];

export default sidebarListItems;