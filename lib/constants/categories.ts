import {
  MusicIcon,
  FolderIcon,
  BriefcaseIcon,
  ViewIcon,
  GlassIcon,
  BallIcon,
} from '@/utils/icons';

/**
 * Category interface defining the structure of each category
 */
export interface Category {
  id: string;
  label: string;
  icon: React.FC<{ className?: string }>;
  description?: string;
}

/**
 * Categories constant mapping each category to its corresponding custom icon component
 * 
 * Categories:
 * - Music & Concerts: Live music events, concerts, festivals
 * - Tech & Innovation: Technology conferences, hackathons, workshops
 * - Business & Networking: Professional networking, business conferences
 * - Arts & Culture: Art exhibitions, cultural events, theater
 * - Food & Lifestyle: Food festivals, culinary events, lifestyle experiences
 * - Sports & Fitness: Sports events, fitness activities, competitions
 */
export const categories: Category[] = [
  {
    id: 'music',
    label: 'Music & Concerts',
    icon: MusicIcon,
    description: 'Live music events, concerts, and festivals',
  },
  {
    id: 'tech',
    label: 'Tech & Innovation',
    icon: FolderIcon,
    description: 'Technology conferences, hackathons, and workshops',
  },
  {
    id: 'business',
    label: 'Business & Networking',
    icon: BriefcaseIcon,
    description: 'Professional networking and business conferences',
  },
  {
    id: 'arts',
    label: 'Arts & Culture',
    icon: ViewIcon,
    description: 'Art exhibitions, cultural events, and theater',
  },
  {
    id: 'food',
    label: 'Food & Lifestyle',
    icon: GlassIcon,
    description: 'Food festivals, culinary events, and lifestyle experiences',
  },
  {
    id: 'sports',
    label: 'Sports & Fitness',
    icon: BallIcon,
    description: 'Sports events, fitness activities, and competitions',
  },
];

/**
 * Helper function to get a category by its ID
 */
export const getCategoryById = (id: string): Category | undefined => {
  return categories.find((category) => category.id === id);
};

/**
 * Helper function to get a category by its label
 */
export const getCategoryByLabel = (label: string): Category | undefined => {
  return categories.find((category) => category.label === label);
};
