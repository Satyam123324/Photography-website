// Central list of photographer categories — matches the backend enum on PhotographerProfile.
export const CATEGORIES = [
  { key: 'wedding', label: 'Wedding', icon: '💍' },
  { key: 'pre-wedding', label: 'Pre-Wedding', icon: '🌸' },
  { key: 'post-wedding', label: 'Post-Wedding', icon: '🥂' },
  { key: 'portrait', label: 'Portrait', icon: '🎨' },
  { key: 'fashion', label: 'Fashion', icon: '✨' },
  { key: 'modeling', label: 'Modeling', icon: '👗' },
  { key: 'event', label: 'Events', icon: '🎉' },
  { key: 'product', label: 'Product', icon: '📦' },
  { key: 'wildlife', label: 'Wildlife', icon: '🦅' },
  { key: 'travel', label: 'Travel', icon: '🌍' },
  { key: 'food', label: 'Food', icon: '🍽️' },
  { key: 'architecture', label: 'Architecture', icon: '🏛️' },
  { key: 'sports', label: 'Sports', icon: '🏅' },
  { key: 'newborn', label: 'Newborn', icon: '👶' },
  { key: 'maternity', label: 'Maternity', icon: '🤱' },
]

export const CATEGORY_LABELS = Object.fromEntries(CATEGORIES.map((c) => [c.key, c.label]))

// A curated subset for the home page tiles.
export const FEATURED_CATEGORIES = ['wedding', 'portrait', 'fashion', 'event', 'wildlife', 'newborn']
