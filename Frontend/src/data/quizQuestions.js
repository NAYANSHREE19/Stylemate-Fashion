// ──────────────────────────────────────────────────
//  StyleMate Quiz Questions — Centralized Data File
//  Fully scalable: add/remove questions without
//  touching any component logic.
// ──────────────────────────────────────────────────

export const QUIZ_QUESTIONS = [
  {
    id: "occasion",
    title: "What's the occasion?",
    subtitle: "Tell us where you're heading",
    type: "single",
    field: "occasion",
    options: [
      { id: "college", label: "Daily college wear",       icon: "🎒" },
      { id: "office",  label: "Office / corporate",       icon: "💼" },
      { id: "biz-casual", label: "Business casual",       icon: "👔" },
      { id: "date",    label: "Date night",               icon: "🌹" },
      { id: "wedding", label: "Wedding guest",            icon: "💍" },
      { id: "festive", label: "Festive (Diwali, Puja)",   icon: "🪔" },
      { id: "travel",  label: "Travel / airport",         icon: "✈️" },
      { id: "gym",     label: "Gym / active",             icon: "🏋️" },
      { id: "brunch",  label: "Brunch / café",            icon: "☕" },
      { id: "nightout",label: "Night out / club",         icon: "🎶" },
      { id: "family",  label: "Family function",          icon: "🏠" },
      { id: "interview",label: "Interview / professional",icon: "📋" },
    ],
  },
  {
    id: "style",
    title: "What's your style personality?",
    subtitle: "Pick up to 3 that describe you best",
    type: "multiple",
    maxSelect: 3,
    field: "stylePersonality",
    options: [
      { id: "minimalist",   label: "Minimalist",    icon: "⚪" },
      { id: "streetwear",   label: "Streetwear",    icon: "🧢" },
      { id: "classic",      label: "Classic",       icon: "🎩" },
      { id: "sporty",       label: "Sporty",        icon: "⚡" },
      { id: "bohemian",     label: "Bohemian",      icon: "🌸" },
      { id: "edgy",         label: "Edgy",          icon: "🖤" },
      { id: "preppy",       label: "Preppy",        icon: "🏫" },
      { id: "vintage",      label: "Vintage",       icon: "📻" },
      { id: "luxury",       label: "Luxury",        icon: "💎" },
      { id: "romantic",     label: "Romantic",      icon: "🌹" },
      { id: "indie",        label: "Indie / artsy", icon: "🎨" },
      { id: "smart-casual", label: "Smart casual",  icon: "👕" },
    ],
  },
  {
    id: "mood",
    title: "What's your mood / vibe?",
    subtitle: "Pick up to 2 that match how you want to feel",
    type: "multiple",
    maxSelect: 2,
    field: "mood",
    options: [
      { id: "confident",   label: "Confident",       icon: "💪" },
      { id: "chill",       label: "Chill / relaxed", icon: "😌" },
      { id: "bold",        label: "Bold / statement",icon: "🔥" },
      { id: "elegant",     label: "Elegant",         icon: "🌟" },
      { id: "cute",        label: "Cute / soft",     icon: "🎀" },
      { id: "mysterious",  label: "Mysterious",      icon: "🌙" },
      { id: "energetic",   label: "Energetic",       icon: "⚡" },
      { id: "professional",label: "Professional",    icon: "📊" },
      { id: "carefree",    label: "Carefree",        icon: "🎈" },
      { id: "romantic",    label: "Romantic",        icon: "💕" },
    ],
  },
  {
    id: "bodyType",
    title: "What's your body type?",
    subtitle: "Helps us find the most flattering cuts for you",
    type: "single",
    field: "bodyType",
    options: [
      { id: "slim",      label: "Slim",      icon: "🪶" },
      { id: "athletic",  label: "Athletic",  icon: "🏃" },
      { id: "average",   label: "Average",   icon: "🙂" },
      { id: "broad",     label: "Broad",     icon: "🏋️" },
      { id: "plus-size", label: "Plus-size", icon: "🌸" },
      { id: "petite",    label: "Petite",    icon: "🌱" },
      { id: "tall",      label: "Tall",      icon: "🗼" },
    ],
  },
  {
    id: "season",
    title: "What's the season / weather like?",
    subtitle: "We'll suggest fabrics and layers accordingly",
    type: "single",
    field: "season",
    options: [
      { id: "hot-summer",  label: "Hot summer",     icon: "☀️" },
      { id: "humid",       label: "Humid (coastal)", icon: "🌊" },
      { id: "rainy",       label: "Rainy",           icon: "🌧️" },
      { id: "mild-winter", label: "Mild winter",     icon: "🍂" },
      { id: "cold-winter", label: "Cold winter",     icon: "❄️" },
      { id: "all-season",  label: "All season",      icon: "🌈" },
    ],
  },
  {
    id: "budget",
    title: "What's your budget range?",
    subtitle: "We'll keep our suggestions within your comfort zone",
    type: "single",
    field: "budget",
    options: [
      { id: "under-1k",   label: "Under ₹1,000",       icon: "💚" },
      { id: "1k-3k",      label: "₹1,000 – ₹3,000",    icon: "💛" },
      { id: "3k-7k",      label: "₹3,000 – ₹7,000",    icon: "🧡" },
      { id: "7k-15k",     label: "₹7,000 – ₹15,000",   icon: "❤️" },
      { id: "luxury",     label: "Luxury (₹15,000+)",   icon: "💜" },
    ],
  },
];

// ── Initial state shape for React ──────────────────
export const INITIAL_QUIZ_STATE = QUIZ_QUESTIONS.reduce((acc, q) => {
  acc[q.id] = q.type === "multiple" ? [] : null;
  return acc;
}, {});
